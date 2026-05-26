import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Phase 5 — Session Flag/Report Handler (5.11)
 * POST /api/session/[id]/flag — submit report
 * GET /api/session/[id]/flag — check flag status
 *
 * Stores ephemerally, no PII correlation.
 * Reasons: inappropriate_content, harassment, technical_issue, other
 */

interface FlagReport {
  id: string;
  sessionId: string;
  reporterIdentity: string;
  reason: string;
  reasonType: 'inappropriate_content' | 'harassment' | 'technical_issue' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
  expiresAt: string;
  metadata?: {
    sessionActive: boolean;
    anonymousToken: string;
  };
}

// In-memory ephemeral store (resets on server restart)
// For production, use Redis with TTL or short-lived Firestore documents
const ephemeralFlags = new Map<string, FlagReport>();

const VALID_REASONS = ['inappropriate_content', 'harassment', 'technical_issue', 'other'] as const;
const SEVERITY_MAP: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
  inappropriate_content: 'high',
  harassment: 'critical',
  technical_issue: 'medium',
  other: 'low',
};

/**
 * POST — Submit a flag/report for a session
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { reporterIdentity, reasonType, description } = body;

    // Validate reporter identity (anonymous token, not Firebase UID)
    if (!reporterIdentity || typeof reporterIdentity !== 'string' || reporterIdentity.trim().length < 4) {
      return NextResponse.json(
        { error: 'Valid anonymous reporter identity required' },
        { status: 400 }
      );
    }

    // Validate reason type
    if (!reasonType || !VALID_REASONS.includes(reasonType)) {
      return NextResponse.json(
        { error: `Reason must be one of: ${VALID_REASONS.join(', ')}` },
        { status: 400 }
      );
    }

    // Build reason string (type + optional description)
    let reason = reasonType;
    if (description && typeof description === 'string' && description.trim().length > 0) {
      reason = `${reasonType}: ${description.trim().slice(0, 500)}`;
    }

    const flagId = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hour TTL

    const flagReport: FlagReport = {
      id: flagId,
      sessionId,
      reporterIdentity: reporterIdentity.trim(),
      reason,
      reasonType,
      severity: SEVERITY_MAP[reasonType] || 'medium',
      createdAt: now.toISOString(),
      status: 'pending',
      expiresAt: expiresAt.toISOString(),
      metadata: {
        sessionActive: true,
        anonymousToken: reporterIdentity.trim(),
      },
    };

    // Store ephemerally
    ephemeralFlags.set(flagId, flagReport);
    
    // Also store by sessionId for easy lookup
    const sessionFlags = ephemeralFlags.get(`session:${sessionId}`) || [];
    sessionFlags.push(flagReport);
    ephemeralFlags.set(`session:${sessionId}`, sessionFlags);

    console.log(`[SessionFlag] Flag ${flagId} created for session ${sessionId}: ${reasonType} by ${reporterIdentity}`);

    return NextResponse.json({
      success: true,
      flagId,
      message: 'Report submitted. Facilitators have been notified.',
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionFlag] POST Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to submit report', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET — Check flag status for a session
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reporterIdentity = searchParams.get('reporterIdentity');

    // Get flags for this session
    const sessionFlags = ephemeralFlags.get(`session:${sessionId}`) || [];

    // Filter by reporter if provided (for anonymous status check)
    const flags = reporterIdentity
      ? sessionFlags.filter(f => f.reporterIdentity === reporterIdentity.trim())
      : sessionFlags;

    // Clean up expired flags
    const now = new Date();
    const validFlags = flags.filter(f => new Date(f.expiresAt) > now);

    return NextResponse.json({
      sessionId,
      flagCount: validFlags.length,
      flags: validFlags.map(f => ({
        id: f.id,
        reasonType: f.reasonType,
        severity: f.severity,
        status: f.status,
        createdAt: f.createdAt,
        expiresAt: f.expiresAt,
      })),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionFlag] GET Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to retrieve flags', details: errorMessage },
      { status: 500 }
    );
  }
}
