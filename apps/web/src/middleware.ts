// Canonical Path: apps/web/src/middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify, importX509 } from 'jose';
import { ROLES } from '@/lib/roles';

const FIREBASE_PUBLIC_KEYS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

// Protected route patterns
const PROTECTED_PATTERNS = [
  '/api/dashboard',
  '/api/admin',
  '/api/checkout',
  '/api/session',
  '/api/sessions/book',
  '/api/sessions/cancel',
  '/api/sessions/flag',
  '/api/sessions/feedback',
  '/api/scholarships',
  '/api/facilitator',
  '/api/host',
];

const PROTECTED_PAGES = ['/dashboard', '/checkout', '/session', '/facilitator', '/host', '/admin'];

// Public routes (no auth required)
const PUBLIC_PATTERNS = [
  '/api/services',
  '/api/sessions/availability',
  '/api/auth',
  '/api/stripe/webhook',
  '/api/safety',
  '/api/demo/token',
];



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

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(FIREBASE_PUBLIC_KEYS_URL, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS: HTTP ${response.status}`);
    }

    const cacheControl = response.headers.get('cache-control');
    const maxAgeMatch = cacheControl?.match(/max-age=(\d+)/);
    // Enforce min 300s (5m) and max 3600s (1h)
    const rawMaxAge = maxAgeMatch?.[1] ? parseInt(maxAgeMatch[1], 10) : 3600;
    const maxAge = Math.max(300, Math.min(rawMaxAge, 3600));

    const keys = await response.json() as Record<string, string>;
    publicKeysCache = { keys, expires: now + maxAge * 1000 };
    return keys;
  } catch (error) {
    console.error('Failed to fetch Firebase public keys:', error);
    if (publicKeysCache) {
      console.warn('Serving stale public keys cache as fallback');
      return publicKeysCache.keys;
    }
    throw error;
  }
}

async function verifyToken(token: string): Promise<{ sub: string } | null> {
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

    return { sub: payload.sub as string };
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
    const protectedPage = PROTECTED_PAGES.find((prefix) => pathname.startsWith(prefix));
    if (protectedPage) {
      const token = request.cookies.get('hips-auth-token')?.value;
      if (!token) {
        const loginUrl = new URL('/login', request.url);
        const fromPath = request.nextUrl.pathname + request.nextUrl.search;
        loginUrl.searchParams.set('from', fromPath);
        return NextResponse.redirect(loginUrl);
      }

      const payload = await verifyToken(token);
      if (!payload) {
        const loginUrl = new URL('/login', request.url);
        const fromPath = request.nextUrl.pathname + request.nextUrl.search;
        loginUrl.searchParams.set('from', fromPath);
        return NextResponse.redirect(loginUrl);
      }

      // Middleware verifies identity only. Role redirects are performed by the
      // database-hydrated AuthGuard; API authorization always uses requireRole().
    }

    return NextResponse.next();
  }

  // Public routes — skip auth
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
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

    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.sub);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/checkout/:path*',
    '/session/:path*',
    '/facilitator/:path*',
    '/host/:path*',
    '/admin/:path*',
  ],
};
