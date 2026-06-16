/**
 * POST /api/auth/sudo/request
 *
 * Issues a sudo-purpose MFA pending token for the authenticated user.
 * The client receives the token and shows a 6-digit-code prompt; the
 * user submits the code to /api/auth/sudo which consumes the token and
 * sets the sudo cookie.
 *
 * Auth: requires an authenticated admin/facilitator with MFA enrolled.
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/request-auth';
import { prisma } from '@/lib/prisma';
import { ADMIN_ROLES, FACILITATOR_ROLES, type Role } from '@/lib/roles';
import { issuePendingToken } from '@/lib/mfa/pending';
import { logger, safeError } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (auth.error) return auth.error;

  const role = auth.user.role as Role;
  const allowedRoles: readonly Role[] = [...ADMIN_ROLES, ...FACILITATOR_ROLES];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Sudo mode is only for admin and facilitator accounts' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: { id: true, mfaEnabled: true },
  });
  if (!user || !user.mfaEnabled) {
    return NextResponse.json({ error: 'MFA must be enrolled to enter sudo mode' }, { status: 400 });
  }

  try {
    const issued = await issuePendingToken({
      userId: user.id,
      purpose: 'sudo',
      ttlSeconds: 5 * 60, // 5 min to enter the code
    });
    return NextResponse.json({
      pendingToken: issued.token,
      expiresAt: issued.expiresAt.toISOString(),
    });
  } catch (err) {
    logger.error('sudo/request: issuePendingToken failed', { error: safeError(err) });
    return NextResponse.json({ error: 'Failed to issue sudo challenge' }, { status: 500 });
  }
}
