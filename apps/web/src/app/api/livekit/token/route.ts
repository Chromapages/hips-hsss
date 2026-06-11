import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto';
import { z } from 'zod';
import * as admin from 'firebase-admin';
import { db, isFirebaseAdminReady } from '@/lib/firebase-admin';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { authorizeSessionAccess } from '@/lib/session-authz';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const palettes = ['coastal', 'sunrise', 'forest'] as const;

const tokenRequestSchema = z.object({
  sessionId: z.string().min(1).max(128),
});

// Phase 5 spec: avatar params lock on session start — never persist to identity
function makeAvatar(seed: string) {
  const first = seed.charCodeAt(0) || 1;
  const second = seed.charCodeAt(1) || 2;

  return {
    style: (first % 12) + 1,
    palette: palettes[second % palettes.length] || 'coastal',
    gesture: 'idle',
    locked: true,
  };
}

// Session lifecycle states
type SessionStatus = 'pending' | 'active' | 'ended' | 'flagged';

interface Phase5Session {
  id: string;
  status: SessionStatus;
  createdAt: string;
  activeAt?: string;
  endedAt?: string;
  startsAt?: string;
  endsAt?: string;
  participantCount: number;
  participantIdentities?: string[];
  facilitatorId?: string;
  flagged: boolean;
  flaggedBy?: string;
  flaggedReason?: string;
}

async function getOrCreateSession(sessionId: string): Promise<Phase5Session> {
  const sessionRef = db.collection('phase5_sessions').doc(sessionId);
  const doc = await sessionRef.get();

  if (doc.exists) {
    return doc.data() as Phase5Session;
  }

  // Create new session
  const session: Phase5Session = {
    id: sessionId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    participantCount: 0,
    participantIdentities: [],
    flagged: false,
  };

  await sessionRef.set(session);
  return session;
}

async function transitionSession(sessionId: string, newStatus: SessionStatus) {
  const sessionRef = db.collection('phase5_sessions').doc(sessionId);
  const update: Partial<Phase5Session> = { status: newStatus };

  if (newStatus === 'active') {
    update.activeAt = new Date().toISOString();
  } else if (newStatus === 'ended') {
    update.endedAt = new Date().toISOString();
  }

  await sessionRef.update(update);
}

export async function POST(req: NextRequest) {
  try {
    // Read credentials from server-only env vars. Do NOT fall back to
    // NEXT_PUBLIC_LIVEKIT_API_* — those are intended to be bundled into the
    // client, and falling back to them would ship the LiveKit signing secret
    // to every browser. See H5 in the audit report.
    const apiKey = process.env.LIVEKIT_API_KEY || '';
    const apiSecret = process.env.LIVEKIT_API_SECRET || '';

    const isMissingOrPlaceholder = !apiKey || !apiSecret || apiKey === 'devkey' || apiSecret === 'secret';

    if (process.env.NODE_ENV === 'production' && isMissingOrPlaceholder) {
      console.error('[LiveKitAPI] MISSING CREDENTIALS IN PRODUCTION');
      return NextResponse.json({
        error: 'LiveKit credentials missing from server environment',
      }, { status: 500 });
    }

    if (isMissingOrPlaceholder) {
      console.warn('[LiveKitAPI] Using development fallback credentials.');
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Rate limit by IP before doing any auth work
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
    const rateLimitResult = checkRateLimit(ip, 20, 60_000); // 20 tokens per minute per IP
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult.resetAt, 0, 20),
        }
      );
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = tokenRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }
    const { sessionId } = parsed.data;
    // Canonical room naming: always use `session-${sessionId}` format.
    // This normalizes the room name between /api/livekit/token and the session service's
    // livekit-token-service so both issue tokens for the same LiveKit room.
    const roomName = `session-${sessionId}`;

    // Verify the session exists before any authz work — single 404 closes the
    // session-existence oracle for unauthenticated callers.
    const adminReady = isFirebaseAdminReady();
    let sessionData: Partial<Phase5Session> = {};

    if (process.env.NODE_ENV === 'development' && (!adminReady || sessionId === 'prototype-demo-room')) {
      sessionData = {
        id: sessionId,
        status: 'active',
        startsAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        endsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      };
    } else {
      if (!adminReady) {
        return NextResponse.json({ error: 'Firebase Admin SDK not initialized' }, { status: 500 });
      }
      const sessionDoc = await db.collection('phase5_sessions').doc(sessionId).get();
      if (!sessionDoc.exists) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      sessionData = sessionDoc.data() as Partial<Phase5Session>;
    }

    // Authorize the caller. The helper accepts either a Firebase ID token (the
    // session creator, the facilitator, or anyone previously recorded in
    // `session_participants`) or an opaque session token whose `ref` matches
    // the sessionId. The previous `participantIdentities.includes(sessionRef)`
    // check was a category error: that field stores anonymous-identity UUIDs,
    // not Firebase UIDs, so it could never match. See audit finding A2.
    const principal = await authorizeSessionAccess(sessionId, req.headers.get('authorization'));
    if (!principal) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Enforce booking status: only ACTIVE sessions can be joined
    if (sessionData.status && sessionData.status !== 'active') {
      return NextResponse.json(
        { error: 'Session is not currently joinable', sessionStatus: sessionData.status },
        { status: 403 }
      );
    }

    // Enforce join window: current time must be within session start/end window
    const now = Date.now();
    if (sessionData.startsAt && now < new Date(sessionData.startsAt).getTime() - 5 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Session has not started yet' },
        { status: 403 }
      );
    }
    if (sessionData.endsAt && now > new Date(sessionData.endsAt).getTime() + 15 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Session has ended' },
        { status: 403 }
      );
    }

    // Phase 5: Stable pseudonymous identity hashed via HMAC-SHA256 with apiSecret
    const uidToHash = principal.kind === 'firebase' ? principal.uid : principal.ref;
    const anonymousIdentity = crypto.createHmac('sha256', apiSecret).update(uidToHash).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour max

    // Session lifecycle — ensure session exists and transition to active
    let session: Partial<Phase5Session> = { id: sessionId, status: 'active', createdAt: new Date().toISOString(), participantCount: 0, flagged: false };
    if (adminReady) {
      try {
        const sessionRecord = await getOrCreateSession(sessionId);
        if (sessionRecord.status === 'pending') {
          await transitionSession(sessionId, 'active');
          sessionRecord.status = 'active';
          sessionRecord.activeAt = new Date().toISOString();
        }
        session = sessionRecord;
      } catch (err) {
        // Non-fatal: continue with token issuance even if Firestore unavailable
        console.warn('[LiveKitAPI] Session lifecycle error:', err);
      }
    }

    console.log(`[LiveKitAPI] Issuing token for room: ${roomName}, identity: ${anonymousIdentity}`);

    const at = new AccessToken(apiKey, apiSecret, {
      identity: anonymousIdentity,
      ttl: '1h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Add metadata forFacilitator identification
    let userRole = 'PARTICIPANT';
    if (principal.kind === 'firebase' && token) {
      try {
        const decoded = await verifyFirebaseIdToken(token);
        if (decoded.role) {
          userRole = decoded.role as string;
        }
      } catch (err) {
        console.warn('[LiveKitAPI] Failed to verify token for role:', err);
      }
    }

    at.metadata = JSON.stringify({
      joinedAt: new Date().toISOString(),
      sessionId,
      role: userRole,
    });

    const tokenJwt = await at.toJwt();

    // Record participant identity for future authorization and reconnection.
    // We persist the (sessionId, firebaseUid) → anonymousIdentity mapping
    // explicitly so the reconnect endpoint can look up the original identity
    // server-side without trusting client input. See H7 in the audit report.
    if (anonymousIdentity && adminReady) {
      try {
        const sessionDocRef = db.collection('phase5_sessions').doc(sessionId);
        await sessionDocRef.update({
          participantIdentities: admin.firestore.FieldValue.arrayUnion(anonymousIdentity),
          lastActivityAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('[LiveKitAPI] Could not update participantIdentities:', err);
        // Non-fatal — token already issued
      }

      if (principal.kind === 'firebase') {
        try {
          await db
            .collection('session_participants')
            .doc(`${sessionId}_${principal.uid}`)
            .set(
              {
                sessionId,
                firebaseUid: principal.uid,
                anonymousIdentity,
                joinedAt: new Date().toISOString(),
                lastSeenAt: new Date().toISOString(),
              },
              { merge: true }
            );
        } catch {
          console.warn('[LiveKitAPI] Could not record session_participants mapping');
          // Non-fatal — token already issued
        }
      }
    }

    return NextResponse.json({
      token: tokenJwt,
      roomName,
      anonymousIdentity,
      avatar: makeAvatar(anonymousIdentity),
      expiresAt: expiresAt.toISOString(),
      sessionStatus: session.status,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[LiveKitAPI] CRITICAL Error:', {
      message: errorMessage,
      code: error && typeof error === 'object' && 'code' in error ? (error as { code: unknown }).code : undefined,
    });
    return NextResponse.json({
      error: 'LiveKit token generation failed',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    }, { status: 500 });
  }
}
