/**
 * Redis client singleton.
 *
 * NOTE: Requires `npm install ioredis` for production multi-instance deployments.
 * Without ioredis installed or if REDIS_URL is not configured, this module
 * returns null to allow graceful degradation to in-memory fallbacks.
 */
import Redis from 'ioredis';

let redis: Redis | null = null;

function createRedisClient(): Redis | null {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  let client: Redis;
  try {
    client = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
    });
  } catch {
    console.warn('[redis] Failed to create Redis client — falling back to in-memory');
    return null;
  }

  client.on('error', (err) => {
    console.warn('[redis] Connection error:', err.message);
  });

  client.on('connect', () => {
    console.log('[redis] Connected to', redisUrl);
  });

  return client;
}

redis = createRedisClient();

export { redis };

export function getRedis(): Redis | null {
  return redis;
}
