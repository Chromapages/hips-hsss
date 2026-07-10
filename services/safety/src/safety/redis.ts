import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Redis: any = null;
let redis: any = null;

function createRedisClient(): any {
  try {
    // Dynamic require - only loads if ioredis is installed
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
    console.warn('[redis] ioredis not installed or unavailable — falling back to in-memory transcript buffers');
    return null;
  }
}

redis = createRedisClient();

export { redis };

export function getRedis(): any {
  return redis;
}
