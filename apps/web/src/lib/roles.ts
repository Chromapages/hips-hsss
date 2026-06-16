/**
 * Centralized role constants for the HIPS platform.
 * Use these constants instead of hardcoded strings throughout the codebase.
 */
export const ROLES = {
  PARTICIPANT: 'PARTICIPANT',
  FACILITATOR: 'FACILITATOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Roles that have facilitator privileges (can claim sessions, manage queues)
 */
export const FACILITATOR_ROLES = [ROLES.FACILITATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN] as const;

/**
 * Roles that have admin privileges (can access admin console, manage users)
 */
export const ADMIN_ROLES = [ROLES.ADMIN, ROLES.SUPER_ADMIN] as const;

export const SUPER_ADMIN_ROLES = [ROLES.SUPER_ADMIN] as const;
