import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto';
import { db } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { verifySessionToken } from '@/lib/session-auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const palettes = ['coastal', 'sunrise', 'forest'] as const;

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
  participantCount: number;
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
    const apiKey = process.env.LIVEKIT_API_KEY || process.env.NEXT_PUBLIC_LIVEKIT_API_KEY || 'devkey';
    const apiSecret = process.env.LIVEKIT_API_SECRET || process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET || 'secret';

    if (process.env.NODE_ENV === 'production' && (apiKey === 'devkey' || apiSecret === 'secret')) {
      console.error('[LiveKitAPI] MISSING CREDENTIALS IN PRODUCTION', { apiKey: apiKey !== 'devkey', apiSecret: apiSecret !== 'secret' });
      return NextResponse.json({
        error: 'LiveKit credentials missing from server environment',
      }, { status: 500 });
    }

    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      console.warn('[LiveKitAPI] Using development fallback credentials (devkey/secret).');
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

    // Verify Firebase token first (preferred)
    let sessionRef: string | null = null;
    try {
      const payload = await verifyFirebaseIdToken(token);
      sessionRef = payload.sub || null;
    } catch {
      // Fallback: verify session token
      const sessionPayload = await verifySessionToken(token);
      if (sessionPayload) {
        sessionRef = sessionPayload.ref;
      }
    }

    if (!sessionRef) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const roomName = body.sessionId || `session-${crypto.randomUUID()}`;

    // Validate that the sessionId matches the caller's session reference
    // This prevents IDOR: users can only join their own session
    if (body.sessionId && sessionRef !== body.sessionId) {
      // Allow if the session document has the user as a participant
      const sessionDoc = await db.collection('phase5_sessions').doc(body.sessionId).get();
      if (!sessionDoc.exists) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      const sessionData = sessionDoc.data();
      // If session exists but caller is not the owner/participant, reject
      // Owner is identified by roomName containing the sessionRef
      const isAuthorized = roomName === `session-${sessionRef}` ||
        sessionData?.participantIdentities?.includes(sessionRef) ||
        sessionData?.facilitatorId === sessionRef;
      if (!isAuthorized) {
        return NextResponse.json({ error: 'Forbidden: not authorized for this session' }, { status: 403 });
      }
    }

    // Phase 5: Anonymous identity ONLY — no Firebase UID
    const anonymousIdentity = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour max

    // Session lifecycle — ensure session exists and transition to active
    let session: Phase5Session;
    try {
      session = await getOrCreateSession(roomName);
      if (session.status === 'pending') {
        await transitionSession(roomName, 'active');
        session.status = 'active';
        session.activeAt = new Date().toISOString();
      }
    } catch (err) {
      // Non-fatal: continue with token issuance even if Firestore unavailable
      console.warn('[LiveKitAPI] Session lifecycle error:', err);
      session = { id: roomName, status: 'active', createdAt: new Date().toISOString(), participantCount: 0, flagged: false };
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
    at.metadata = JSON.stringify({
      joinedAt: new Date().toISOString(),
      sessionId: roomName,
    });

    const tokenJwt = await at.toJwt();

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
