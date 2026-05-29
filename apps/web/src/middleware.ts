import { NextResponse } from 'next/server';
import type { NextRequest } from 'next';
import { jwtVerify, importX509 } from 'jose';
import { ROLES } from '@/lib/roles';
import { randomBytes } from 'crypto';
import { getRedis } from '@/lib/redis';
// NOTE: Requires `npm install ioredis` for production multi-instance deployments.
/// <reference types="ioredis" />

const FIREBASE_PUBLIC_KEYS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

// Protected route patterns
const PROTECTED_PATTERNS = [
  '/api/dashboard',
  '/api/admin',
  '/api/checkout',
  '/api/sessions/book',
  '/api/sessions/cancel',
  '/api/sessions/flag',
  '/api/scholarships',
  '/api/facilitator',
];

// Public routes (no auth required)
const PUBLIC_PATTERNS = [
  '/api/services',
  '/api/sessions/availability',
  '/api/auth',
  '/api/stripe/webhook',
  '/api/safety',
];

// State-changing methods requiring CSRF
const CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

// In-memory fallback store (used when Redis is unavailable)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const inMemoryRateLimitStore = new Map<string, RateLimitEntry>();

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
  return `rl:${ip}`;
}

async function isRateLimited(key: string): Promise<boolean> {
  const redis = getRedis();

  if (redis) {
    try {
      const ttlKey = key;
      const incrKey = key;
      const pipeline = redis.pipeline();
      pipeline.incr(incrKey);
      pipeline.ttl(ttlKey);
      const results = await pipeline.exec();

      if (results) {
        const incrResult = results[0];
        const ttlResult = results[1];

        if (!incrResult[0] && !ttlResult[0]) {
          const current = incrResult[1] as number;
          let ttl = ttlResult[1] as number;

          if (ttl <= 0) {
            await redis.expire(ttlKey, 60);
            ttl = 60;
          }

          if (current > MAX_REQUESTS) {
            return true;
          }
        }
      }
    } catch {
      // Fall through to in-memory on error
    }
  }

  // In-memory fallback
  const now = Date.now();
  const record = inMemoryRateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    inMemoryRateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

let publicKeysCache: { keys: Record<string, string>; expires: number } | null = null;

async function getPublicKeys() {
  const now = Date.now();
  if (publicKeysCache && publicKeysCache.expires > now) {
    return publicKeysCache.keys;
  }

  const response = await fetch(FIREBASE_PUBLIC_KEYS_URL);
  const cacheControl = response.headers.get('cache-control');
  const maxAgeMatch = cacheControl?.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch?.[1] ? parseInt(maxAgeMatch[1], 10) : 3600;

  const keys = await response.json() as Record<string, string>;
  publicKeysCache = { keys, expires: now + maxAge * 1000 };
  return keys;
}

async function verifyToken(token: string): Promise<{ sub: string; role?: string } | null> {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const publicKeys = await getPublicKeys();
    const encodedHeader = token.split('.')[0];
    if (!encodedHeader) return null;

    const header = JSON.parse(atob(encodedHeader));
    const kid = header.kid;
    const x509 = publicKeys[kid];
    if (!x509) return null;

    const publicKey = await importX509(x509, 'RS256');
    const { payload } = await jwtVerify(token, publicKey, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    return { sub: payload.sub as string, role: payload.role as string | undefined };
  } catch {
    return null;
  }
}

function isPublicRoute(pathname: string): boolean {
  for (const pattern of PUBLIC_PATTERNS) {
    if (pathname.startsWith(pattern)) return true;
  }
  return false;
}

function isProtectedRoute(pathname: string): boolean {
  for (const pattern of PROTECTED_PATTERNS) {
    if (pathname.startsWith(pattern)) return true;
  }
  return false;
}

function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

function verifyCSRF(req: NextRequest): boolean {
  const cookieToken = req.cookies.get('csrf-token')?.value;
  const headerToken = req.headers.get('x-csrf-token');
  return !!(cookieToken && headerToken && cookieToken === headerToken);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting to all API routes
  if (pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request);
    if (await isRateLimited(key)) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }
  }

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public routes — set CSRF cookie, skip auth
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    const csrfCookie = request.cookies.get('csrf-token')?.value;
    if (!csrfCookie) {
      response.cookies.set('csrf-token', generateCSRFToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }
    return response;
  }

  // Protected routes — require auth
  if (isProtectedRoute(pathname)) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // CSRF protection for state-changing methods
    if (CSRF_METHODS.includes(request.method)) {
      if (!verifyCSRF(request)) {
        return NextResponse.json({ error: 'CSRF token missing or invalid' }, { status: 403 });
      }
    }

    // Admin routes
    if (pathname.startsWith('/api/admin')) {
      if (payload.role !== ROLES.ADMIN) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Facilitator routes
    if (pathname.startsWith('/api/facilitator')) {
      if (payload.role !== ROLES.FACILITATOR && payload.role !== ROLES.ADMIN) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.sub);
    response.headers.set('x-user-role', payload.role || '');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};