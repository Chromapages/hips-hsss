/**
 * Webhook timestamp window — Layer 5.
 *
 * Reject webhook events whose timestamp is outside a ±N-second window of
 * the current server time. This catches replay attacks: a captured
 * webhook signed at time T cannot be re-delivered minutes/hours later.
 *
 * Default window: 5 minutes (300 seconds), per the spec.
 */

const DEFAULT_WINDOW_SECONDS = 5 * 60;

/**
 * Returns true if `eventTs` is within `±windowSeconds` of `now`. Both
 * values are Unix timestamps in seconds.
 */
export function isWithinWindow(
  eventTs: number,
  windowSeconds: number = DEFAULT_WINDOW_SECONDS,
  now: number = Math.floor(Date.now() / 1000),
): boolean {
  if (!Number.isFinite(eventTs)) return false;
  return Math.abs(now - eventTs) <= windowSeconds;
}

/**
 * Parse a Stripe-Signature header timestamp. Format: `t=1234567890,v1=...`
 */
export function parseStripeSignatureTimestamp(header: string | null): number | null {
  if (!header) return null;
  const match = header.match(/^t=(\d+)/);
  if (!match) return null;
  const ts = parseInt(match[1]!, 10);
  return Number.isFinite(ts) ? ts : null;
}
