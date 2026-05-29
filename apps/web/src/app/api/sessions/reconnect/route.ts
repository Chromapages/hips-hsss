import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto';

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

interface ReconnectRecord {
  sessionId: string;
  originalIdentity: string;
  reconnectCount: number;
  lastReconnectAt: string;
  expiresAt: string;
}

async function getReconnectRecord(sessionId: string, identity: string): Promise<ReconnectRecord | null> {
  const db = getDb();
  if (!db) return null;

  const docRef = db.collection('session_reconnects').doc(`${sessionId}_${identity}`);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  return doc.data() as ReconnectRecord;
}

async function upsertReconnectRecord(record: ReconnectRecord) {
  const db = getDb();
  if (!db) return;

  // Atomic upsert — set with merge avoids query-before-write
  const docRef = db.collection('session_reconnects').doc(
    `${record.sessionId}_${record.originalIdentity}`
  );
  await docRef.set(record, { merge: true });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again later.',
    }, { status: 503 });
  }

  try {
    const body = await req.json().catch(() => ({}));

    const { sessionId, originalIdentity, reason } = body;

    if (!sessionId || !originalIdentity) {
      return NextResponse.json(
        { error: 'sessionId and originalIdentity required' },
        { status: 400 }
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
      sessionActive = sessionDoc.exists && sessionDoc.data()?.status === 'active';
    } catch (err) {
      console.warn('[SessionReconnect] Could not verify session:', err);
      sessionActive = true; // Assume active if we can't check
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

    const at = new AccessToken(apiKey, apiSecret, {
      identity: originalIdentity, // Same identity for reconnection
      ttl: '1h',
    });

    at.addGrant({
      roomJoin: true,
      room: sessionId,
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

    // Update reconnect record
    const newRecord: ReconnectRecord = {
      sessionId,
      originalIdentity,
      reconnectCount: (reconnectRecord?.reconnectCount || 0) + 1,
      lastReconnectAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + RECONNECT_WINDOW_MS).toISOString(),
    };

    try {
      await upsertReconnectRecord(newRecord);
    } catch (err) {
      console.warn('[SessionReconnect] Could not store reconnect record:', err);
    }

    const nextBackoffMs = calculateBackoff(newRecord.reconnectCount + 1);

    console.log(`[SessionReconnect] Token reissued for ${originalIdentity} in session ${sessionId} (attempt ${newRecord.reconnectCount})`);

    return NextResponse.json({
      success: true,
      token: tokenJwt,
      roomName: sessionId,
      anonymousIdentity: originalIdentity,
      reconnectCount: newRecord.reconnectCount,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      backoff: {
        nextRetryInMs: nextBackoffMs,
        maxAttempts: MAX_RECONNECT_ATTEMPTS,
        attemptNumber: newRecord.reconnectCount,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionReconnect] Error:', errorMessage);
    return NextResponse.json(
      { error: 'Reconnection failed', details: errorMessage },
      { status: 500 }
    );
  }
}