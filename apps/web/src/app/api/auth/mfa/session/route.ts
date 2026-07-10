/**
 * POST /api/auth/mfa/session
 *
 * Layer 4 login-flow glue. The caller (login page) has just successfully
 * authenticated with Firebase and now has a valid ID token. This route
 * decides what happens next based on the user's MFA status:
 *
 *  - mfaEnabled = false (and role is admin/facilitator): return
 *    `{ status: 'mfa_setup_required' }`. The client should redirect to
 *    /mfa-setup and complete enrollment before accessing privileged
 *    routes.
 *
 *  - mfaEnabled = false (and role is participant): return
 *    `{ status: 'authenticated' }`. The client sets its session cookie
 *    (the Firebase ID token cookie is already in place).
 *
 *  - mfaEnabled = true: issue an MFA pending token (purpose='login'),
 *    return `{ status: 'mfa_required', pendingToken, destination }`.
 *    The client should redirect to /mfa-verify?token=<pendingToken>.
 *
 * Auth: a valid Firebase ID token in the Authorization header. The
 * caller's userId and role are derived from it.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/request-auth';
import { prisma } from '@/lib/prisma';
import { ADMIN_ROLES, FACILITATOR_ROLES, type Role } from '@/lib/roles';
import { issuePendingToken } from '@/lib/mfa/pending';
import { logger, safeError } from '@/lib/logger';
import { logSecurityEvent } from '@/lib/security/audit';

const schema = z.object({
  destination: z.string().optional(),
});

const MFA_REQUIRED_ROLES: readonly Role[] = [...ADMIN_ROLES, ...FACILITATOR_ROLES];

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (auth.error) return auth.error;

  let body: z.infer<typeof schema> = {};
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(json);
    if (parsed.success) body = parsed.data;
  } catch {
    // body is optional
  }

  const role = auth.user.role as Role;
  const requiresMfa = MFA_REQUIRED_ROLES.includes(role);

  let user: { id: string; email: string; mfaEnabled: boolean; lastMfaVerifiedAt: Date | null } | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: {
        id: true,
        email: true,
        mfaEnabled: true,
        lastMfaVerifiedAt: true,
      },
    });
  } catch (dbError) {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    if (isDemoMode) {
      user = {
        id: auth.user.id,
        email: auth.user.email,
        mfaEnabled: false,
        lastMfaVerifiedAt: null,
      };
    } else {
      throw dbError;
    }
  }
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Admin/facilitator without MFA — force enrollment.
  if (requiresMfa && !user.mfaEnabled) {
    await logSecurityEvent({
      eventType: 'ADMIN_LOGIN_SUCCESS',
      outcome: 'SUCCESS',
      actorId: user.id,
      actorRole: role,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
      metadata: { mfaSetupRequired: true },
    });
    return NextResponse.json({ status: 'mfa_setup_required' });
  }

  // MFA enrolled — issue a pending token and force the challenge.
  if (user.mfaEnabled) {
    try {
      const issued = await issuePendingToken({
        userId: user.id,
        purpose: 'login',
        ...(body.destination ? { destination: body.destination } : {}),
      });
      return NextResponse.json({
        status: 'mfa_required',
        pendingToken: issued.token,
        expiresAt: issued.expiresAt.toISOString(),
        destination: body.destination ?? null,
      });
    } catch (err) {
      logger.error('mfa/session: issuePendingToken failed', { error: safeError(err) });
      return NextResponse.json({ error: 'Failed to issue MFA challenge token' }, { status: 500 });
    }
  }

  // Participant without MFA — just logged in.
  await logSecurityEvent({
    eventType: 'ADMIN_LOGIN_SUCCESS', // includes FACILITATOR_LOGIN_SUCCESS semantically
    outcome: 'SUCCESS',
    actorId: user.id,
    actorRole: role,
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
    userAgent: req.headers.get('user-agent') ?? undefined,
  });
  return NextResponse.json({ status: 'authenticated' });
}
