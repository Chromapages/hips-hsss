import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RolesGuard, UserRole } from './roles.guard.js';

const mockVerifyIdToken = vi.fn();
vi.mock('../firebase-init.js', () => ({
  getAdminAuth: () => ({ verifyIdToken: mockVerifyIdToken }),
}));

class MockHeaders {
  constructor(private readonly map: Record<string, string>) {}
  get(name: string): string | null {
    return this.map[name.toLowerCase()] ?? null;
  }
}

function createMockContext(authorization: string | null): ExecutionContext {
  const headers = authorization
    ? new MockHeaders({ authorization })
    : new MockHeaders({});
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

function createMockReflector(requiredRoles?: UserRole[]): Reflector {
  const reflector = new Reflector();
  vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
  return reflector;
}

describe('RolesGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access when no roles are required', async () => {
      const guard = new RolesGuard(createMockReflector(undefined));
      const result = await guard.canActivate(createMockContext('Bearer token'));
      expect(result).toBe(true);
    });

    it('should allow access when requiredRoles is empty', async () => {
      const guard = new RolesGuard(createMockReflector([]));
      const result = await guard.canActivate(createMockContext('Bearer token'));
      expect(result).toBe(true);
    });

    it('should grant access to a valid ADMIN token on an admin endpoint', async () => {
      mockVerifyIdToken.mockResolvedValue({ uid: 'uid-1', role: 'ADMIN' });

      const guard = new RolesGuard(createMockReflector([UserRole.ADMIN]));
      const result = await guard.canActivate(createMockContext('Bearer admin-token'));

      expect(result).toBe(true);
      expect(mockVerifyIdToken).toHaveBeenCalledWith('admin-token');
    });

    it('should grant access to FACILITATOR token on facilitator endpoint', async () => {
      mockVerifyIdToken.mockResolvedValue({ uid: 'uid-2', role: 'FACILITATOR' });

      const guard = new RolesGuard(createMockReflector([UserRole.FACILITATOR]));
      const result = await guard.canActivate(createMockContext('Bearer facilitator-token'));

      expect(result).toBe(true);
    });

    it('should reject a PARTICIPANT hitting an ADMIN-only endpoint', async () => {
      mockVerifyIdToken.mockResolvedValue({ uid: 'uid-3', role: 'PARTICIPANT' });

      const guard = new RolesGuard(createMockReflector([UserRole.ADMIN]));
      await expect(guard.canActivate(createMockContext('Bearer participant-token')))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw when no authorization header is present', async () => {
      const guard = new RolesGuard(createMockReflector([UserRole.ADMIN]));
      await expect(guard.canActivate(createMockContext(null)))
        .rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(createMockContext(null)))
        .rejects.toThrow('Missing Firebase ID token');
    });

    it('should throw when the Firebase token is invalid', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('auth/idtoken-invalid'));

      const guard = new RolesGuard(createMockReflector([UserRole.ADMIN]));
      await expect(guard.canActivate(createMockContext('Bearer bad-token')))
        .rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(createMockContext('Bearer bad-token')))
        .rejects.toThrow('Invalid Firebase ID token');
    });

    it('should allow access when user has one of multiple allowed roles', async () => {
      mockVerifyIdToken.mockResolvedValue({ uid: 'uid-4', role: 'FACILITATOR' });

      const guard = new RolesGuard(createMockReflector([UserRole.ADMIN, UserRole.FACILITATOR]));
      const result = await guard.canActivate(createMockContext('Bearer facilitator-token'));

      expect(result).toBe(true);
    });

    it('should throw when the decoded token has no role claim', async () => {
      mockVerifyIdToken.mockResolvedValue({ uid: 'uid-5' });

      const guard = new RolesGuard(createMockReflector([UserRole.ADMIN]));
      await expect(guard.canActivate(createMockContext('Bearer token-no-role')))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
