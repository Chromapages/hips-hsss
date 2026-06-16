import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

/**
 * Validates the cron secret from the incoming request using a constant-time comparison.
 * Supports:
 * 1. Authorization: Bearer <CRON_SECRET> (Standard)
 * 2. x-cron-secret header (Fallback/Legacy)
 * 3. ?secret=<CRON_SECRET> query parameter (Fallback/Legacy)
 */
export function verifyCronSecret(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || cronSecret.length === 0) {
    console.error('[Cron Auth] CRON_SECRET is not configured in the environment.');
    return false;
  }

  const authHeader = req.headers.get('authorization');
  let provided = '';
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    provided = authHeader.substring(7);
  } else {
    provided = req.headers.get('x-cron-secret') || new URL(req.url).searchParams.get('secret') || '';
  }

  if (provided.length === 0) {
    return false;
  }

  const a = Buffer.from(provided);
  const b = Buffer.from(cronSecret);

  return a.length === b.length && timingSafeEqual(a, b);
}
