import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, getDb, isFirebaseAdminReady } from '@/lib/firebase-admin';
import crypto from 'crypto';
import { FACILITATOR_ROLES } from '@/lib/roles';
import { requireRole } from '@/lib/request-auth';
import { verifyFirebaseIdToken } from '@/lib/firebase-auth';

/**
 * Phase 5 — Session Lifecycle Manager (5.3)
 * Handles session creation → active → end state machine.
 *
 * State transitions:
 *   pending → active (when first participant joins)
 *   active → ended (when session ends)
 *   active → flagged (when safety concern raised)
 */

import { Phase5Session, Phase5SessionSchema } from '@/lib/schemas/session';

type SessionStatus = 'pending' | 'active' | 'ended' | 'flagged';

// Whitelist of allowed metadata keys — any unrecognised key is dropped.
// This prevents callers from smuggling facilitatorId or other privileged
// fields into a session they did not start.
const metadataSchema = z
  .object({
    serviceType: z.string().max(64).optional(),
    topic: z.string().max(128).optional(),
    notes: z.string().max(512).optional(),
  })
  .strict();

const createSessionSchema = z.object({
  serviceType: z.string().max(64).optional().default('peer-support'),
  maxParticipants: z.number().int().min(2).max(10).optional().default(2),
  metadata: metadataSchema.optional(),
});

function getSessionRef(sessionId: string) {
  return db.collection('phase5_sessions').doc(sessionId);
}

async function getSession(sessionId: string): Promise<Phase5Session | null> {
  try {
    const sessionRef = getSessionRef(sessionId);
    const doc = await sessionRef.get();
    if (!doc.exists) return null;
    const parsed = Phase5SessionSchema.safeParse({ id: doc.id, ...doc.data() });
    if (!parsed.success) return null;
    return parsed.data;
  } catch (err) {
    console.warn('[SessionLifecycle] Could not read session');
    return null;
  }
}

async function transitionSession(sessionId: string, newStatus: SessionStatus, additionalData?: Partial<Phase5Session>): Promise<boolean> {
  try {
    const sessionRef = getSessionRef(sessionId);
    const update: Partial<Phase5Session> = { status: newStatus, ...additionalData };

    if (newStatus === 'active' && !additionalData?.activeAt) {
      update.activeAt = new Date().toISOString();
    } else if (newStatus === 'ended' && !additionalData?.endedAt) {
      update.endedAt = new Date().toISOString();
    }

    await sessionRef.update(update);
    return true;
  } catch (err) {
    console.error('[SessionLifecycle] Transition failed');
    return false;
  }
}

/**
 * POST /api/session — Create a new session
 *
 * Auth: requires a Firebase ID token. The caller's UID becomes `createdBy`
 * and is the only authorized facilitator for the session — the body
 * cannot override this. The previous version accepted unauthenticated POSTs
 * with arbitrary facilitatorId values, which let any caller spawn a session
 * impersonating another user. See audit finding A3.
 */
export async function POST(req: NextRequest) {
  const authResult = await requireRole(req, ...FACILITATOR_ROLES);
  if (authResult.error) return authResult.error;

  if (!isFirebaseAdminReady()) {
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again later.',
    }, { status: 503 });
  }

  const callerUid = authResult.user.uid;

  try {
    const body = await req.json().catch(() => ({}));
    const result = createSessionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const { serviceType, maxParticipants, metadata } = result.data;

    const sessionId = crypto.randomUUID();
    const roomName = `session-${sessionId}`;
    const now = new Date().toISOString();

    const session = {
      id: sessionId,
      status: 'pending' as const,
      createdAt: now,
      createdBy: callerUid,
      participantCount: 0,
      maxParticipants: maxParticipants as number,
      roomName,
      flagged: false,
      metadata: {
        ...(serviceType ? { serviceType } : {}),
        facilitatorId: callerUid,
        ...(metadata || {}),
      },
    } satisfies Phase5Session;

    try {
      const sessionRef = getSessionRef(sessionId);
      await sessionRef.set(session);
    } catch {
      console.error('[SessionLifecycle] Failed to create session');
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        roomName: session.roomName,
        createdAt: session.createdAt,
        maxParticipants: session.maxParticipants,
      },
    }, { status: 201 });
  } catch {
    console.error('[SessionLifecycle] POST Error');
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/session — List sessions (with optional filters)
 */
export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again later.',
    }, { status: 503 });
  }

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = await verifyFirebaseIdToken(token);
    const callerUid = decoded.sub as string;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as SessionStatus | null;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const limitClamped = Math.min(Math.max(1, limit), 100);

    // SECURITY: Always filter by caller's UID — prevents session enumeration
    let query: FirebaseFirestore.Query = db
      .collection('phase5_sessions')
      .where('createdBy', '==', callerUid);

    if (status && ['pending', 'active', 'ended', 'flagged'].includes(status)) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('createdAt', 'desc').limit(limitClamped);

    let sessions: Phase5Session[] = [];
    try {
      const snapshot = await query.get();
      sessions = snapshot.docs
        .map(doc => {
          const parsed = Phase5SessionSchema.safeParse({ id: doc.id, ...doc.data() });
          return parsed.success ? parsed.data : null;
        })
        .filter((s): s is Phase5Session => s !== null);
    } catch (err) {
      console.warn('[SessionLifecycle] Could not query sessions');
    }

    return NextResponse.json({
      sessions: sessions.map(s => ({
        id: s.id,
        status: s.status,
        createdAt: s.createdAt,
        activeAt: s.activeAt,
        endedAt: s.endedAt,
        participantCount: s.participantCount,
        maxParticipants: s.maxParticipants,
        flagged: s.flagged,
      })),
      count: sessions.length,
    });
  } catch {
    console.error('[SessionLifecycle] GET Error');
    return NextResponse.json(
      { error: 'Failed to list sessions' },
      { status: 500 }
    );
  }
}
