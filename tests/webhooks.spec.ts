/**
 * Webhook tests (Layer 5).
 *
 * Covers:
 *  - Timestamp window enforcement (timestamp out of window rejected)
 *  - Idempotency: registerEventId returns firstSeen:true once, then
 *    firstSeen:false on every subsequent call
 *  - Idempotency TTL: when Redis is unavailable, in-memory fallback
 *    behaves identically within the process
 *  - Stripe signature verification end-to-end
 *  - LiveKit signature verification end-to-end
 *
 * The signature path requires a real provider key. For unit tests we
 * exercise the timestamp + idempotency layers directly. Integration
 * tests of the full signed-payload flow are documented but not
 * automated (they require real provider accounts).
 */

import { describe, expect, it, beforeEach } from 'vitest';
import { isWithinWindow, parseStripeSignatureTimestamp } from '../apps/web/src/lib/webhooks/timestamp';
import {
  registerEventId,
  _clearInMemoryProcessed,
} from '../apps/web/src/lib/webhooks/idempotency';

describe('isWithinWindow', () => {
  const now = 1_700_000_000;

  it('accepts an event at the current time', () => {
    expect(isWithinWindow(now, 300, now)).toBe(true);
  });

  it('accepts an event 4 minutes 59 seconds ago', () => {
    expect(isWithinWindow(now - 299, 300, now)).toBe(true);
  });

  it('accepts an event 4 minutes 59 seconds in the future', () => {
    expect(isWithinWindow(now + 299, 300, now)).toBe(true);
  });

  it('rejects an event 5 minutes 1 second ago', () => {
    expect(isWithinWindow(now - 301, 300, now)).toBe(false);
  });

  it('rejects an event 5 minutes 1 second in the future', () => {
    expect(isWithinWindow(now + 301, 300, now)).toBe(false);
  });

  it('rejects non-finite timestamps', () => {
    expect(isWithinWindow(NaN, 300, now)).toBe(false);
    expect(isWithinWindow(Infinity, 300, now)).toBe(false);
  });
});

describe('parseStripeSignatureTimestamp', () => {
  it('parses a well-formed header', () => {
    expect(parseStripeSignatureTimestamp('t=1700000000,v1=abc123')).toBe(1700000000);
  });

  it('returns null for missing header', () => {
    expect(parseStripeSignatureTimestamp(null)).toBeNull();
  });

  it('returns null for malformed header', () => {
    expect(parseStripeSignatureTimestamp('foo=bar')).toBeNull();
    expect(parseStripeSignatureTimestamp('t=not-a-number')).toBeNull();
  });
});

describe('registerEventId (in-memory fallback)', () => {
  beforeEach(() => {
    _clearInMemoryProcessed();
  });

  it('returns firstSeen:true the first time', async () => {
    const result = await registerEventId('evt-1');
    expect(result.firstSeen).toBe(true);
  });

  it('returns firstSeen:false on the second call', async () => {
    await registerEventId('evt-2');
    const result = await registerEventId('evt-2');
    expect(result.firstSeen).toBe(false);
  });

  it('treats different ids as independent', async () => {
    expect((await registerEventId('evt-3')).firstSeen).toBe(true);
    expect((await registerEventId('evt-4')).firstSeen).toBe(true);
    expect((await registerEventId('evt-3')).firstSeen).toBe(false);
    expect((await registerEventId('evt-4')).firstSeen).toBe(false);
  });

  it('rejects empty eventId', async () => {
    await expect(registerEventId('')).rejects.toThrow();
  });
});
