import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { authenticateRequest, requireRole } from './request-auth';
import { ROLES } from './roles';

const verifyIdToken = vi.hoisted(() => vi.fn());
const findFirst = vi.hoisted(() => vi.fn());

vi.mock('./firebase-admin', () => ({
  getAdminAuth: () => ({ verifyIdToken }),
}));
vi.mock('./prisma', () => ({
  getPrisma: () => ({ user: { findFirst } }),
}));

function request() {
  return new NextRequest('http://localhost/api/test', {
    headers: { authorization: 'Bearer identity-token' },
  });
}

describe('database-backed request authorization', () => {
  beforeEach(() => {
    verifyIdToken.mockReset();
    findFirst.mockReset();
  });

  it('ignores token role claims and uses Commerce.User.role', async () => {
    verifyIdToken.mockResolvedValue({ uid: 'firebase-id', role: ROLES.ADMIN, auth_time: Math.floor(Date.now() / 1000) });
    findFirst.mockResolvedValue({
      id: 'db-id',
      firebaseUid: 'firebase-id',
      email: 'user@example.com',
      role: ROLES.PARTICIPANT,
    });

    const result = await authenticateRequest(request());
    expect(result.error).toBeNull();
    expect(result.user?.role).toBe(ROLES.PARTICIPANT);
    expect(verifyIdToken).toHaveBeenCalledWith('identity-token', true);
  });

  it('applies role changes on the next request', async () => {
    verifyIdToken.mockResolvedValue({ uid: 'firebase-id', role: ROLES.PARTICIPANT, auth_time: Math.floor(Date.now() / 1000) });
    findFirst.mockResolvedValue({
      id: 'db-id',
      firebaseUid: 'firebase-id',
      email: 'user@example.com',
      role: ROLES.FACILITATOR,
    });

    const result = await requireRole(request(), ROLES.FACILITATOR, ROLES.ADMIN);
    expect(result.error).toBeNull();
    expect(result.user?.role).toBe(ROLES.FACILITATOR);
  });

  it('rejects deleted or missing authoritative users', async () => {
    verifyIdToken.mockResolvedValue({ uid: 'firebase-id', role: ROLES.ADMIN, auth_time: Math.floor(Date.now() / 1000) });
    findFirst.mockResolvedValue(null);

    const result = await authenticateRequest(request());
    expect(result.user).toBeNull();
    expect(result.error?.status).toBe(401);
  });

  it('requires admin re-authentication after four hours', async () => {
    verifyIdToken.mockResolvedValue({
      uid: 'firebase-id',
      auth_time: Math.floor(Date.now() / 1000) - (4 * 60 * 60 + 1),
    });
    findFirst.mockResolvedValue({
      id: 'db-id',
      firebaseUid: 'firebase-id',
      email: 'admin@example.com',
      role: ROLES.ADMIN,
    });

    const result = await authenticateRequest(request());
    expect(result.user).toBeNull();
    expect(result.error?.status).toBe(401);
  });
});
