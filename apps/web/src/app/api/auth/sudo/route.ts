/**
 * POST /api/auth/sudo
 *
 * Re-verify MFA to enter sudo mode. The caller must have a valid
 * `pendingToken` from /api/auth/mfa/challenge (purpose='sudo') and a
 * valid Firebase ID token in the Authorization header.
 *
 * On success, sets the `sudo_token` HttpOnly cookie (15-minute TTL)
 * and returns 200.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/request-auth';
import { prisma } from '@/lib/prisma';
import { consumePendingToken } from '@/lib/mfa/pending';
import {
  decryptTotpSecret,
  verifyBackupCode,
  verifyTotpCode,
} from '@/lib/mfa';
import { issueSudoToken, clearSudoToken } from '@/lib/sudo';
import { logger, safeError } from '@/lib/logger';
import { logSecurityEvent } from '@/lib/security/audit';

const schema = z.object({
  pendingToken: z.string().min(1),
  code: z.string().min(6).max(20),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof schema>;
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Caller must also be authenticated (Firebase ID token). The sudo
  // grant is bound to that user.
  const auth = await authenticateRequest(req);
  if (auth.error) return auth.error;

  // Consume the pending token — must be purpose='sudo'.
  const consumed = await consumePendingToken(body.pendingToken);
  if (!consumed.ok) {
    return NextResponse.json({ error: `pending_token_${consumed.reason}` }, { status: 401 });
  }
  if (consumed.purpose !== 'sudo') {
    return NextResponse.json({ error: 'pending_token_wrong_purpose' }, { status: 400 });
  }
  // The pending token's userId must match the authenticated user.
  if (consumed.userId !== auth.user.id) {
    await logSecurityEvent({
      eventType: 'SUDO_MODE_FAILED',
      outcome: 'FAILURE',
      actorId: auth.user.id,
      actorRole: auth.user.role,
      failureReason: 'pending_token_user_mismatch',
    });
    return NextResponse.json({ error: 'pending_token_user_mismatch' }, { status: 403 });
  }

  // Verify the code (TOTP or backup) against the user's stored material.
  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: {
      id: true,
      role: true,
      mfaEnabled: true,
      mfaSecretEnc: true,
      mfaSecretIv: true,
      mfaSecretTag: true,
    },
  });
  if (!user || !user.mfaEnabled || !user.mfaSecretEnc || !user.mfaSecretIv || !user.mfaSecretTag) {
    return NextResponse.json({ error: 'MFA not enrolled' }, { status: 400 });
  }

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
      logger.error('sudo: decrypt failed', { error: safeError(err) });
      return NextResponse.json({ error: 'Stored secret is corrupt' }, { status: 500 });
    }
  } else {
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
      eventType: 'SUDO_MODE_FAILED',
      outcome: 'FAILURE',
      actorId: user.id,
      actorRole: user.role,
      failureReason: 'invalid_code',
    });
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  // Burn backup code if used; otherwise update lastMfaVerifiedAt.
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
  }

  // Issue the sudo cookie. issueSudoToken() uses cookies() — but we're
  // in a route handler returning a NextResponse. Set the cookie directly
  // on the response to be safe.
  const token = await issueSudoToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({ success: true, sudoToken: token, expiresInSeconds: 15 * 60 });
  res.cookies.set({
    name: 'sudo_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });
  return res;
}

/**
 * DELETE /api/auth/sudo — clear sudo mode.
 */
export async function DELETE() {
  await clearSudoToken();
  return NextResponse.json({ success: true });
}
