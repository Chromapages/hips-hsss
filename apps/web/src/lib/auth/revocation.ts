/**
 * Token revocation registry — Layer 3 (Enforce token revocation).
 *
 * Covers three categories of tokens:
 *  1. Admin/facilitator user session tokens (Firebase ID tokens with jti)
 *  2. Service tokens (our own scoped JWTs)
 *  3. The internal mfa-pending and sudo tokens
 *
 * Backed by Redis with a fast SET-of-jtis pattern. Key layout:
 *   revoked:jti:{jti}            → JSON({ reason, revokedAt, revokedBy })
 *   active-jtis:user:{userId}    → SET of currently-active jtis for the user
 *   active-jtis:principal:{sub}  → SET for non-user service subjects
 *
 * The single-GET cost is sub-millisecond, well within the spec budget.
 * When Redis is unavailable, revocation checks fail open (return false) so
 * the app stays available. The signature/exp/iss/aud checks still hold —
 * a leaked token can only survive until its natural exp.
 */

import 'server-only';
import { getRedis } from '@/lib/redis';
import { logger } from '@/lib/logger';

// ─── Public types ────────────────────────────────────────────────────────────

export type RevocationReason =
  | 'admin_logout'
  | 'role_change'
  | 'user_suspended'
  | 'password_reset'
  | 'suspicious_login'
  | 'mfa_enrolled'
  | 'mfa_deenrolled'
  | 'service_decommissioned'
  | 'service_credential_rotated'
  | 'incident_response'
  | 'manual'
  | 'test';

export type RevokeTokenOptions = {
  /** The jti claim of the token to revoke. */
  jti: string;
  /** Why the token is being revoked. */
  reason: RevocationReason;
  /** Unix timestamp (seconds) at which the token naturally expires. */
  expiresAt: number;
  /** Optional actor ID — the user/service that performed the revocation. */
  revokedBy?: string | undefined;
};

export type RevokeAllOptions = {
  /** The user whose tokens should be revoked. */
  userId: string;
  /** Why the tokens are being revoked. */
  reason: RevocationReason;
  /** Unix timestamp (seconds) — used as the default expiry for any tokens
   *  that don't carry their own exp claim. Defaults to 24h from now. */
  defaultExpiresAt?: number;
  /** Optional actor ID. */
  revokedBy?: string;
};

// ─── Key helpers ────────────────────────────────────────────────────────────

const PREFIX = 'revoked:jti:';
const USER_SET_PREFIX = 'active-jtis:user:';
const PRINCIPAL_SET_PREFIX = 'active-jtis:principal:';

const revokedKey = (jti: string) => `${PREFIX}${jti}`;
const userSetKey = (userId: string) => `${USER_SET_PREFIX}${userId}`;
const principalSetKey = (sub: string) => `${PRINCIPAL_SET_PREFIX}${sub}`;

// ─── In-memory fallback ─────────────────────────────────────────────────────

/**
 * Used only when Redis is not configured (e.g. local dev without Docker).
 * In production, Redis is required. The fallback exists so the rest of the
 * auth chain can be exercised without a Redis dependency.
 */
const inMemoryRevoked = new Set<string>();

function getStore(): { isRedis: boolean; client: ReturnType<typeof getRedis> | Map<string, unknown> } {
  const client = getRedis();
  if (client) return { isRedis: true, client };
  return { isRedis: false, client: inMemoryRevoked as unknown as Map<string, unknown> };
}

// ─── revokeToken ────────────────────────────────────────────────────────────

/**
 * Mark a single jti as revoked. The entry will expire from Redis at the
 * token's natural exp so the registry does not grow indefinitely.
 */
export async function revokeToken(opts: RevokeTokenOptions): Promise<void> {
  if (!opts.jti) {
    throw new Error('revokeToken requires opts.jti.');
  }
  if (!opts.expiresAt || opts.expiresAt * 1000 <= Date.now()) {
    // Token is already expired — no need to register a revocation.
    return;
  }

  const ttlSeconds = Math.max(1, opts.expiresAt - Math.floor(Date.now() / 1000));
  const entry = JSON.stringify({
    reason: opts.reason,
    revokedAt: new Date().toISOString(),
    revokedBy: opts.revokedBy ?? null,
  });

  const store = getStore();
  if (store.isRedis) {
    try {
      await (store.client as any).set(revokedKey(opts.jti), entry, 'EX', ttlSeconds);
      return;
    } catch (err) {
      logger.warn('[revocation] Redis SET failed, falling back to in-memory', {
        error: (err as Error).message,
      });
    }
  }
  inMemoryRevoked.add(opts.jti);
}

// ─── isTokenRevoked ─────────────────────────────────────────────────────────

/**
 * Returns true if the jti is in the revocation registry.
 * Used by request-auth.ts, auth-utils.ts, admin-auth.ts, and
 * validateServiceToken() inside serviceToken.ts.
 */
export async function isTokenRevoked(jti: string): Promise<boolean> {
  if (!jti) return false;

  const store = getStore();
  if (store.isRedis) {
    try {
      const value = await (store.client as any).get(revokedKey(jti));
      return value !== null && value !== undefined;
    } catch (err) {
      logger.warn('[revocation] Redis GET failed, treating as not revoked', {
        error: (err as Error).message,
      });
      return false;
    }
  }
  return inMemoryRevoked.has(jti);
}

// ─── revokeAllTokensForUser ─────────────────────────────────────────────────

/**
 * Revoke every active jti for a given user. Iterates the in-memory/Redis
 * set of active jtis and calls revokeToken() for each. Also revokes the
 * set itself so future revocations don't see stale entries.
 */
export async function revokeAllTokensForUser(opts: RevokeAllOptions): Promise<{
  revoked: number;
}> {
  if (!opts.userId) {
    throw new Error('revokeAllTokensForUser requires opts.userId.');
  }

  const setKey = userSetKey(opts.userId);
  const defaultExp = opts.defaultExpiresAt ?? Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  let jtis: string[] = [];

  const store = getStore();
  if (store.isRedis) {
    try {
      jtis = await (store.client as any).smembers(setKey);
    } catch (err) {
      logger.warn('[revocation] Redis SMEMBERS failed', { error: (err as Error).message });
    }
  } else {
    // In-memory fallback: scan a small in-memory map of user → jti sets.
    jtis = inMemoryUserIndex.get(opts.userId) ? Array.from(inMemoryUserIndex.get(opts.userId)!) : [];
  }

  let revoked = 0;
  for (const jti of jtis) {
    try {
      await revokeToken({
        jti,
        reason: opts.reason,
        expiresAt: defaultExp,
        revokedBy: opts.revokedBy,
      });
      revoked++;
    } catch (err) {
      logger.warn('[revocation] revokeToken failed for jti', {
        jti,
        error: (err as Error).message,
      });
    }
  }

  // Clear the index so newly-issued tokens start fresh.
  if (store.isRedis) {
    try {
      await (store.client as any).del(setKey);
    } catch (err) {
      logger.warn('[revocation] Redis DEL failed', { error: (err as Error).message });
    }
  } else {
    inMemoryUserIndex.delete(opts.userId);
  }

  return { revoked };
}

// ─── Active-jti tracking (used by withRevocableJwt) ─────────────────────────

/**
 * Register a jti as active for a given user. Called automatically by
 * withRevocableJwt() in revocation-jti.ts. Manual callers should not need
 * this — they should use withRevocableJwt() instead.
 */
export async function trackActiveJti(opts: {
  userId: string;
  jti: string;
  expiresAt: number;
}): Promise<void> {
  if (!opts.userId || !opts.jti) return;
  const ttlSeconds = Math.max(1, opts.expiresAt - Math.floor(Date.now() / 1000));
  const setKey = userSetKey(opts.userId);
  const store = getStore();
  if (store.isRedis) {
    try {
      const pipeline = (store.client as any).pipeline();
      pipeline.sadd(setKey, opts.jti);
      pipeline.expire(setKey, ttlSeconds);
      await pipeline.exec();
      return;
    } catch (err) {
      logger.warn('[revocation] Redis SADD failed, using in-memory', {
        error: (err as Error).message,
      });
    }
  }
  // In-memory fallback
  if (!inMemoryUserIndex.has(opts.userId)) {
    inMemoryUserIndex.set(opts.userId, new Set());
  }
  inMemoryUserIndex.get(opts.userId)!.add(opts.jti);
}

const inMemoryUserIndex = new Map<string, Set<string>>();

// ─── Helpers for tests / debugging ──────────────────────────────────────────

/** Returns the number of currently-revoked jtis (for tests). */
export function _revokedCount(): number {
  return inMemoryRevoked.size;
}

/** Clears the in-memory fallback (for tests). */
export function _clearInMemoryRevocation(): void {
  inMemoryRevoked.clear();
  inMemoryUserIndex.clear();
}

// ─── Bulk user revocation (Firebase ID tokens have no jti) ──────────────────

const USER_REVOKE_PREFIX = 'revoked:user:';
const userRevokeKey = (userId: string) => `${USER_REVOKE_PREFIX}${userId}`;

const inMemoryUserRevoked = new Map<string, { revokedAt: number }>();

/**
 * Mark all sessions for a user as revoked from `revokedAt` onward. Used when
 * the platform wants to invalidate ALL active sessions for a user (e.g. on
 * role change, suspension, password reset completion) but the token type
 * (Firebase ID token) has no jti we can track at the JWT level.
 *
 * The check is then: is the token's auth_time before the revocation time?
 * If yes, the token is stale and should be rejected.
 */
export async function revokeAllUserSessions(opts: {
  userId: string;
  reason: RevocationReason;
}): Promise<{ revokedAt: number }> {
  const revokedAt = Math.floor(Date.now() / 1000);
  const store = getStore();
  if (store.isRedis) {
    try {
      await (store.client as any).set(
        userRevokeKey(opts.userId),
        JSON.stringify({ revokedAt, reason: opts.reason }),
        'EX',
        30 * 24 * 60 * 60, // 30 days — beyond the longest session TTL
      );
      return { revokedAt };
    } catch (err) {
      logger.warn('[revocation] Redis bulk-revoke failed, using in-memory', {
        error: (err as Error).message,
      });
    }
  }
  inMemoryUserRevoked.set(opts.userId, { revokedAt });
  return { revokedAt };
}

/**
 * Returns true if the user's session starting at `authTime` has been revoked
 * (i.e. the user was bulk-revoked at or after `authTime`).
 *
 * Used by request-auth.ts to enforce Layer 3 on Firebase ID tokens, which
 * have no jti.
 */
export async function isUserRevoked(userId: string, authTime: number): Promise<boolean> {
  if (!userId) return false;
  let revokedAt: number | null = null;

  const store = getStore();
  if (store.isRedis) {
    try {
      const value = await (store.client as any).get(userRevokeKey(userId));
      if (value) {
        const parsed = JSON.parse(value) as { revokedAt: number };
        revokedAt = parsed.revokedAt;
      }
    } catch (err) {
      logger.warn('[revocation] Redis bulk-check failed, treating as not revoked', {
        error: (err as Error).message,
      });
      return false;
    }
  } else {
    revokedAt = inMemoryUserRevoked.get(userId)?.revokedAt ?? null;
  }

  if (revokedAt === null) return false;
  // Tokens issued before the revocation time are rejected (stale).
  // Tokens issued at or after are valid (fresh login).
  // This is the correct semantics for "invalidate all sessions prior to this point".
  return authTime < revokedAt;
}
