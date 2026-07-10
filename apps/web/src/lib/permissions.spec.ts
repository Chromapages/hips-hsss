import { describe, expect, it } from 'vitest';
import { canAssignRole, roleHasPermission } from './permissions';
import { ADMIN_ROLES, FACILITATOR_ROLES, ROLES } from './roles';

describe('canonical role policy', () => {
  it('enforces facilitator and admin boundaries', () => {
    expect(roleHasPermission(ROLES.PARTICIPANT, FACILITATOR_ROLES)).toBe(false);
    expect(roleHasPermission(ROLES.FACILITATOR, FACILITATOR_ROLES)).toBe(true);
    expect(roleHasPermission(ROLES.FACILITATOR, ADMIN_ROLES)).toBe(false);
    expect(roleHasPermission(ROLES.ADMIN, ADMIN_ROLES)).toBe(true);
    expect(roleHasPermission(ROLES.SUPER_ADMIN, ADMIN_ROLES)).toBe(true);
  });

  it('allows admins to assign facilitator but not admin or super-admin', () => {
    expect(canAssignRole(ROLES.ADMIN, ROLES.PARTICIPANT, ROLES.FACILITATOR)).toBe(true);
    expect(canAssignRole(ROLES.ADMIN, ROLES.PARTICIPANT, ROLES.ADMIN)).toBe(false);
    expect(canAssignRole(ROLES.ADMIN, ROLES.ADMIN, ROLES.PARTICIPANT)).toBe(false);
    expect(canAssignRole(ROLES.ADMIN, ROLES.PARTICIPANT, ROLES.SUPER_ADMIN)).toBe(false);
  });

  it('allows super-admins to assign admin but never super-admin', () => {
    expect(canAssignRole(ROLES.SUPER_ADMIN, ROLES.PARTICIPANT, ROLES.ADMIN)).toBe(true);
    expect(canAssignRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.PARTICIPANT)).toBe(true);
    expect(canAssignRole(ROLES.SUPER_ADMIN, ROLES.PARTICIPANT, ROLES.SUPER_ADMIN)).toBe(false);
    expect(canAssignRole(ROLES.SUPER_ADMIN, ROLES.SUPER_ADMIN, ROLES.ADMIN)).toBe(false);
  });
});
