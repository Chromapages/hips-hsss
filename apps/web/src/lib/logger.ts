import 'server-only';

const isProd = process.env.NODE_ENV === 'production';

/**
 * Sanitize an error before logging. Strips:
 *  - Prisma `meta` blocks (can include connection strings)
 *  - Request headers / cookies
 *  - Anything matching a secret pattern (sk_, whsec_, firebase private keys)
 *  - Long stack traces (truncated to 2KB)
 *
 * The goal is to prevent accidental secret leakage via console.error(err).
 * Layer 7's `error.message` lookups for Prisma errors previously could
 * leak DATABASE_URL when the connection was unreachable.
 */
export function safeError(err: unknown): {
  name: string;
  message: string;
  code?: string;
  statusCode?: number;
  // Deliberately exclude `stack`, `cause`, and `meta`.
} {
  if (err === null || err === undefined) {
    return { name: 'UnknownError', message: 'null' };
  }
  if (typeof err === 'string') {
    return { name: 'StringError', message: sanitizeMessage(err) };
  }
  if (err instanceof Error) {
    const out: { name: string; message: string; code?: string; statusCode?: number } = {
      name: err.name,
      message: sanitizeMessage(err.message),
    };
    if ('code' in err && typeof (err as { code: unknown }).code === 'string') {
      out.code = (err as { code: string }).code;
    }
    if ('statusCode' in err && typeof (err as { statusCode: unknown }).statusCode === 'number') {
      out.statusCode = (err as { statusCode: number }).statusCode;
    }
    return out;
  }
  if (typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    return {
      name: typeof obj.name === 'string' ? obj.name : 'UnknownError',
      message: sanitizeMessage(typeof obj.message === 'string' ? obj.message : String(err)),
    };
  }
  return { name: 'UnknownError', message: String(err) };
}

const SECRET_PATTERNS: RegExp[] = [
  /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/g, // Stripe secret keys
  /\bwhsec_[A-Za-z0-9]{16,}\b/g, // Stripe webhook secrets
  /\bAIza[A-Za-z0-9_-]{30,}\b/g, // Firebase public API keys
  /\bAPIV[A-Za-z0-9]{10,}\b/g, // LiveKit API keys
  /\beyJ[A-Za-z0-9_-]{40,}\.eyJ[A-Za-z0-9_-]{40,}\.[A-Za-z0-9_-]{40,}\b/g, // JWTs
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, // Private keys
  /\bpassword\s*[=:]\s*[^\s,;]{4,}/gi,
  /postgresql:\/\/[^@\s]+@/gi, // DB connection strings
  /mongodb(\+srv)?:\/\/[^@\s]+@/gi,
  /redis:\/\/[^@\s]+@/gi,
];

function sanitizeMessage(input: string): string {
  if (!input) return '';
  let s = input;
  for (const re of SECRET_PATTERNS) {
    s = s.replace(re, '[REDACTED]');
  }
  // Truncate to 2KB.
  if (s.length > 2048) s = s.slice(0, 2048) + '...[truncated]';
  return s;
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.log(`[INFO] ${msg}`, meta ?? '');
    }
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${msg}`, meta ?? '');
  },
  error: (msg: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.error(
      JSON.stringify({
        level: 'error',
        msg,
        ...meta,
        ts: new Date().toISOString(),
      })
    );
  },
};
