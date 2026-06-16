import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto';
import { verifyFirebaseIdToken } from '@/lib/firebase-auth';
import * as admin from 'firebase-admin';

/**
 * Phase 5 — Session Reconnection Handler (5.14)
 * Handles network interruption recovery with exponential backoff.
 * Generates a fresh token for reconnection without creating new identity.
 */

const RECONNECT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RECONNECT_ATTEMPTS = 3;

// Exponential backoff base delay in ms
const BACKOFF_BASE_MS = 1000;
const BACKOFF_MAX_MS = 30000; // 30 seconds max

/**
 * Calculate exponential backoff delay for client
 * Returns delay in ms for the given attempt number (1-indexed)
 */
function calculateBackoff(attemptNumber: number): number {
  const delay = Math.min(
    BACKOFF_BASE_MS * Math.pow(2, attemptNumber - 1),
    BACKOFF_MAX_MS
  );
  // Add jitter (±25%)
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

import { ReconnectRecord, ReconnectRecordSchema, Phase5SessionSchema } from '@/lib/schemas/session';

async function getReconnectRecord(sessionId: string, identity: string): Promise<ReconnectRecord | null> {
  const db = getDb();
  if (!db) return null;

  const docRef = db.collection('session_reconnects').doc(`${sessionId}_${identity}`);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  const parsed = ReconnectRecordSchema.safeParse(doc.data());
  if (!parsed.success) return null;
  return parsed.data;
}


export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again later.',
    }, { status: 503 });
  }

  // Verify Firebase auth token
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let firebaseUid: string | null = null;
  try {
    firebaseUid = (await verifyFirebaseIdToken(token))?.sub ?? null;
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!firebaseUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));

    const { sessionId, reason } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    // Look up the participant's original anonymous identity server-side (H7)
    let originalIdentity: string | null = null;
    try {
      const participantDoc = await db
        .collection('session_participants')
        .doc(`${sessionId}_${firebaseUid}`)
        .get();
      if (participantDoc.exists) {
        const data = participantDoc.data();
        originalIdentity = typeof data?.anonymousIdentity === 'string' ? data.anonymousIdentity : null;
      }
    } catch (err) {
      console.warn('[SessionReconnect] Could not read participant mapping:', err);
    }

    if (!originalIdentity) {
      // Fallback: check if they are the facilitator of the session
      try {
        const sessionDoc = await db.collection('phase5_sessions').doc(sessionId).get();
        if (sessionDoc.exists) {
          const parsed = Phase5SessionSchema.safeParse({ id: sessionDoc.id, ...sessionDoc.data() });
          if (parsed.success && (parsed.data.facilitatorId === firebaseUid || parsed.data.metadata?.facilitatorId === firebaseUid)) {
            const apiSecret = process.env.LIVEKIT_API_SECRET || '';
            originalIdentity = crypto.createHmac('sha256', apiSecret).update(firebaseUid).digest('hex');
          }
        }
      } catch (err) {
        console.warn('[SessionReconnect] Could not check facilitator status:', err);
      }
    }

    if (!originalIdentity) {
      return NextResponse.json(
        { error: 'Forbidden: you are not registered in this session' },
        { status: 403 }
      );
    }

    // Check reconnect record
    let reconnectRecord: ReconnectRecord | null = null;
    try {
      reconnectRecord = await getReconnectRecord(sessionId, originalIdentity);
    } catch (err) {
      console.warn('[SessionReconnect] Could not read reconnect record:', err);
    }

    // Validate reconnect window
    if (reconnectRecord) {
      const lastReconnect = new Date(reconnectRecord.lastReconnectAt).getTime();
      const now = Date.now();

      if (now - lastReconnect > RECONNECT_WINDOW_MS) {
        return NextResponse.json(
          { error: 'Reconnect window has expired. Please rejoin as a new participant.' },
          { status: 410 }
        );
      }

      if (reconnectRecord.reconnectCount >= MAX_RECONNECT_ATTEMPTS) {
        return NextResponse.json(
          {
            error: 'Maximum reconnect attempts reached. Please rejoin as a new participant.',
            backoff: {
              maxAttemptsReached: true,
              maxAttempts: MAX_RECONNECT_ATTEMPTS,
              nextRetryInMs: null,
            }
          },
          { status: 429 }
        );
      }
    }

    // Verify session is still active
    let sessionActive = false;
    try {
      const sessionRef = db.collection('phase5_sessions').doc(sessionId);
      const sessionDoc = await sessionRef.get();
      if (sessionDoc.exists) {
        const parsed = Phase5SessionSchema.safeParse({ id: sessionDoc.id, ...sessionDoc.data() });
        sessionActive = parsed.success && parsed.data.status === 'active';
      }
    } catch (err) {
      console.warn('[SessionReconnect] Could not verify session:', err);
      return NextResponse.json(
        { error: 'Unable to verify session state. Please try again later.' },
        { status: 503 }
      );
    }

    if (!sessionActive) {
      return NextResponse.json(
        { error: 'Session has ended. Cannot reconnect.' },
        { status: 410 }
      );
    }

    // Generate fresh token using SAME identity (not new UUID)
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'LiveKit credentials not configured' },
        { status: 500 }
      );
    }

    const roomName = `session-${sessionId}`;

    const at = new AccessToken(apiKey, apiSecret, {
      identity: originalIdentity, // Same identity for reconnection
      ttl: '1h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    at.metadata = JSON.stringify({
      reconnect: true,
      reconnectCount: (reconnectRecord?.reconnectCount || 0) + 1,
      originalJoinedAt: reconnectRecord?.lastReconnectAt || new Date().toISOString(),
      reason: reason || 'network_interruption',
    });

    const tokenJwt = await at.toJwt();

    const attemptNumber = (reconnectRecord?.reconnectCount || 0) + 1;

    try {
      const docRef = db.collection('session_reconnects').doc(`${sessionId}_${originalIdentity}`);
      await docRef.set({
        sessionId,
        originalIdentity,
        reconnectCount: admin.firestore.FieldValue.increment(1),
        lastReconnectAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + RECONNECT_WINDOW_MS).toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[SessionReconnect] Could not store reconnect record:', err);
    }

    const nextBackoffMs = calculateBackoff(attemptNumber + 1);

    console.log(`[SessionReconnect] Token reissued for ${originalIdentity} in session ${sessionId} (attempt ${attemptNumber})`);

    return NextResponse.json({
      success: true,
      token: tokenJwt,
      roomName: roomName,
      anonymousIdentity: originalIdentity,
      reconnectCount: attemptNumber,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      backoff: {
        nextRetryInMs: nextBackoffMs,
        maxAttempts: MAX_RECONNECT_ATTEMPTS,
        attemptNumber: attemptNumber,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionReconnect] Error:', errorMessage);
    return NextResponse.json(
      {
        error: 'Reconnection failed',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
