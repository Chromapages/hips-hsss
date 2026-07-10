/**
 * Webhook idempotency registry — Layer 5.
 *
 * A replay attack delivers the same signed event twice. The signature
 * is valid, the timestamp is within the window, but the platform must
 * not process the event twice (would double-fulfill a payment, double-
 * credit a session, etc).
 *
 * We deduplicate by event ID, with a 24-hour TTL. Redis is the primary
 * store. In dev (no Redis), we fall back to an in-memory Set that
 * resets on restart — acceptable because there's no durability
 * requirement in dev.
 */

import 'server-only';
import { getRedis } from '@/lib/redis';
import { logger } from '@/lib/logger';

const PREFIX = 'webhook:event:';
const DEFAULT_TTL_SECONDS = 24 * 60 * 60; // 24h

const inMemoryProcessed = new Set<string>();

/**
 * Atomically claim a webhook event ID. Returns:
 *  - { firstSeen: true }  — first time we've seen this event; caller
 *                           should process the payload.
 *  - { firstSeen: false } — duplicate delivery; caller should ack
 *                           with 200 and skip processing.
 */
export async function registerEventId(
  eventId: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): Promise<{ firstSeen: boolean }> {
  if (!eventId) {
    throw new Error('registerEventId requires a non-empty eventId');
  }
  const key = `${PREFIX}${eventId}`;
  const redis = getRedis();

  if (redis) {
    try {
      // SET key value NX EX ttl — atomic compare-and-set with expiry.
      // Returns 'OK' on success, null on already-exists.
      const result = await (redis as { set: (...args: unknown[]) => Promise<unknown> }).set(
        key,
        '1',
        'EX',
        ttlSeconds,
        'NX',
      );
      return { firstSeen: result === 'OK' };
    } catch (err) {
      logger.warn('[webhook-idempotency] Redis SET NX failed, falling back to in-memory', {
        error: (err as Error).message,
      });
      // Fall through to in-memory.
    }
  }

  if (inMemoryProcessed.has(eventId)) {
    return { firstSeen: false };
  }
  inMemoryProcessed.add(eventId);
  return { firstSeen: true };
}

/** Test helper: clear the in-memory fallback. */
export function _clearInMemoryProcessed(): void {
  inMemoryProcessed.clear();
}
