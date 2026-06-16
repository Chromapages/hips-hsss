/**
 * Unified webhook signature verification — Layer 5.
 *
 * Each provider (Stripe, LiveKit, …) has its own signature scheme. This
 * module centralizes the wrapping — providers register their verification
 * function, callers ask for it by name.
 *
 * Every verification function:
 *  - Reads the raw body (the route must pass it as a string, not a
 *    parsed JSON object — JSON.parse → JSON.stringify changes the bytes
 *    and invalidates the signature).
 *  - Returns either { ok: true, event } or { ok: false, reason }.
 *  - Reason is one of:
 *      'missing_signature'
 *      'malformed_signature'
 *      'invalid_signature'
 *      'misconfigured'
 *      'timestamp_out_of_window'
 *
 * Routes then call logSecurityEvent({ eventType: 'WEBHOOK_SIGNATURE_FAILED',
 * failureReason: reason, metadata: { provider, endpoint } }) on failure.
 */

import 'server-only';
import Stripe from 'stripe';
import { WebhookReceiver } from 'livekit-server-sdk';
import { isWithinWindow } from './timestamp';
import { requireSecret, tryGetSecret } from '@/lib/secrets';

export type VerifyOk = { ok: true; event: unknown };
export type VerifyFail = {
  ok: false;
  reason:
    | 'missing_signature'
    | 'malformed_signature'
    | 'invalid_signature'
    | 'misconfigured'
    | 'timestamp_out_of_window';
  detail?: string;
};
export type VerifyResult = VerifyOk | VerifyFail;

export type Provider = 'stripe' | 'livekit';

export type VerifyOptions = {
  provider: Provider;
  body: string;             // raw request body, NOT JSON.parsed
  signature: string | null; // raw value of the signature header
  endpoint: string;         // route path, for audit log
};

// ─── Stripe ────────────────────────────────────────────────────────────────

/**
 * Verify a Stripe webhook. The Stripe SDK already validates the signature
 * AND the embedded timestamp when tolerance is non-zero. We also
 * explicitly check the timestamp window so the failure reason is logged
 * as 'timestamp_out_of_window' (matches the spec) rather than the SDK's
 * generic 'No signatures found matching the expected signature'.
 */
export function verifyStripeSignature(
  body: string,
  signature: string | null,
  endpoint: string,
  toleranceSeconds = 300,
): VerifyResult {
  if (!signature) return { ok: false, reason: 'missing_signature' };
  const secret = tryGetSecret('STRIPE_WEBHOOK_SECRET', { minLength: 32 });
  if (!secret) return { ok: false, reason: 'misconfigured', detail: 'STRIPE_WEBHOOK_SECRET not set' };

  // Pull the timestamp out of the header for our own window check, then
  // delegate to the SDK which checks signature + tolerance.
  const tsMatch = signature.match(/^t=(\d+)/);
  const ts = tsMatch ? parseInt(tsMatch[1]!, 10) : NaN;
  if (Number.isFinite(ts) && !isWithinWindow(ts, toleranceSeconds)) {
    return { ok: false, reason: 'timestamp_out_of_window' };
  }

  try {
    // Lazy-require stripe so this module loads in environments where
    // stripe isn't installed (e.g. some test runners).
    const StripeCtor = require('stripe');
    const stripe = new StripeCtor(secret, { apiVersion: '2025-09-30.clover' });
    const event = stripe.webhooks.constructEvent(body, signature, secret, toleranceSeconds);
    return { ok: true, event };
  } catch (err) {
    const message = (err as Error).message ?? 'unknown';
    if (message.includes('timestamp')) return { ok: false, reason: 'timestamp_out_of_window', detail: message };
    if (message.includes('No signatures')) return { ok: false, reason: 'malformed_signature', detail: message };
    return { ok: false, reason: 'invalid_signature', detail: message };
  }
}

// ─── LiveKit ───────────────────────────────────────────────────────────────

/**
 * Verify a LiveKit webhook. The WebhookReceiver validates the HMAC but
 * does NOT check a timestamp — we do that here against the event's
 * `createdAt` field. LiveKit events include `createdAt` (Unix seconds).
 */
export function verifyLivekitSignature(
  body: string,
  signature: string | null,
  endpoint: string,
  toleranceSeconds = 300,
): VerifyResult {
  if (!signature) return { ok: false, reason: 'missing_signature' };
  const apiKey = tryGetSecret('LIVEKIT_API_KEY', { minLength: 8 });
  const apiSecret = tryGetSecret('LIVEKIT_API_SECRET', { minLength: 32 });
  if (!apiKey || !apiSecret) {
    return { ok: false, reason: 'misconfigured', detail: 'LIVEKIT_API_KEY or LIVEKIT_API_SECRET not set' };
  }

  let event: { id?: string; event?: string; createdAt?: number; room?: { name?: string } };
  try {
    const receiver = new WebhookReceiver(apiKey, apiSecret);
    event = receiver.receive(body, signature) as typeof event;
  } catch (err) {
    return { ok: false, reason: 'invalid_signature', detail: (err as Error).message };
  }

  // Window check — LiveKit events have createdAt (seconds).
  if (typeof event.createdAt === 'number' && !isWithinWindow(event.createdAt, toleranceSeconds)) {
    return { ok: false, reason: 'timestamp_out_of_window', detail: `createdAt=${event.createdAt}` };
  }

  return { ok: true, event };
}

// ─── Dispatch ──────────────────────────────────────────────────────────────

/**
 * Provider dispatcher. Routes call this so the verification pattern is
 * uniform across providers.
 */
export function verifyWebhookSignature(opts: VerifyOptions): VerifyResult {
  switch (opts.provider) {
    case 'stripe':
      return verifyStripeSignature(opts.body, opts.signature, opts.endpoint);
    case 'livekit':
      return verifyLivekitSignature(opts.body, opts.signature, opts.endpoint);
    default: {
      const _exhaustive: never = opts.provider;
      return { ok: false, reason: 'misconfigured', detail: `Unknown provider: ${String(_exhaustive)}` };
    }
  }
}
