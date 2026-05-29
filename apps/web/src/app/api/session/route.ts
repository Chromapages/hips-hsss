import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, getDb, isFirebaseAdminReady } from '@/lib/firebase-admin';
import crypto from 'crypto';

/**
 * Phase 5 — Session Lifecycle Manager (5.3)
 * Handles session creation → active → end state machine.
 * 
 * State transitions:
 *   pending → active (when first participant joins)
 *   active → ended (when session ends)
 *   active → flagged (when safety concern raised)
 */

type SessionStatus = 'pending' | 'active' | 'ended' | 'flagged';

interface Phase5Session {
  id: string;
  status: SessionStatus;
  createdAt: string;
  activeAt?: string;
  endedAt?: string;
  participantCount: number;
  maxParticipants: number;
  roomName: string;
  flagged: boolean;
  flaggedBy?: string;
  flaggedReason?: string;
  flaggedAt?: string;
  metadata?: {
    serviceType?: string;
    facilitatorId?: string;
  };
}

const createSessionSchema = z.object({
  serviceType: z.string().optional().default('peer-support'),
  maxParticipants: z.number().int().min(2).max(10).optional().default(2),
  facilitatorId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Helper to get session document reference
function getSessionRef(sessionId: string) {
  return db.collection('phase5_sessions').doc(sessionId);
}

// Helper to get session with error handling
async function getSession(sessionId: string): Promise<Phase5Session | null> {
  try {
    const sessionRef = getSessionRef(sessionId);
    const doc = await sessionRef.get();
    if (!doc.exists) return null;
    return doc.data() as Phase5Session;
  } catch (err) {
    console.warn('[SessionLifecycle] Could not read session:', err);
    return null;
  }
}

// Transition session to new status
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
    console.error('[SessionLifecycle] Transition failed:', err);
    return false;
  }
}

/**
 * POST /api/session — Create a new session
 */
export async function POST(req: NextRequest) {
  // Initialize Firestore lazily — return 503 if not configured
  if (!isFirebaseAdminReady()) {
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again later.',
    }, { status: 503 });
  }
  const db = getDb();

  try {
    const body = await req.json().catch(() => ({}));
    const result = createSessionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const { serviceType, maxParticipants, facilitatorId, metadata } = result.data;
    
    // Generate session ID and room name
    const sessionId = crypto.randomUUID();
    const roomName = `session-${sessionId}`;
    const now = new Date().toISOString();

    const session = {
      id: sessionId,
      status: 'pending' as const,
      createdAt: now,
      participantCount: 0,
      maxParticipants: maxParticipants as number,
      roomName,
      flagged: false,
      metadata: {
        ...(serviceType ? { serviceType } : {}),
        ...(facilitatorId ? { facilitatorId } : {}),
        ...(metadata || {}),
      },
    } satisfies Phase5Session;

    // Store session in Firestore
    try {
      const sessionRef = getSessionRef(sessionId);
      await sessionRef.set(session);
      console.log(`[SessionLifecycle] Created session ${sessionId}`);
    } catch (err) {
      console.error('[SessionLifecycle] Failed to create session:', err);
      return NextResponse.json(
        { error: 'Failed to create session', details: 'Database unavailable' },
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionLifecycle] POST Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to create session', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/session — List sessions (with optional filters)
 */
export async function GET(req: NextRequest) {
  // Initialize Firestore lazily — return 503 if not configured
  const db = getDb();
  if (!db) {
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again later.',
    }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as SessionStatus | null;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const limitClamped = Math.min(Math.max(1, limit), 100);

    let query: FirebaseFirestore.Query = db.collection('phase5_sessions');
    
    if (status && ['pending', 'active', 'ended', 'flagged'].includes(status)) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('createdAt', 'desc').limit(limitClamped);

    let sessions: Phase5Session[] = [];
    try {
      const snapshot = await query.get();
      sessions = snapshot.docs.map(doc => doc.data() as Phase5Session);
    } catch (err) {
      console.warn('[SessionLifecycle] Could not query sessions:', err);
      // Return empty list rather than error if DB unavailable
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionLifecycle] GET Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to list sessions', details: errorMessage },
      { status: 500 }
    );
  }
}
