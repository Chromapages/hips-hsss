import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from './firebase-admin';
import { getPrisma } from './prisma';
import { type Role } from './roles';

export type AuthenticatedUser = {
  id: string;
  uid: string;
  email: string;
  role: Role;
};

export type AuthResult =
  | { user: AuthenticatedUser; error: null }
  | { user: null; error: NextResponse };

const MAX_ADMIN_SESSION_SECONDS = 4 * 60 * 60;

function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : null;
}

/**
 * Tokens prove identity only. Authorization always comes from Commerce.User.
 *
 * Layer 3: After Firebase verify (which checks Firebase's own revocation list),
 * we additionally check the app-level revocation registry. The combined check
 * covers:
 *  - Firebase-side revocation (password reset, account disabled)
 *  - App-side revocation (role change, suspension, suspicious login)
 */
export async function authenticateRequest(req: NextRequest): Promise<AuthResult> {
  const token = getBearerToken(req);
  if (!token) {
    return { user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const auth = getAdminAuth();
  if (!auth) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Authentication service unavailable' }, { status: 503 }),
    };
  }

  try {
    const identity = await auth.verifyIdToken(token, true);
    const dbUser = await getPrisma().user.findFirst({
      where: { firebaseUid: identity.uid, deletedAt: null },
      select: { id: true, firebaseUid: true, email: true, role: true },
    });

    if (!dbUser) {
      return { user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const role = dbUser.role as Role;
    if (
      (role === 'ADMIN' || role === 'SUPER_ADMIN')
      && (!identity.auth_time || Math.floor(Date.now() / 1000) - identity.auth_time > MAX_ADMIN_SESSION_SECONDS)
    ) {
      return {
        user: null,
        error: NextResponse.json({ error: 'Admin re-authentication required' }, { status: 401 }),
      };
    }

    // Layer 3: App-level revocation. Firebase ID tokens don't carry a jti we
    // can track at the JWT level, so we use the uid+auth_time as the
    // revocation key. If the user has been bulk-revoked, this check rejects.
    try {
      const { isUserRevoked } = await import('@/lib/auth/revocation');
      const revoked = await isUserRevoked(dbUser.id, identity.auth_time ?? 0);
      if (revoked) {
        return {
          user: null,
          error: NextResponse.json({ error: 'Session revoked' }, { status: 401 }),
        };
      }
    } catch {
      // Revocation check is best-effort. Don't fail the request if Redis is down.
    }

    return {
      user: {
        id: dbUser.id,
        uid: dbUser.firebaseUid,
        email: dbUser.email,
        role,
      },
      error: null,
    };
  } catch {
    // Log the structured failure for Layer 7.
    try {
      const { logSecurityEvent } = await import('@/lib/security/audit');
      await logSecurityEvent({
        eventType: 'ADMIN_LOGIN_FAILURE',
        outcome: 'FAILURE',
        failureReason: 'invalid_firebase_token',
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
        userAgent: req.headers.get('user-agent') ?? undefined,
      });
    } catch {
      // Security-event write failed; never block the response.
    }
    return { user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
}

export async function requireRole(req: NextRequest, ...allowedRoles: readonly Role[]): Promise<AuthResult> {
  const result = await authenticateRequest(req);
  if (result.error) return result;

  if (!allowedRoles.includes(result.user.role)) {
    // Layer 7: log the privilege probe.
    try {
      const { logSecurityEvent } = await import('@/lib/security/audit');
      await logSecurityEvent({
        eventType: 'PRIVILEGED_ROUTE_FORBIDDEN',
        outcome: 'FAILURE',
        actorId: result.user.id,
        actorRole: result.user.role,
        targetType: 'route',
        targetId: req.nextUrl.pathname,
        failureReason: `required=${allowedRoles.join('|')} actual=${result.user.role}`,
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
        userAgent: req.headers.get('user-agent') ?? undefined,
      });
    } catch {
      // Audit write failure must not affect the auth response.
    }
    return { user: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return result;
}
