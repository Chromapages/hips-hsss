import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

/**
 * LiveKit Webhook Receiver — handles session lifecycle events.
 * Updates participantCount and session status in Firestore when
 * participants join/leave or the room ends.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('livekit-signature');

  // Verify webhook signature if secret is configured
  if (process.env.LIVEKIT_WEBHOOK_SECRET && signature) {
    try {
      const crypto = await import('crypto');
      const expected = crypto
        .createHmac('sha256', process.env.LIVEKIT_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
      const received = Buffer.from(signature, 'base64').toString('hex');
      if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let event: {
    eventType?: string;
    room?: { name?: string };
    participant?: { identity?: string };
  };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const roomName = event?.room?.name;
  if (!roomName) {
    return NextResponse.json({ received: true });
  }

  // Extract sessionId from room name (format: session-{id})
  const sessionId = roomName.startsWith('session-')
    ? roomName.replace('session-', '')
    : roomName;

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  try {
    const sessionRef = db.collection('phase5_sessions').doc(sessionId);

    switch (event.eventType) {
      case 'participant_joined': {
        const doc = await sessionRef.get();
        const current = doc.data()?.participantCount ?? 0;
        await sessionRef.update({
          participantCount: Math.min(current + 1, 100),
          lastActivityAt: new Date().toISOString(),
        });
        console.log(`[LiveKitWebhook] participant_joined for ${sessionId}, count now ${current + 1}`);
        break;
      }
      case 'participant_left': {
        const doc = await sessionRef.get();
        const current = doc.data()?.participantCount ?? 0;
        await sessionRef.update({
          participantCount: Math.max(0, current - 1),
          lastActivityAt: new Date().toISOString(),
        });
        console.log(`[LiveKitWebhook] participant_left for ${sessionId}, count now ${Math.max(0, current - 1)}`);
        break;
      }
      case 'room_ended': {
        await sessionRef.update({
          status: 'ended',
          endedAt: new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
        });
        console.log(`[LiveKitWebhook] room_ended for ${sessionId}`);
        break;
      }
    }
  } catch (err) {
    console.warn('[LiveKitWebhook] Failed to update session:', err);
  }

  return NextResponse.json({ received: true });
}