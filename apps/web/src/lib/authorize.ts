import { NextRequest } from 'next/server';
import { verifyFirebaseIdToken } from './auth-edge';
import { ROLES, type Role } from './roles';

export interface AuthResult {
  uid: string;
  role: string;
}

/**
 * Unified authorization helper for API route handlers.
 * Verifies Firebase ID token and optionally checks role permissions.
 *
 * @param req - The Next.js request object
 * @param allowedRoles - Optional array of roles that are allowed to access the route
 * @returns AuthResult with uid and role, or null if unauthorized
 */
export async function authorize(
  req: NextRequest,
  allowedRoles?: readonly Role[]
): Promise<AuthResult | null> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyFirebaseIdToken(token);
    const uid = typeof payload.sub === 'string' ? payload.sub : null;
    const role = (payload.role as string) || ROLES.PARTICIPANT;

    if (!uid) {
      return null;
    }

    // If allowedRoles specified, check role membership
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(role as Role)) {
        return null;
      }
    }

    return { uid, role };
  } catch {
    return null;
  }
}

/**
 * Helper to check if a user has one of the allowed roles.
 * Convenience wrapper around authorize() when you just need to verify role.
 */
export async function authorizeRole(
  req: NextRequest,
  allowedRoles: readonly Role[]
): Promise<AuthResult | null> {
  return authorize(req, allowedRoles);
}