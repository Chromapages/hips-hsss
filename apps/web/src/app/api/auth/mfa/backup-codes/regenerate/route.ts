/**
 * POST /api/auth/mfa/backup-codes/regenerate
 *
 * Issues a fresh set of 10 backup codes for the authenticated user. The
 * old unused codes are invalidated (deleted, not just marked used).
 * Requires that the user has MFA enrolled and has recently verified
 * (lastMfaVerifiedAt within 4 hours).
 *
 * Auth: authenticated admin/facilitator with MFA enrolled.
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/request-auth';
import { prisma } from '@/lib/prisma';
import { ADMIN_ROLES, FACILITATOR_ROLES, type Role } from '@/lib/roles';
import { generateBackupCodes, hashBackupCode } from '@/lib/mfa';
import { logger, safeError } from '@/lib/logger';

const MAX_LAST_VERIFIED_AGE_MS = 4 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (auth.error) return auth.error;

  const role = auth.user.role as Role;
  const allowedRoles: readonly Role[] = [...ADMIN_ROLES, ...FACILITATOR_ROLES];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'MFA is only available to admin and facilitator accounts' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: { id: true, mfaEnabled: true, lastMfaVerifiedAt: true },
  });
  if (!user || !user.mfaEnabled) {
    return NextResponse.json({ error: 'MFA not enrolled' }, { status: 400 });
  }
  if (!user.lastMfaVerifiedAt || Date.now() - user.lastMfaVerifiedAt.getTime() > MAX_LAST_VERIFIED_AGE_MS) {
    return NextResponse.json({ error: 'Re-verify MFA before regenerating backup codes' }, { status: 401 });
  }

  const plainCodes = generateBackupCodes();
  const hashedCodes = await Promise.all(plainCodes.map(hashBackupCode));

  try {
    await prisma.$transaction([
      prisma.mfaBackupCode.deleteMany({ where: { userId: user.id } }),
      prisma.mfaBackupCode.createMany({
        data: hashedCodes.map((codeHash) => ({ userId: user.id, codeHash })),
      }),
    ]);
  } catch (err) {
    logger.error('backup-codes regenerate: transaction failed', { error: safeError(err) });
    return NextResponse.json({ error: 'Failed to regenerate backup codes' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    backupCodes: plainCodes,
  });
}
