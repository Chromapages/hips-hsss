'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { roleHasPermission } from '@/lib/permissions';
import { type Role } from '@/lib/roles';

/**
 * UI-only role helper. Server authorization must use requireRole().
 */
export function useRole() {
  const { role, loading } = useAuth();
  const typedRole = role as Role | null;

  return {
    role: typedRole,
    loading,
    can: (allowedRoles: readonly Role[]) => roleHasPermission(typedRole, allowedRoles),
  };
}
