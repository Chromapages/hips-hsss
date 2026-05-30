/**
 * Rate Limiter Utility
 * In-memory rate limiting for API endpoints.
 * For production, use Redis or a dedicated rate limiting service.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (resets on server restart - suitable for single-instance deployments)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically (every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
  lastCleanup = now;
}

/**
 * Check if a request from a given IP should be rate limited.
 * Uses a sliding window approach.
 *
 * @param ip - The IP address to check
 * @param maxRequests - Maximum requests allowed in the window (default: 5 for auth endpoints)
 * @param windowMs - Time window in milliseconds (default: 60,000 = 1 minute)
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanupExpiredEntries();

  const now = Date.now();
  const key = `rl:${ip}`;

  const entry = rateLimitStore.get(key);

  // No entry or window expired - create new entry
  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  // Entry exists and window hasn't expired
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  // Increment count
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * Create rate limit error response headers
 */
export function getRateLimitHeaders(resetAt: number, remaining: number, limit: number) {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetAt / 1000).toString(),
  };
}

/**
 * Apply rate limit to an API route handler.
 * Returns error response if rate limited, otherwise calls the handler.
 */
export async function withRateLimit<T>(
  request: Request,
  options: { maxRequests?: number; windowMs?: number } = {},
  handler: () => Promise<T>
): Promise<T> {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';

  const { maxRequests = 5, windowMs = 60_000 } = options;

  const result = checkRateLimit(ip, maxRequests, windowMs);

  if (!result.allowed) {
    const headers = getRateLimitHeaders(result.resetAt, 0, maxRequests);
    throw Object.assign(new Error('Rate limit exceeded'), { status: 429, headers });
  }

  return handler();
}