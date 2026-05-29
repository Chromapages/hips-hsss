/**
 * CORS Configuration Utility
 * Validates Origin header against an allowlist to prevent CORS bypass attacks.
 */

// Allowlist of trusted origins - only these domains can make cross-origin requests
// In production, this should come from environment variables
const ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173']; // Development defaults

// Additional trusted origins for production
const TRUSTED_ORIGINS = [
  'https://hips-hsss.vercel.app',
  'https://hips-hsss.app',
];

const ALL_ALLOWED_ORIGINS = [...new Set([...ALLOWED_ORIGINS, ...TRUSTED_ORIGINS])];

/**
 * Check if an origin is allowed.
 * Returns the origin if valid, null if not allowed.
 */
export function getAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;

  // Normalize origin (remove trailing slash)
  const normalizedOrigin = origin.replace(/\/$/, '');

  // Check against allowlist
  if (ALL_ALLOWED_ORIGINS.includes(normalizedOrigin)) {
    return normalizedOrigin;
  }

  // In development, allow localhost with any port
  if (process.env.NODE_ENV === 'development' && normalizedOrigin.startsWith('http://localhost:')) {
    return normalizedOrigin;
  }

  return null;
}

/**
 * Get CORS headers for a request.
 * Returns headers with proper CORS configuration or null if origin is not allowed.
 */
export function getCorsHeaders(request: Request): Record<string, string> | null {
  const origin = request.headers.get('Origin');
  const allowedOrigin = getAllowedOrigin(origin);

  if (!allowedOrigin) {
    // Origin not in allowlist - don't set CORS headers (will block cross-origin)
    return null;
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Validate CORS for an API route handler.
 * Returns error response if CORS is invalid, otherwise calls the handler.
 */
export async function withCors<T>(request: Request, handler: () => Promise<T>): Promise<Response> {
  const origin = request.headers.get('Origin');
  const allowedOrigin = getAllowedOrigin(origin);

  if (!allowedOrigin) {
    return new Response(
      JSON.stringify({ error: 'CORS policy violation: Origin not allowed' }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }

  // Call the handler
  const response = await handler();

  // Add CORS headers to response
  const res = response as Response;
  const newHeaders = new Headers(res.headers);
  newHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
  newHeaders.set('Access-Control-Allow-Credentials', 'true');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });
}

/**
 * Handle CORS preflight (OPTIONS) requests.
 */
export function handleCorsPreflight(request: Request): Response | null {
  const origin = request.headers.get('Origin');
  const allowedOrigin = getAllowedOrigin(origin);

  if (!allowedOrigin) {
    return null; // No preflight handling needed (will be blocked)
  }

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}