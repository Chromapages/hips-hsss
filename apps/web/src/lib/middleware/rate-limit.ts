import { apiError } from '../api-response'
import { NextRequest, NextResponse } from 'next/server'

const WINDOW_MS = 60 * 1000 // 1 minute
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

type RedisEvalResult = [number, number]

export async function rateLimit(key: string, limit: number): Promise<'ok' | NextResponse> {
  const result = await incrementRateLimitKey(key)
  if (!result) {
    if (process.env.NODE_ENV !== 'production') {
      return 'ok'
    }
    return apiError(
      'RATE_LIMIT_UNAVAILABLE',
      'Rate limiting is temporarily unavailable.',
      undefined,
      503
    )
  }

  const [count, ttlMs] = result
  if (count <= limit) {
    return 'ok'
  }

  const retryAfter = Math.max(1, Math.ceil(ttlMs / 1000))
  const response = apiError(
    'RATE_LIMIT_EXCEEDED',
    `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
    undefined,
    429
  )
  response.headers.set('Retry-After', String(retryAfter))
  return response
}

async function incrementRateLimitKey(key: string): Promise<RedisEvalResult | null> {
  if (!upstashUrl || !upstashToken) {
    return null
  }

  const script = [
    "local current = redis.call('INCR', KEYS[1])",
    "if current == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end",
    "local ttl = redis.call('PTTL', KEYS[1])",
    "return { current, ttl }",
  ].join('\n')

  const response = await fetch(upstashUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${upstashToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['EVAL', script, '1', key, String(WINDOW_MS)]),
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  const body = await response.json() as { result?: unknown }
  if (
    Array.isArray(body.result) &&
    typeof body.result[0] === 'number' &&
    typeof body.result[1] === 'number'
  ) {
    return body.result as RedisEvalResult
  }

  return null
}

// Trusted proxy IPs for X-Forwarded-For validation
const TRUSTED_PROXIES = (process.env.TRUSTED_PROXY_IPS ?? '').split(',').map(s => s.trim()).filter(Boolean)

function isValidIp(ip: string): boolean {
  return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)
}

function getClientIp(req: NextRequest): string {
  const requestIp = (req as NextRequest & { ip?: string }).ip
  if (requestIp && isValidIp(requestIp)) {
    return requestIp
  }

  // Cloudflare headers are only trusted when direct origin access is blocked.
  const cfIp = req.headers.get('cf-connecting-ip')
  if (process.env.TRUST_CF_CONNECTING_IP === 'true' && cfIp && isValidIp(cfIp)) {
    return cfIp
  }

  if (TRUSTED_PROXIES.length === 0) {
    return 'unverified'
  }

  // X-Real-IP is often set by nginx - only trust known proxy values.
  const realIp = req.headers.get('x-real-ip')
  if (realIp && isValidIp(realIp) && TRUSTED_PROXIES.includes(realIp)) {
    return realIp
  }

  // X-Forwarded-For - first IP is client, rest are proxies
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(s => s.trim())
    const clientIp = ips[0]

    if (clientIp && isValidIp(clientIp)) {
      const lastHop = ips[ips.length - 1]
      if (isValidIp(lastHop) && TRUSTED_PROXIES.includes(lastHop)) {
        return clientIp
      }
    }
  }

  return 'unverified'
}

export function rateLimitKey(req: NextRequest, category: string): string {
  const ip = getClientIp(req)

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
