import { apiError } from '../api-response'
import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store with TTL cleanup - NOT for production serverless/clustered deployments
// For production: replace with Redis/Upstash with sliding window
const store = new Map<string, RateLimitEntry>()

// Periodic cleanup of stale entries (runs every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupStaleEntries(): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}

const WINDOW_MS = 60 * 1000 // 1 minute

export function rateLimit(key: string, limit: number): 'ok' | NextResponse {
  const now = Date.now()
  cleanupStaleEntries()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return 'ok'
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    const response = apiError(
      'RATE_LIMIT_EXCEEDED',
      `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      undefined,
      429
    )
    response.headers.set('Retry-After', String(retryAfter))
    return response
  }

  entry.count++
  return 'ok'
}

export function rateLimitKey(req: NextRequest, category: string): string {
  // Use X-Forwarded-For only as a fallback, prioritize CF-Connecting-IP (Cloudflare)
  // and X-Real-IP which are harder to spoof
  const ip = req.headers.get('cf-connecting-ip')
    ?? req.headers.get('x-real-ip')
    ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown'

  // Also include User-Agent as a secondary factor to limit circumvention via UA rotation
  const ua = req.headers.get('user-agent') ?? 'unknown'
  const fingerprint = `${ip}:${ua.slice(0, 50)}`

  return `rl:${category}:${fingerprint}`
}

// Endpoint rate limits
export const RATE_LIMITS = {
  auth: 10,
  register: 5, // Added registration rate limit to prevent mass account creation
  booking: 30,
  checkout: 30,
  donation: 20,
  sessionToken: 5,
  admin: 60,
  orgInquiry: 10,
  safetyFlag: 30,
  scholarship: 10,
} as const
