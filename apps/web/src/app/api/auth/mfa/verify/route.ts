/**
 * POST /api/auth/mfa/verify
 *
 * Step 2 of enrollment. The user submits the first 6-digit code from
 * their authenticator app. On success:
 *  - mfaEnabled = true
 *  - mfaEnrolledAt = now
 *  - 10 backup codes are generated, hashed, and stored
 *  - the plaintext backup codes are returned ONCE to the client for
 *    the user to record
 *
 * Auth: requires an authenticated admin/facilitator. The user's record
 * must have a stored encrypted secret (from /mfa/setup) but mfaEnabled
 * must still be false.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/request-auth';
import { prisma } from '@/lib/prisma';
import { ADMIN_ROLES, FACILITATOR_ROLES, type Role } from '@/lib/roles';
import {
  decryptTotpSecret,
  generateBackupCodes,
  hashBackupCode,
  verifyTotpCode,
} from '@/lib/mfa';
import { logger, safeError } from '@/lib/logger';
import { logSecurityEvent } from '@/lib/security/audit';

const verifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
});

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (auth.error) return auth.error;

  const role = auth.user.role as Role;
  const allowedRoles: readonly Role[] = [...ADMIN_ROLES, ...FACILITATOR_ROLES];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'MFA is only available to admin and facilitator accounts' }, { status: 403 });
  }

  let body: z.infer<typeof verifySchema>;
  try {
    const json = await req.json();
    const parsed = verifySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: {
      id: true,
      mfaEnabled: true,
      mfaSecretEnc: true,
      mfaSecretIv: true,
      mfaSecretTag: true,
    },
  });
  if (!user || !user.mfaSecretEnc || !user.mfaSecretIv || !user.mfaSecretTag) {
    return NextResponse.json({ error: 'MFA setup not started. Call /api/auth/mfa/setup first.' }, { status: 400 });
  }
  if (user.mfaEnabled) {
    return NextResponse.json({ error: 'MFA is already enrolled' }, { status: 409 });
  }

  let secret: string;
  try {
    secret = decryptTotpSecret({
      ciphertext: user.mfaSecretEnc,
      iv: user.mfaSecretIv,
      tag: user.mfaSecretTag,
    });
  } catch (err) {
    logger.error('MFA verify: decrypt failed', { error: safeError(err) });
    return NextResponse.json({ error: 'Stored secret is corrupt or key mismatch' }, { status: 500 });
  }

  if (!verifyTotpCode(secret, body.code)) {
    await logSecurityEvent({
      eventType: 'MFA_CHALLENGE_FAILURE',
      outcome: 'FAILURE',
      actorId: user.id,
      failureReason: 'invalid_totp_during_enrollment',
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
    });
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  // Generate and hash 10 backup codes.
  const plainCodes = generateBackupCodes();
  const hashedCodes = await Promise.all(plainCodes.map(hashBackupCode));

  // Flip mfaEnabled, set timestamps, and store the hashed backup codes.
  // The plaintext codes go to the user — never persisted.
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          mfaEnabled: true,
          mfaEnrolledAt: new Date(),
          lastMfaVerifiedAt: new Date(),
        },
      }),
      prisma.mfaBackupCode.deleteMany({ where: { userId: user.id, usedAt: null } }),
      prisma.mfaBackupCode.createMany({
        data: hashedCodes.map((codeHash) => ({ userId: user.id, codeHash })),
      }),
    ]);
  } catch (err) {
    logger.error('MFA verify: enrollment transaction failed', { error: safeError(err) });
    return NextResponse.json({ error: 'Failed to finalize enrollment' }, { status: 500 });
  }

  await logSecurityEvent({
    eventType: 'MFA_ENROLLED',
    outcome: 'SUCCESS',
    actorId: user.id,
    actorRole: role,
  });

  return NextResponse.json({
    success: true,
    backupCodes: plainCodes, // returned ONCE
  });
}
