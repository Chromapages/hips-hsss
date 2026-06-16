import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { verifyWebhookSignature } from '@/lib/webhooks/verify';
import { registerEventId } from '@/lib/webhooks/idempotency';
import { logSecurityEvent } from '@/lib/security/audit';
import { logger, safeError } from '@/lib/logger';

/**
 * LiveKit webhook handler — Layer 5.
 *
 * Pipeline (every step is required):
 *  1. Read raw body (HMAC is computed over exact bytes).
 *  2. verifyWebhookSignature({ provider: 'livekit' }) — covers HMAC +
 *     ±5-min timestamp window on event.createdAt.
 *  3. registerEventId(`livekit:${event.id}`) — Redis dedup, 24h TTL.
 *     Replaces the older Firestore `webhook_events` collection check.
 *  4. Allowlist known event types; ack unknown events with 200.
 *  5. Apply the side effect via Firestore.
 *  6. Signature failures → security audit log.
 */

const ENDPOINT = '/api/livekit/webhook';

const ALLOWED_EVENTS = new Set<string>([
  'room_started',
  'room_finished',
  'participant_joined',
  'participant_left',
]);

const SESSION_ID_PREFIX = 'session-';

export async function POST(req: NextRequest) {
  const body = await req.text();
  // LiveKit sends the signature in `Authorization: Bearer <token>` OR
  // in the `livekit-signature` header. Try both.
  const signature =
    req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '').trim() ??
    req.headers.get('livekit-signature');

  // 1+2: Verify HMAC and timestamp window.
  const verification = verifyWebhookSignature({
    provider: 'livekit',
    body,
    signature: signature || null,
    endpoint: ENDPOINT,
  });

  if (!verification.ok) {
    await logSecurityEvent({
      eventType: 'WEBHOOK_SIGNATURE_FAILED',
      outcome: 'FAILURE',
      targetType: 'webhook',
      targetId: ENDPOINT,
      failureReason: verification.reason,
      metadata: { provider: 'livekit', detail: verification.detail },
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
    });

    const status = verification.reason === 'misconfigured' ? 500 : 401;
    return NextResponse.json(
      { error: `Webhook verification failed: ${verification.reason}` },
      { status },
    );
  }

  const event = verification.event as {
    id?: string;
    event?: string;
    room?: { name?: string };
  };

  // 4: Allowlist unknown events — ack with 200 but don't process.
  if (!event.event || !ALLOWED_EVENTS.has(event.event)) {
    return NextResponse.json({ received: true });
  }

  if (!event.id) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 });
  }

  // 3: Idempotency check (replaces the previous Firestore write).
  const { firstSeen } = await registerEventId(`livekit:${event.id}`);
  if (!firstSeen) {
    return NextResponse.json({ received: true, replay: true });
  }

  // 5: Apply the side effect.
  const roomName = event.room?.name;
  if (!roomName) {
    return NextResponse.json({ received: true });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const sessionId = roomName.startsWith(SESSION_ID_PREFIX)
    ? roomName.slice(SESSION_ID_PREFIX.length)
    : roomName;

  try {
    const sessionRef = db.collection('phase5_sessions').doc(sessionId);
    switch (event.event) {
      case 'participant_joined': {
        const doc = await sessionRef.get();
        const current = doc.data()?.participantCount ?? 0;
        await sessionRef.update({
          participantCount: Math.min(current + 1, 100),
          lastActivityAt: new Date().toISOString(),
        });
        break;
      }
      case 'participant_left': {
        const doc = await sessionRef.get();
        const current = doc.data()?.participantCount ?? 0;
        await sessionRef.update({
          participantCount: Math.max(0, current - 1),
          lastActivityAt: new Date().toISOString(),
        });
        break;
      }
      case 'room_finished': {
        await sessionRef.update({
          status: 'ended',
          endedAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
        });
        break;
      }
    }
  } catch (err) {
    logger.warn('LiveKit webhook: failed to update session', { error: safeError(err) });
    // Don't fail the request — we already acknowledged with 200. The
    // idempotency registry has the event id, so a retry won't re-process.
  }

  return NextResponse.json({ received: true });
}
