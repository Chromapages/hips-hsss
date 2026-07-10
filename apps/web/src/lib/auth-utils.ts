import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requireRole as requireDatabaseRole } from '@/lib/request-auth';
import { ADMIN_ROLES, FACILITATOR_ROLES, type Role } from '@/lib/roles';

/**
 * Shared request auth verification helper.
 * Returns the decoded token payload or null if unauthorized.
 */
export async function verifyRequestAuth(req: NextRequest): Promise<{ uid: string; role: string | null } | null> {
  const result = await authenticateRequest(req);
  return result.error ? null : { uid: result.user.uid, role: result.user.role };
}

/**
 * Require authenticated user — returns 401 if not authorized.
 */
export async function requireAuth(req: NextRequest) {
  const result = await verifyRequestAuth(req);
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return result;
}

/**
 * Require specific role(s) — returns 403 if role not permitted.
 */
export async function requireRole(req: NextRequest, allowedRoles: readonly Role[]) {
  const result = await requireDatabaseRole(req, ...allowedRoles);
  return result.error ? result.error : { uid: result.user.uid, role: result.user.role };
}

/**
 * Require admin role.
 */
export async function requireAdmin(req: NextRequest) {
  return requireRole(req, ADMIN_ROLES);
}

/**
 * Require facilitator or admin role.
 */
export async function requireFacilitator(req: NextRequest) {
  return requireRole(req, FACILITATOR_ROLES);
}
