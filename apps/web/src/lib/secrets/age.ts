/**
 * Secret-age tracking — Layer 6 (dual-secret rotation).
 *
 * Each signing secret is recorded with the timestamp of when the
 * application first observed it. On every startup, the validator
 * checks each tracked secret's age and emits a warning when a
 * signing secret has not been rotated in more than 90 days.
 *
 * Storage:
 *  - Redis (preferred): key `secret-age:<name>` → JSON({ firstSeenAt, lastRotatedAt })
 *  - In-memory fallback: a module-local Map. Resets on restart, but
 *    still useful: if the value changes between restarts we record
 *    the rotation. If it doesn't, we age from the in-memory record.
 *
 * The 90-day threshold is the spec's recommendation. It is not a hard
 * deadline — a 91-day-old secret will log a warning, not block startup.
 */

import 'server-only';
import { getRedis } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { createHash } from 'node:crypto';

const PREFIX = 'secret-age:';

const STALE_THRESHOLD_DAYS = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type SecretAgeRecord = {
  /** SHA-256 fingerprint of the secret value (first 16 hex chars). */
  valueHash: string;
  /** Unix ms when this value was first seen. */
  firstSeenAt: number;
  /** Unix ms when the value last changed (i.e. the rotation moment). */
  lastRotatedAt: number;
};

const inMemory = new Map<string, SecretAgeRecord>();

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

/**
 * Record that we just observed `value` for `name`. If the value is
 * different from the previous record, the rotation timestamp is updated.
 */
export async function recordSecretBirth(name: string, value: string): Promise<void> {
  const valueHash = hash(value);
  const now = Date.now();

  // In-memory check first (cheap, no I/O).
  const inMem = inMemory.get(name);
  if (inMem && inMem.valueHash === valueHash) return;
  if (inMem && inMem.valueHash !== valueHash) {
    inMemory.set(name, { valueHash, firstSeenAt: now, lastRotatedAt: now });
    await persist(name, { valueHash, firstSeenAt: now, lastRotatedAt: now });
    return;
  }

  // First observation of this name in this process.
  // Try to recover the prior record from Redis.
  const existing = await loadFromRedis(name);
  if (existing && existing.valueHash === valueHash) {
    inMemory.set(name, existing);
    return;
  }
  if (existing && existing.valueHash !== valueHash) {
    inMemory.set(name, { valueHash, firstSeenAt: now, lastRotatedAt: now });
    await persist(name, { valueHash, firstSeenAt: now, lastRotatedAt: now });
    return;
  }
  inMemory.set(name, { valueHash, firstSeenAt: now, lastRotatedAt: now });
  await persist(name, { valueHash, firstSeenAt: now, lastRotatedAt: now });
}

/**
 * Returns the age (in whole days) of the secret's current value. If
 * the secret has never been recorded, returns null.
 */
export async function getSecretAgeDays(name: string): Promise<number | null> {
  let record = inMemory.get(name);
  if (!record) {
    record = (await loadFromRedis(name)) ?? undefined;
  }
  if (!record) return null;
  return Math.floor((Date.now() - record.firstSeenAt) / MS_PER_DAY);
}

/**
 * Returns a warning string for any tracked secret older than
 * `maxAgeDays`. Empty array means nothing is stale.
 */
export async function findStaleSecrets(
  names: readonly string[],
  maxAgeDays: number = STALE_THRESHOLD_DAYS,
): Promise<Array<{ name: string; ageDays: number }>> {
  const stale: Array<{ name: string; ageDays: number }> = [];
  for (const name of names) {
    const age = await getSecretAgeDays(name);
    if (age !== null && age > maxAgeDays) {
      stale.push({ name, ageDays: age });
    }
  }
  return stale;
}

/**
 * Convenience: warnIfStale emits startup warnings for stale secrets.
 * Never throws. Designed for instrumentation.ts.
 */
export async function warnIfStale(
  names: readonly string[],
  maxAgeDays: number = STALE_THRESHOLD_DAYS,
): Promise<string[]> {
  const stale = await findStaleSecrets(names, maxAgeDays);
  for (const { name, ageDays } of stale) {
    logger.warn(`[secret-age] ${name} has not been rotated in ${ageDays} days (recommended: < ${maxAgeDays}). See scripts/rotate-secret.sh.`);
  }
  return stale.map((s) => `${s.name} (${s.ageDays} days)`);
}

// ─── Redis persistence ─────────────────────────────────────────────────────

async function persist(name: string, record: SecretAgeRecord): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await (redis as { set: (...args: unknown[]) => Promise<unknown> }).set(
      `${PREFIX}${name}`,
      JSON.stringify(record),
    );
  } catch (err) {
    logger.warn('[secret-age] Redis persist failed', { name, error: (err as Error).message });
  }
}

async function loadFromRedis(name: string): Promise<SecretAgeRecord | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const value = await (redis as { get: (key: string) => Promise<unknown> }).get(`${PREFIX}${name}`);
    if (!value || typeof value !== 'string') return null;
    return JSON.parse(value) as SecretAgeRecord;
  } catch (err) {
    logger.warn('[secret-age] Redis load failed', { name, error: (err as Error).message });
    return null;
  }
}

// ─── Test helpers ──────────────────────────────────────────────────────────

/** Clears the in-memory registry (for tests). */
export function _clearSecretAge(): void {
  inMemory.clear();
}
