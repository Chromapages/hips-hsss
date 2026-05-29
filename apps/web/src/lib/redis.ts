/**
 * Redis client singleton.
 *
 * NOTE: Requires `npm install ioredis` for production multi-instance deployments.
 * Without ioredis installed or if REDIS_URL is not configured, this module
 * returns null to allow graceful degradation to in-memory fallbacks.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Redis: any = null;
let redis: unknown = null;

function createRedisClient(): unknown {
  try {
    // Dynamic require - only loads if ioredis is installed
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const IORedis = require('ioredis');
    Redis = IORedis;
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    const client = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
    });

    client.on('error', (err: Error) => {
      console.warn('[redis] Connection error:', err.message);
    });

    client.on('connect', () => {
      console.log('[redis] Connected to', redisUrl);
    });

    return client;
  } catch {
    console.warn('[redis] ioredis not installed or unavailable — falling back to in-memory rate limiting');
    return null;
  }
}

redis = createRedisClient();

export { redis };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRedis(): any {
  return redis;
}
