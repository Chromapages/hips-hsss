/**
 * Redis-backed SessionTokenStore.
 *
 * NOTE: Requires `npm install ioredis` for production multi-instance deployments.
 * Falls back to in-memory SessionTokenStore when Redis is unavailable.
 *
 * Key layout:
 *   token:{tokenId}          — JSON TokenRecord, TTL = expiresAt
 *   session:{sessionId}:tokens — SET of tokenIds for active session tokens
 */
import { randomBytes } from 'node:crypto';
import { getRedis } from '@hips/web/src/lib/redis';
import type { TokenRecord } from './session-token-store';

export type { TokenRecord };

export class RedisSessionTokenStore {
  private readonly ttlPurgeIntervalMs: number;

  constructor(ttlPurgeIntervalMs = 60_000) {
    this.ttlPurgeIntervalMs = ttlPurgeIntervalMs;
    setInterval(() => this.purgeStaleSessionRefs(), ttlPurgeIntervalMs);
  }

  private redisKey(tokenId: string) {
    return `token:${tokenId}`;
  }

  private sessionSetKey(sessionId: string) {
    return `session:${sessionId}:tokens`;
  }

  async issue(sessionId: string, anonymousParticipantId: string, expiresAt: Date): Promise<TokenRecord> {
    const tokenId = randomBytes(32).toString('hex');
    const record: TokenRecord = {
      token: tokenId,
      sessionId,
      anonymousParticipantId,
      expiresAt,
      consumed: false,
    };

    const redis = getRedis();
    if (redis) {
      const ttlSeconds = Math.ceil((expiresAt.getTime() - Date.now()) / 1000);
      await redis.setex(this.redisKey(tokenId), ttlSeconds, JSON.stringify(record));
      await redis.sadd(this.sessionSetKey(sessionId), tokenId);
    }

    return record;
  }

  async consume(token: string, now = new Date()): Promise<{ sessionId: string; anonymousParticipantId: string } | null> {
    const redis = getRedis();

    if (redis) {
      const data = await redis.get(this.redisKey(token));
      if (!data) return null;

      let record: TokenRecord;
      try {
        record = JSON.parse(data) as TokenRecord;
      } catch {
        return null;
      }

      if (record.consumed || record.expiresAt <= now) {
        return null;
      }

      record.consumed = true;
      await redis.setex(this.redisKey(token), 0, JSON.stringify(record)); // TTL 0 = delete immediately
      return { sessionId: record.sessionId, anonymousParticipantId: record.anonymousParticipantId };
    }

    // Fallback: this should not be reached in production with multi-instance;
    // the in-memory store in session-token-store.ts is the fallback there.
    return null;
  }

  async revoke(token: string): Promise<void> {
    const redis = getRedis();
    if (!redis) return;

    const data = await redis.get(this.redisKey(token));
    if (data) {
      let record: TokenRecord;
      try {
        record = JSON.parse(data) as TokenRecord;
      } catch {
        return;
      }
      await redis.srem(this.sessionSetKey(record.sessionId), token);
    }

    await redis.del(this.redisKey(token));
  }

  async revokeAllForSession(sessionId: string): Promise<void> {
    const redis = getRedis();
    if (!redis) return;

    const tokenIds = await redis.smembers(this.sessionSetKey(sessionId));
    if (tokenIds.length > 0) {
      const keysToDelete = tokenIds.map((id) => this.redisKey(id));
      await redis.del(...keysToDelete);
      await redis.del(this.sessionSetKey(sessionId));
    }
  }

  private async purgeStaleSessionRefs(): Promise<void> {
    // Redis TTL handles expiry automatically; this cleans up session SET refs
    // for tokens that have already expired and been deleted by Redis.
    // This is a best-effort scan — in normal operation the TTL expiry
    // handles removal and this is only for orphaned session set entries.
    const redis = getRedis();
    if (!redis) return;

    try {
      // Use SCAN instead of KEYS to avoid blocking Redis server in production
      const stream = redis.scanStream({
        match: 'session:*:tokens',
        count: 100,
      });

      for await (const sessionKeys of stream) {
        for (const key of sessionKeys) {
          const tokenIds = await redis.smembers(key);
          for (const tokenId of tokenIds) {
            const exists = await redis.exists(this.redisKey(tokenId));
            if (!exists) {
              await redis.srem(key, tokenId);
            }
          }
        }
      }
    } catch {
      // Silently ignore — this is called from an interval and should not affect业务的
    }
  }
}
