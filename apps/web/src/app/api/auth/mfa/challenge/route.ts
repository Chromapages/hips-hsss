/**
 * POST /api/auth/mfa/challenge
 *
 * Verifies a TOTP code or backup code at login (or sudo entry). The
 * caller must have a valid MFA pending token in the `pendingToken`
 * field. On success, the pending token is consumed and a full session
 * is established.
 *
 * Auth: NO Firebase ID token required. The pendingToken is the auth.
 * This is the moment the user proves they own the second factor.
 *
 * On success, returns { destination, userId, role } so the client can
 * redirect to the originally-requested URL.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { consumePendingToken } from '@/lib/mfa/pending';
import {
  decryptTotpSecret,
  verifyBackupCode,
  verifyTotpCode,
} from '@/lib/mfa';
import { logger, safeError } from '@/lib/logger';
import { logSecurityEvent } from '@/lib/security/audit';

const challengeSchema = z.object({
  pendingToken: z.string().min(1),
  code: z.string().min(6).max(20),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof challengeSchema>;
  try {
    const json = await req.json();
    const parsed = challengeSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 1. Consume the pending token. This atomically marks it used and
  //    returns the userId / purpose / destination.
  const consumed = await consumePendingToken(body.pendingToken);
  if (!consumed.ok) {
    return NextResponse.json({ error: `pending_token_${consumed.reason}` }, { status: 401 });
  }
  if (consumed.purpose !== 'login' && consumed.purpose !== 'sudo') {
    return NextResponse.json({ error: 'pending_token_wrong_purpose' }, { status: 400 });
  }

  // 2. Load the user + their MFA material.
  const user = await prisma.user.findUnique({
    where: { id: consumed.userId },
    select: {
      id: true,
      email: true,
      role: true,
      mfaEnabled: true,
      mfaSecretEnc: true,
      mfaSecretIv: true,
      mfaSecretTag: true,
    },
  });
  if (!user || !user.mfaEnabled || !user.mfaSecretEnc || !user.mfaSecretIv || !user.mfaSecretTag) {
    return NextResponse.json({ error: 'MFA not enrolled for this user' }, { status: 400 });
  }

  // 3. Try the code. Accept TOTP (6 digits) OR a backup code (10 chars +
  //    dash, like ABCDE-FGHJK). Reject anything else before doing crypto.
  const code = body.code.trim();
  const isTotp = /^\d{6}$/.test(code);
  const isBackup = /^[A-Z0-9]{5}-[A-Z0-9]{5}$/i.test(code);

  if (!isTotp && !isBackup) {
    return NextResponse.json({ error: 'Invalid code format' }, { status: 400 });
  }

  let valid = false;
  let usedBackupCodeId: string | null = null;

  if (isTotp) {
    try {
      const secret = decryptTotpSecret({
        ciphertext: user.mfaSecretEnc,
        iv: user.mfaSecretIv,
        tag: user.mfaSecretTag,
      });
      valid = verifyTotpCode(secret, code);
    } catch (err) {
      logger.error('MFA challenge: decrypt failed', { error: safeError(err) });
      return NextResponse.json({ error: 'Stored secret is corrupt' }, { status: 500 });
    }
  } else {
    // Backup code path
    const candidates = await prisma.mfaBackupCode.findMany({
      where: { userId: user.id, usedAt: null },
      select: { id: true, codeHash: true },
    });
    const result = await verifyBackupCode(candidates, code);
    if (result) {
      valid = true;
      usedBackupCodeId = result.id;
    }
  }

  if (!valid) {
    await logSecurityEvent({
      eventType: 'MFA_CHALLENGE_FAILURE',
      outcome: 'FAILURE',
      actorId: user.id,
      actorRole: user.role,
      failureReason: 'invalid_code',
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
    });
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  // 4. Success — burn the backup code if one was used, update lastMfaVerifiedAt.
  if (usedBackupCodeId) {
    await prisma.mfaBackupCode.update({
      where: { id: usedBackupCodeId },
      data: { usedAt: new Date() },
    });
    await logSecurityEvent({
      eventType: 'MFA_BACKUP_CODE_USED',
      outcome: 'SUCCESS',
      actorId: user.id,
      actorRole: user.role,
      targetType: 'backup_code',
      targetId: usedBackupCodeId,
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastMfaVerifiedAt: new Date() },
    });
    await logSecurityEvent({
      eventType: 'MFA_CHALLENGE_SUCCESS',
      outcome: 'SUCCESS',
      actorId: user.id,
      actorRole: user.role,
    });
  }

  // 5. The actual session cookie is set by the client on the next step —
  //    the original Firebase ID token is still valid (it just had a
  //    pending token attached to it). The client should now re-submit
  //    its original session-establishment flow with the verified claim,
  //    OR for sudo, the client sets the sudoToken cookie we return.
  return NextResponse.json({
    success: true,
    userId: user.id,
    role: user.role,
    purpose: consumed.purpose,
    destination: consumed.destination,
  });
}
