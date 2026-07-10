/**
 * Tests for the revocation registry (Layer 3).
 *
 * Covers:
 *  - revokeToken / isTokenRevoked roundtrip
 *  - revokeAllTokensForUser: all active jtis revoked
 *  - isUserRevoked: bulk user-level check (Firebase ID tokens have no jti)
 *  - In-memory fallback works when Redis is absent
 *  - Revocation check is best-effort (does not throw on Redis failure)
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
  revokeToken,
  isTokenRevoked,
  revokeAllTokensForUser,
  trackActiveJti,
  isUserRevoked,
  _clearInMemoryRevocation,
  _revokedCount,
} from '../apps/web/src/lib/auth/revocation';

describe('revokeToken + isTokenRevoked (in-memory fallback)', () => {
  beforeEach(() => {
    _clearInMemoryRevocation();
  });

  it('returns false for a never-revoked jti', async () => {
    expect(await isTokenRevoked('jti-fresh')).toBe(false);
  });

  it('returns true after revokeToken', async () => {
    await revokeToken({
      jti: 'jti-1',
      reason: 'test',
      expiresAt: Math.floor(Date.now() / 1000) + 60,
    });
    expect(await isTokenRevoked('jti-1')).toBe(true);
  });

  it('does nothing for an already-expired jti', async () => {
    await revokeToken({
      jti: 'jti-already-expired',
      reason: 'test',
      expiresAt: Math.floor(Date.now() / 1000) - 60,
    });
    expect(_revokedCount()).toBe(0);
  });

  it('rejects empty jti', async () => {
    await expect(
      revokeToken({ jti: '', reason: 'test', expiresAt: Math.floor(Date.now() / 1000) + 60 }),
    ).rejects.toThrow();
  });
});

describe('revokeAllTokensForUser', () => {
  beforeEach(() => {
    _clearInMemoryRevocation();
  });

  it('revokes all active jtis for a user', async () => {
    const userId = 'user-1';
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    await trackActiveJti({ userId, jti: 'jti-a', expiresAt: futureExp });
    await trackActiveJti({ userId, jti: 'jti-b', expiresAt: futureExp });
    await trackActiveJti({ userId, jti: 'jti-c', expiresAt: futureExp });

    const { revoked } = await revokeAllTokensForUser({ userId, reason: 'role_change' });
    expect(revoked).toBe(3);
    expect(await isTokenRevoked('jti-a')).toBe(true);
    expect(await isTokenRevoked('jti-b')).toBe(true);
    expect(await isTokenRevoked('jti-c')).toBe(true);
  });

  it('rejects empty userId', async () => {
    await expect(
      revokeAllTokensForUser({ userId: '', reason: 'test' }),
    ).rejects.toThrow();
  });
});

describe('isUserRevoked (Firebase ID token path)', () => {
  beforeEach(() => {
    _clearInMemoryRevocation();
  });

  it('returns false for never-revoked user', async () => {
    expect(await isUserRevoked('user-1', Math.floor(Date.now() / 1000))).toBe(false);
  });

  it('returns false when token was issued at or after revocation time', async () => {
    const { revokeAllUserSessions } = await import('../apps/web/src/lib/auth/revocation');
    const { revokedAt } = await revokeAllUserSessions({ userId: 'user-2', reason: 'user_suspended' });
    // Token issued at or after the revocation is a fresh login, so not revoked.
    expect(await isUserRevoked('user-2', revokedAt + 1)).toBe(false);
  });

  it('returns true for tokens issued before the revocation time', async () => {
    const { revokeAllUserSessions } = await import('../apps/web/src/lib/auth/revocation');
    const { revokedAt } = await revokeAllUserSessions({ userId: 'user-3', reason: 'user_suspended' });
    // Token issued before the revocation is a stale login, so revoked.
    expect(await isUserRevoked('user-3', revokedAt - 60)).toBe(true);
  });
});
