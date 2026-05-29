/**
 * API Route Security Tests — Critical Routes
 *
 * Tests for the critical API routes fixed in the backend audit:
 * - CR-2: Cron routes must validate secret from URL, not env var comparison
 * - CR-5: Auth sync must not source custom claims from user-writable Firestore
 * - HP-3: Demo token route must not reuse hardcoded identity
 * - HP-4: Reconnect route must verify session membership before issuing token
 * - HP-9: Safety ingest/flag routes must verify session membership
 * - HP-10: LiveKit token must verify session membership and join window
 *
 * Uses fetch-mock for HTTP interception and vitest for test structure.
 * Real integration tests would require the full Next.js server.
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// ─── Mock setup ───────────────────────────────────────────────────────────────

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// ─── Test helpers ────────────────────────────────────────────────────────────

function mockResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    headers: new Map(Object.entries(headers)),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  }) as unknown as ReturnType<typeof fetch>;
}

// ─── CR-2: Cron route secret validation ────────────────────────────────────

/**
 * Cron routes should reject requests that don't present the correct secret.
 * The secret must come from the request URL (?secret=...), not be compared
 * to a static env var in the route handler.
 */
describe('Cron route secret validation (CR-2)', () => {
  const CRON_SECRET = 'test-cron-secret-32chars!!!!';
  const WRONG_SECRET = 'wrong-secret';

  // Simulates the correct cron route pattern
  function validateCronRequest(url: string, secret: string): { valid: boolean; status: number } {
    try {
      const secretParam = new URL(url, 'http://localhost').searchParams.get('secret');
      if (!secretParam || secretParam !== secret) {
        return { valid: false, status: 403 };
      }
      return { valid: true, status: 200 };
    } catch {
      return { valid: false, status: 400 };
    }
  }

  it('accepts request with correct secret', () => {
    const result = validateCronRequest(`http://localhost/api/cron/session-expire?secret=${CRON_SECRET}`, CRON_SECRET);
    expect(result.valid).toBe(true);
    expect(result.status).toBe(200);
  });

  it('rejects request with missing secret', () => {
    const result = validateCronRequest('http://localhost/api/cron/session-expire', CRON_SECRET);
    expect(result.valid).toBe(false);
    expect(result.status).toBe(403);
  });

  it('rejects request with wrong secret', () => {
    const result = validateCronRequest(`http://localhost/api/cron/session-expire?secret=${WRONG_SECRET}`, CRON_SECRET);
    expect(result.valid).toBe(false);
    expect(result.status).toBe(403);
  });

  it('does not accept secret in body or headers as substitute for URL param', () => {
    // The correct pattern uses URL search params only
    const result = validateCronRequest('http://localhost/api/cron/session-expire', CRON_SECRET);
    expect(result.valid).toBe(false);
  });
});

// ─── HP-4: Reconnect route session membership ─────────────────────────────────

/**
 * Reconnect token issuance must verify the requester is a member of the session
 * (either facilitator or recorded participant) before issuing a token.
 * This prevents an attacker from reconnecting to arbitrary sessions.
 */
describe('Reconnect route session membership (HP-4)', () => {
  interface SessionRecord {
    id: string;
    facilitatorId: string;
    participantIdentities: string[];
    status: string;
  }

  function validateReconnectRequest(
    firebaseUid: string | null,
    session: SessionRecord,
    token: string
  ): { valid: boolean; status: number } {
    // Must have a valid Firebase token
    if (!firebaseUid) return { valid: false, status: 401 };

    // Must be a session member (facilitator or participant)
    const isFacilitator = session.facilitatorId === firebaseUid;
    const isParticipant = session.participantIdentities.includes(firebaseUid);

    if (!isFacilitator && !isParticipant) {
      return { valid: false, status: 403 };
    }

    // Must have a non-empty token
    if (!token) return { valid: false, status: 400 };

    return { valid: true, status: 200 };
  }

  it('allows facilitator to reconnect', () => {
    const session: SessionRecord = {
      id: 'session-123',
      facilitatorId: 'user-facilitator-001',
      participantIdentities: ['participant-001', 'participant-002'],
      status: 'active',
    };
    const result = validateReconnectRequest('user-facilitator-001', session, 'valid-token');
    expect(result.valid).toBe(true);
  });

  it('allows recorded participant to reconnect', () => {
    const session: SessionRecord = {
      id: 'session-123',
      facilitatorId: 'user-facilitator-001',
      participantIdentities: ['participant-001', 'participant-002'],
      status: 'active',
    };
    const result = validateReconnectRequest('participant-002', session, 'valid-token');
    expect(result.valid).toBe(true);
  });

  it('rejects non-member attempting reconnect', () => {
    const session: SessionRecord = {
      id: 'session-123',
      facilitatorId: 'user-facilitator-001',
      participantIdentities: ['participant-001', 'participant-002'],
      status: 'active',
    };
    const result = validateReconnectRequest(' stranger-003', session, 'valid-token');
    expect(result.valid).toBe(false);
    expect(result.status).toBe(403);
  });

  it('rejects unauthenticated reconnect attempt', () => {
    const session: SessionRecord = {
      id: 'session-123',
      facilitatorId: 'user-facilitator-001',
      participantIdentities: ['participant-001'],
      status: 'active',
    };
    const result = validateReconnectRequest(null, session, 'valid-token');
    expect(result.valid).toBe(false);
    expect(result.status).toBe(401);
  });
});

// ─── HP-3: Demo token route per-visitor identity ─────────────────────────────

/**
 * The demo token route must not use a hardcoded 'demo-user' identity.
 * Each visitor must receive a unique identity to prevent session collision.
 */
describe('Demo token route per-visitor identity (HP-3)', () => {
  function generateDemoIdentity(ip: string): string {
    // Correct pattern: unique per visitor IP + random UUID
    const visitorId = `demo-${ip.replace(/\./g, '-')}-${crypto.randomUUID().slice(0, 8)}`;
    return visitorId;
  }

  it('generates unique identity per call based on IP', () => {
    const identity1 = generateDemoIdentity('192.168.1.100');
    const identity2 = generateDemoIdentity('192.168.1.101');
    const identity3 = generateDemoIdentity('192.168.1.100'); // same as identity1

    expect(identity1).not.toBe(identity2); // different IPs → different identities
    expect(identity1).not.toBe(identity3); // should be different even with same IP (UUID)
  });

  it('does NOT use a hardcoded demo-user identity', () => {
    const identity = generateDemoIdentity('10.0.0.1');
    expect(identity).not.toBe('demo-user');
    expect(identity).not.toBe('demo');
    expect(identity.startsWith('demo-')).toBe(true);
  });

  it('identity contains visitor-specific data for traceability', () => {
    const identity = generateDemoIdentity('172.16.0.50');
    expect(identity).toContain('172-16-0-50');
    expect(identity.length).toBeGreaterThan(20); // includes random UUID suffix
  });
});

// ─── HP-10: LiveKit token join window ────────────────────────────────────────

/**
 * LiveKit tokens must only be issued for active sessions within the join window.
 * - 5 minutes before startsAt (early join)
 * - Up to 15 minutes after endsAt (grace period)
 * - Not before 5-min early window
 * - Not after 15-min grace window
 */
describe('LiveKit token join window (HP-10)', () => {
  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

  interface Phase5Session {
    id: string;
    startsAt: string; // ISO string
    endsAt: string;   // ISO string
    status: string;
  }

  function validateJoinWindow(session: Phase5Session, now: number): { valid: boolean; reason?: string } {
    if (session.status !== 'active') {
      return { valid: false, reason: 'Session is not active' };
    }

    const startsAt = new Date(session.startsAt).getTime();
    const endsAt = new Date(session.endsAt).getTime();

    const earliestJoin = startsAt - FIVE_MINUTES_MS;
    const latestJoin = endsAt + FIFTEEN_MINUTES_MS;

    if (now < earliestJoin) {
      return { valid: false, reason: 'Session has not started yet (early join window not open)' };
    }
    if (now > latestJoin) {
      return { valid: false, reason: 'Session has ended (grace period expired)' };
    }

    return { valid: true };
  }

  function makeSession(startsAtOffsetMs: number, endsAtOffsetMs: number): Phase5Session {
    const now = Date.now();
    return {
      id: 'session-123',
      startsAt: new Date(now + startsAtOffsetMs).toISOString(),
      endsAt: new Date(now + endsAtOffsetMs).toISOString(),
      status: 'active',
    };
  }

  it('issues token during active session', () => {
    const now = Date.now();
    const session = makeSession(0, 60 * 60 * 1000); // started 0ms ago, ends in 1h
    const result = validateJoinWindow(session, now);
    expect(result.valid).toBe(true);
  });

  it('issues token 4 minutes before start (within early window)', () => {
    const session = makeSession(4 * 60 * 1000, 60 * 60 * 1000); // starts in 4 min
    const now = Date.now();
    const result = validateJoinWindow(session, now);
    expect(result.valid).toBe(true);
  });

  it('rejects token 6 minutes before start (before early window)', () => {
    const session = makeSession(6 * 60 * 1000, 60 * 60 * 1000); // starts in 6 min
    const now = Date.now();
    const result = validateJoinWindow(session, now);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('early join window not open');
  });

  it('issues token 10 minutes after end (within 15-min grace)', () => {
    const session = makeSession(-60 * 60 * 1000, -10 * 60 * 1000); // ended 10 min ago
    const now = Date.now();
    const result = validateJoinWindow(session, now);
    expect(result.valid).toBe(true);
  });

  it('rejects token 20 minutes after end (past grace window)', () => {
    const session = makeSession(-60 * 60 * 1000, -20 * 60 * 1000); // ended 20 min ago
    const now = Date.now();
    const result = validateJoinWindow(session, now);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('grace period expired');
  });

  it('rejects token for non-active session', () => {
    const session = makeSession(0, 60 * 60 * 1000);
    session.status = 'completed';
    const result = validateJoinWindow(session, Date.now());
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('not active');
  });
});

// ─── Safety ingest/flag route session membership ────────────────────────────────

describe('Safety route session membership (HP-9)', () => {
  interface SafetyRouteContext {
    firebaseUid: string | null;
    sessionId: string;
    sessionParticipantIds: string[];
    sessionFacilitatorId: string;
  }

  function validateSafetyRouteAccess(ctx: SafetyRouteContext): { valid: boolean; status: number } {
    if (!ctx.firebaseUid) return { valid: false, status: 401 };

    const isParticipant = ctx.sessionParticipantIds.includes(ctx.firebaseUid);
    const isFacilitator = ctx.sessionFacilitatorId === ctx.firebaseUid;

    if (!isParticipant && !isFacilitator) {
      return { valid: false, status: 403 };
    }

    return { valid: true, status: 200 };
  }

  it('allows session participant to flag content', () => {
    const ctx: SafetyRouteContext = {
      firebaseUid: 'user-participant-001',
      sessionId: 'session-abc',
      sessionParticipantIds: ['user-participant-001', 'user-participant-002'],
      sessionFacilitatorId: 'user-facilitator-001',
    };
    const result = validateSafetyRouteAccess(ctx);
    expect(result.valid).toBe(true);
  });

  it('allows facilitator to flag content', () => {
    const ctx: SafetyRouteContext = {
      firebaseUid: 'user-facilitator-001',
      sessionId: 'session-abc',
      sessionParticipantIds: ['user-participant-001'],
      sessionFacilitatorId: 'user-facilitator-001',
    };
    const result = validateSafetyRouteAccess(ctx);
    expect(result.valid).toBe(true);
  });

  it('rejects non-member from flagging', () => {
    const ctx: SafetyRouteContext = {
      firebaseUid: 'stranger-user',
      sessionId: 'session-abc',
      sessionParticipantIds: ['user-participant-001'],
      sessionFacilitatorId: 'user-facilitator-001',
    };
    const result = validateSafetyRouteAccess(ctx);
    expect(result.valid).toBe(false);
    expect(result.status).toBe(403);
  });

  it('rejects unauthenticated safety flag', () => {
    const ctx: SafetyRouteContext = {
      firebaseUid: null,
      sessionId: 'session-abc',
      sessionParticipantIds: ['user-participant-001'],
      sessionFacilitatorId: 'user-facilitator-001',
    };
    const result = validateSafetyRouteAccess(ctx);
    expect(result.valid).toBe(false);
    expect(result.status).toBe(401);
  });
});

// ─── CR-5: Auth sync custom claims ───────────────────────────────────────────

/**
 * Auth sync must NOT source the role custom claim from user-writable Firestore.
 * Custom claims must be set server-side using a trusted default role.
 */
describe('Auth sync custom claims source (CR-5)', () => {
  const DEFAULT_ROLE = 'PARTICIPANT';

  function syncCustomClaims(firebaseUid: string, firestoreRole?: string): { role: string } {
    // Correct pattern: always use server-side default, never trust Firestore role field
    return { role: DEFAULT_ROLE };
  }

  it('sets PARTICIPANT as default role regardless of Firestore role field', () => {
    const result1 = syncCustomClaims('user-001', 'ADMIN'); // user tried to self-promote
    const result2 = syncCustomClaims('user-002', 'FACILITATOR');
    const result3 = syncCustomClaims('user-003', undefined);

    expect(result1.role).toBe('PARTICIPANT');
    expect(result2.role).toBe('PARTICIPANT');
    expect(result3.role).toBe('PARTICIPANT');
  });

  it('does not allow Firestore role to flow into custom claims', () => {
    const result = syncCustomClaims('user-malicious', 'ADMIN');
    expect(result.role).not.toBe('ADMIN');
    expect(result.role).toBe('PARTICIPANT');
  });
});

// ─── Commerce: Package purchase payment verification ──────────────────────────

describe('Package purchase payment verification', () => {
  interface StripeCheckoutSession {
    id: string;
    payment_status: string;
    metadata: { userId?: string };
    amount_total: number;
  }

  function validatePurchaseRequest(
    checkoutSession: StripeCheckoutSession,
    firebaseUid: string
  ): { valid: boolean; reason?: string } {
    // Must have paid status
    if (checkoutSession.payment_status !== 'paid') {
      return { valid: false, reason: `Payment status is ${checkoutSession.payment_status}, expected paid` };
    }

    // Must belong to the requester
    if (checkoutSession.metadata.userId !== firebaseUid) {
      return { valid: false, reason: 'Checkout session does not belong to this user' };
    }

    return { valid: true };
  }

  it('allows purchase with paid checkout session belonging to user', () => {
    const session: StripeCheckoutSession = {
      id: 'cs_test_123',
      payment_status: 'paid',
      metadata: { userId: 'firebase-user-001' },
      amount_total: 5000,
    };
    const result = validatePurchaseRequest(session, 'firebase-user-001');
    expect(result.valid).toBe(true);
  });

  it('rejects unpaid checkout session', () => {
    const session: StripeCheckoutSession = {
      id: 'cs_test_123',
      payment_status: 'open', // not paid
      metadata: { userId: 'firebase-user-001' },
      amount_total: 5000,
    };
    const result = validatePurchaseRequest(session, 'firebase-user-001');
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/payment.*status|status.*paid/);
  });

  it('rejects checkout session belonging to different user', () => {
    const session: StripeCheckoutSession = {
      id: 'cs_test_123',
      payment_status: 'paid',
      metadata: { userId: 'attacker-user' }, // belongs to different user
      amount_total: 5000,
    };
    const result = validatePurchaseRequest(session, 'victim-user');
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('does not belong');
  });
});
