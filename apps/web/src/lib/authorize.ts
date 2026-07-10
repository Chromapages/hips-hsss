import { NextRequest } from 'next/server';
import { authenticateRequest } from './request-auth';
import { type Role } from './roles';

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
  const result = await authenticateRequest(req);
  if (result.error) return null;
  if (allowedRoles?.length && !allowedRoles.includes(result.user.role)) return null;
  return { uid: result.user.uid, role: result.user.role };
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
