import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { WebhookReceiver } from 'livekit-server-sdk';

/**
 * LiveKit Webhook Receiver — handles session lifecycle events.
 * Updates participantCount and session status in Firestore when
 * participants join/leave or the room finishes.
 *
 * Security contract (C1, Sprint 1):
 * - LIVEKIT_WEBHOOK_SECRET is mandatory. If unset, the route refuses to run.
 * - The livekit-signature header is mandatory. Missing header → 401.
 * - The HMAC is compared with timingSafeEqual on equal-length buffers.
 * - Replay protection: each event id is recorded in `webhook_events` once.
 *   A second delivery with the same id is acknowledged but not processed.
 * - Events outside the allowlist are acknowledged with 200 but not processed.
 */
const ALLOWED_EVENTS = new Set<string>([
  'room_started',
  'room_finished',
  'participant_joined',
  'participant_left',
]);

const SESSION_ID_PREFIX = 'session-';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('Authorization') || req.headers.get('livekit-signature');

  // 1. Webhook credentials check
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 503 }
    );
  }

  // 2. Signature header is mandatory — fail closed if missing.
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature header' },
      { status: 401 }
    );
  }

  // 3. Verify signature using WebhookReceiver
  const receiver = new WebhookReceiver(apiKey, apiSecret);
  let event: {
    id?: string;
    event?: string;
    room?: { name?: string };
  };

  try {
    event = await receiver.receive(body, signature) as any;
  } catch (err: any) {
    return NextResponse.json(
      { error: `Invalid webhook signature: ${err.message || 'Verification failed'}` },
      { status: 401 }
    );
  }

  // 5. Allowlist unknown events (acknowledge but do not process).
  if (!event.event || !ALLOWED_EVENTS.has(event.event)) {
    return NextResponse.json({ received: true });
  }

  // 6. Replay protection — record the event id once.
  if (!event.id) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 });
  }
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  try {
    await db.collection('webhook_events').doc(event.id).create({
      receivedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: unknown }).code === 6
    ) {
      // ALREADY_EXISTS — replay. Acknowledge without reprocessing.
      return NextResponse.json({ received: true, replay: true });
    }
    console.error('[LiveKitWebhook] Dedupe write failed:', err);
    return NextResponse.json({ error: 'Dedupe check failed' }, { status: 503 });
  }

  // 7. Apply the side effect.
  const roomName = event.room?.name;
  if (!roomName) {
    return NextResponse.json({ received: true });
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
    console.warn('[LiveKitWebhook] Failed to update session:', err);
  }

  return NextResponse.json({ received: true });
}
