import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from './admin-auth';
import { ROLES } from './roles';

const mockRequireRole = vi.hoisted(() => vi.fn());

vi.mock('./request-auth', () => ({ requireRole: mockRequireRole }));

describe('requireAdmin', () => {
  beforeEach(() => mockRequireRole.mockReset());

  const request = new NextRequest('http://localhost:3000/api/admin/test');

  it('passes through authentication and authorization errors', async () => {
    const error = NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    mockRequireRole.mockResolvedValue({ user: null, error });

    const result = await requireAdmin(request);
    expect(result.admin).toBeNull();
    expect(result.error?.status).toBe(403);
  });

  it.each([ROLES.ADMIN, ROLES.SUPER_ADMIN])('accepts database role %s', async (role) => {
    mockRequireRole.mockResolvedValue({
      user: { id: 'db-id', uid: 'firebase-id', email: 'admin@example.com', role },
      error: null,
    });

    const result = await requireAdmin(request);
    expect(result.error).toBeNull();
    expect(result.admin).toEqual({
      uid: 'firebase-id',
      email: 'admin@example.com',
      role,
    });
  });
});
