import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "./request-auth";
import { ADMIN_ROLES } from "./roles";

export type AdminUser = {
  uid: string;
  email?: string;
  role: string;
};

/**
 * Standardized first-operation admin guard for all /api/admin/* handlers.
 * The token proves identity; Commerce.User.role is the authorization authority.
 *
 * Layer 3: requireRole() already enforces the app-level revocation check.
 * Layer 7: requireRole() also logs PRIVILEGED_ROUTE_FORBIDDEN on 403.
 */
export async function requireAdmin(req: NextRequest): Promise<
  | { admin: AdminUser; error: null }
  | { admin: null; error: NextResponse }
> {
  const result = await requireRole(req, ...ADMIN_ROLES);
  if (result.error) return { admin: null, error: result.error };

  return {
    admin: {
      uid: result.user.uid,
      email: result.user.email,
      role: result.user.role,
    },
    error: null,
  };
}
