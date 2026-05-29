/**
 * Redis-backed rate limiter.
 *
 * NOTE: Requires `npm install ioredis` for production multi-instance deployments.
 * Falls back to an in-memory store when Redis is unavailable.
 */
import { getRedis } from './redis';

interface RateLimitResult {
  limited: boolean;
  current: number;
  remaining: number;
  resetAt: number;
}

interface InMemoryEntry {
  count: number;
  resetAt: number;
}

// In-memory fallback — keyed by identifier (e.g. IP)
const inMemoryStore = new Map<string, InMemoryEntry>();
const IN_MEMORY_WINDOW_MS = 60 * 1000;
const IN_MEMORY_MAX_REQUESTS = 100;

function inMemoryCheck(identifier: string): RateLimitResult {
  const now = Date.now();
  const record = inMemoryStore.get(identifier);

  if (!record || now > record.resetAt) {
    inMemoryStore.set(identifier, { count: 1, resetAt: now + IN_MEMORY_WINDOW_MS });
    return { limited: false, current: 1, remaining: IN_MEMORY_MAX_REQUESTS - 1, resetAt: now + IN_MEMORY_WINDOW_MS };
  }

  if (record.count >= IN_MEMORY_MAX_REQUESTS) {
    return { limited: true, current: record.count, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return {
    limited: false,
    current: record.count,
    remaining: IN_MEMORY_MAX_REQUESTS - record.count,
    resetAt: record.resetAt,
  };
}

export async function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const redis = getRedis();

  if (!redis) {
    // Fallback: use a fixed 100 req / 60s window for in-memory
    return inMemoryCheck(identifier);
  }

  const key = `rl:${identifier}`;
  const windowMs = windowSeconds * 1000;

  try {
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.ttl(key);
    const results = await pipeline.exec();

    if (!results) throw new Error('Pipeline returned null');

    const incrResult = results[0];
    const ttlResult = results[1];

    if (incrResult[0] || ttlResult[0]) throw new Error('Pipeline error');

    const current = incrResult[1] as number;
    let ttl = ttlResult[1] as number;

    // On first request, EXPIRE returns -1; set resetAt from windowSeconds
    if (ttl <= 0) {
      await redis.expire(key, windowSeconds);
      ttl = windowSeconds;
    }

    const resetAt = Date.now() + ttl * 1000;
    const limited = current > maxRequests;

    return {
      limited,
      current,
      remaining: Math.max(0, maxRequests - current),
      resetAt,
    };
  } catch (err) {
    console.warn('[rate-limit-redis] Redis error, falling back to in-memory:', err);
    return inMemoryCheck(identifier);
  }
}

type NextMiddleware = (req: Request) => Promise<Response | null> | Response | null;

interface RateLimitMiddlewareOptions {
  maxRequests?: number;
  windowSeconds?: number;
  keyFn?: (req: Request) => string;
}

export function createRateLimitMiddleware(options: RateLimitMiddlewareOptions = {}): NextMiddleware {
  const {
    maxRequests = 100,
    windowSeconds = 60,
    keyFn = () => 'default',
  } = options;

  return async (req: Request) => {
    const identifier = keyFn(req);
    const result = await checkRateLimit(identifier, maxRequests, windowSeconds);

    if (result.limited) {
      return new Response(
        JSON.stringify({ error: 'Too many requests, please try again later.' }),
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': String(result.remaining),
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return null;
  };
}
