import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';
import { ROLES } from '@/lib/roles';

/**
 * Shared request auth verification helper.
 * Returns the decoded token payload or null if unauthorized.
 */
export async function verifyRequestAuth(req: NextRequest): Promise<{ uid: string; role: string | null } | null> {
  const auth = getAdminAuth();
  if (!auth) return null;

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return null;

  try {
    const payload = await auth.verifyIdToken(token);
    return { uid: payload.uid, role: (payload.role as string) || null };
  } catch {
    return null;
  }
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
export async function requireRole(req: NextRequest, allowedRoles: string[]) {
  const result = await verifyRequestAuth(req);
  if (!result) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!result.role || !allowedRoles.includes(result.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return result;
}

/**
 * Require admin role.
 */
export async function requireAdmin(req: NextRequest) {
  return requireRole(req, [ROLES.ADMIN]);
}

/**
 * Require facilitator or admin role.
 */
export async function requireFacilitator(req: NextRequest) {
  return requireRole(req, [ROLES.FACILITATOR, ROLES.ADMIN]);
}

/**
 * CSRF double-submit cookie verification.
 * Call on all state-changing handlers (POST/PUT/PATCH/DELETE).
 * Returns true if valid, false if missing/invalid.
 */
export function verifyCSRFToken(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('csrf-token')?.value;
  const headerToken = req.headers.get('x-csrf-token');

  if (!cookieToken || !headerToken) return false;
  return cookieToken === headerToken;
}