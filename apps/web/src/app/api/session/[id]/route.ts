import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase-admin';

/**
 * Phase 5 — Session Lifecycle Manager: Session Operations (5.3)
 * Handles get, update, and delete operations for individual sessions.
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
    [key: string]: unknown;
  };
}

const updateSessionSchema = z.object({
  status: z.enum(['active', 'ended', 'flagged']).optional(),
  action: z.enum(['join', 'leave', 'flag', 'end']).optional(),
  participantCount: z.number().int().min(0).optional(),
  flaggedBy: z.string().optional(),
  flaggedReason: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Valid state transitions
const VALID_TRANSITIONS: Record<SessionStatus, SessionStatus[]> = {
  'pending': ['active'],
  'active': ['ended', 'flagged'],
  'ended': [],
  'flagged': ['ended'],
};

// Helper to get session document reference
function getSessionRef(sessionId: string) {
  return db.collection('phase5_sessions').doc(sessionId);
}

// Helper to get session with error handling
async function getSession(sessionId: string): Promise<Phase5Session | null> {
  try {
    const doc = await getSessionRef(sessionId).get();
    if (!doc.exists) return null;
    return doc.data() as Phase5Session;
  } catch (err) {
    console.warn('[SessionOps] Could not read session:', err);
    return null;
  }
}

/**
 * GET /api/session/[id] — Get session details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = await getSession(id);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        createdAt: session.createdAt,
        activeAt: session.activeAt,
        endedAt: session.endedAt,
        participantCount: session.participantCount,
        maxParticipants: session.maxParticipants,
        roomName: session.roomName,
        flagged: session.flagged,
        flaggedAt: session.flaggedAt,
        metadata: session.metadata,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionOps] GET Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to get session', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/session/[id] — Update session (state transitions, participant count)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const result = updateSessionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const { status: newStatus, action, participantCount, flaggedBy, flaggedReason, metadata } = result.data;

    // Get current session state
    const session = await getSession(id);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Determine final status
    let finalStatus = session.status;
    const now = new Date().toISOString();
    const updateData: Partial<Phase5Session> = {};

    // Handle action-based transitions
    if (action) {
      switch (action) {
        case 'join':
          if (session.status === 'pending') {
            finalStatus = 'active';
            updateData.activeAt = now;
          }
          if (participantCount !== undefined) {
            updateData.participantCount = Math.min(participantCount, session.maxParticipants);
          } else {
            updateData.participantCount = Math.min(session.participantCount + 1, session.maxParticipants);
          }
          break;
        case 'leave':
          if (participantCount !== undefined) {
            updateData.participantCount = Math.max(0, participantCount);
          } else {
            updateData.participantCount = Math.max(0, session.participantCount - 1);
          }
          // Auto-end if last participant leaves
          if (updateData.participantCount === 0 && session.status === 'active') {
            finalStatus = 'ended';
            updateData.endedAt = now;
          }
          break;
        case 'flag':
          if (session.status === 'active') {
            finalStatus = 'flagged';
            updateData.flagged = true;
            updateData.flaggedBy = flaggedBy;
            updateData.flaggedReason = flaggedReason;
            updateData.flaggedAt = now;
          }
          break;
        case 'end':
          if (['pending', 'active', 'flagged'].includes(session.status)) {
            finalStatus = 'ended';
            updateData.endedAt = now;
          }
          break;
      }
    }

    // Handle direct status transition
    if (newStatus) {
      const allowedTransitions = VALID_TRANSITIONS[session.status];
      if (!allowedTransitions.includes(newStatus)) {
        return NextResponse.json({
          error: `Invalid status transition: ${session.status} → ${newStatus}`,
          allowedTransitions,
        }, { status: 400 });
      }
      finalStatus = newStatus;
      if (newStatus === 'active' && !updateData.activeAt) {
        updateData.activeAt = now;
      } else if (newStatus === 'ended' && !updateData.endedAt) {
        updateData.endedAt = now;
      } else if (newStatus === 'flagged') {
        updateData.flagged = true;
        updateData.flaggedBy = flaggedBy;
        updateData.flaggedReason = flaggedReason;
        updateData.flaggedAt = now;
      }
    }

    // Apply metadata updates
    if (metadata) {
      updateData.metadata = { ...session.metadata, ...metadata };
    }

    updateData.status = finalStatus;

    // Persist changes
    try {
      await getSessionRef(id).update(updateData);
      console.log(`[SessionOps] Updated session ${id}: ${session.status} → ${finalStatus}`);
    } catch (err) {
      console.error('[SessionOps] Update failed:', err);
      return NextResponse.json(
        { error: 'Failed to update session', details: 'Database unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id,
        status: finalStatus,
        previousStatus: session.status,
        participantCount: updateData.participantCount ?? session.participantCount,
        updatedAt: now,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionOps] PATCH Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to update session', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/session/[id] — End session
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get current session state
    const session = await getSession(id);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Can only delete active sessions
    if (session.status === 'ended') {
      return NextResponse.json({
        error: 'Session already ended',
        session: { id, status: session.status }
      }, { status: 409 });
    }

    const now = new Date().toISOString();

    // Transition to ended
    try {
      await getSessionRef(id).update({
        status: 'ended',
        endedAt: now,
      });
      console.log(`[SessionOps] Ended session ${id}`);
    } catch (err) {
      console.error('[SessionOps] Delete failed:', err);
      return NextResponse.json(
        { error: 'Failed to end session', details: 'Database unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id,
        status: 'ended',
        endedAt: now,
        previousStatus: session.status,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionOps] DELETE Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to end session', details: errorMessage },
      { status: 500 }
    );
  }
}
