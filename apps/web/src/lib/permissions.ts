import { ADMIN_ROLES, FACILITATOR_ROLES, ROLES, SUPER_ADMIN_ROLES, type Role } from './roles';

/**
 * Canonical role policy. Client code may use this only to render UI; every
 * protected operation must enforce the same policy with requireRole().
 */
export const PERMISSIONS = {
  facilitatorPortal: FACILITATOR_ROLES,
  facilitatorSessions: FACILITATOR_ROLES,
  facilitatorQueue: FACILITATOR_ROLES,
  adminPortal: ADMIN_ROLES,
  adminRead: ADMIN_ROLES,
  adminOperations: ADMIN_ROLES,
  roleAssignment: ADMIN_ROLES,
  assignAdmin: SUPER_ADMIN_ROLES,
  systemConfiguration: SUPER_ADMIN_ROLES,
  bulkDestructiveOperations: SUPER_ADMIN_ROLES,
  billingAdministration: ADMIN_ROLES,
} as const satisfies Record<string, readonly Role[]>;

export function roleHasPermission(
  role: Role | null | undefined,
  allowedRoles: readonly Role[],
): boolean {
  return Boolean(role && allowedRoles.includes(role));
}

export function canAssignRole(actorRole: Role, targetCurrentRole: Role, requestedRole: Role): boolean {
  if (requestedRole === ROLES.SUPER_ADMIN) return false;
  if (targetCurrentRole === ROLES.SUPER_ADMIN) return false;

  if (actorRole === ROLES.SUPER_ADMIN) {
    return requestedRole === ROLES.PARTICIPANT
      || requestedRole === ROLES.FACILITATOR
      || requestedRole === ROLES.ADMIN;
  }

  if (actorRole === ROLES.ADMIN) {
    return targetCurrentRole !== ROLES.ADMIN
      && (requestedRole === ROLES.PARTICIPANT || requestedRole === ROLES.FACILITATOR);
  }

  return false;
}
