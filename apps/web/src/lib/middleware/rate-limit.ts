import { apiError } from '../api-response'
import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 1000 // 1 minute

export function rateLimit(key: string, limit: number): 'ok' | NextResponse {
  const now = Date.now()
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
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  return `rl:${category}:${ip}`
}

// Endpoint rate limits
export const RATE_LIMITS = {
  auth: 10,
  booking: 30,
  checkout: 30,
  donation: 20,
  sessionToken: 5,
  admin: 60,
  orgInquiry: 10,
  safetyFlag: 30,
} as const
