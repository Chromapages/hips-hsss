import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { logger } from '@/lib/logger';
import { Phase5SessionSchema } from '@/lib/schemas/session';

export const dynamic = 'force-dynamic';

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
const ephemeralFlags = new Map<string, FlagReport | FlagReport[]>();

const VALID_REASONS = ['inappropriate_content', 'harassment', 'technical_issue', 'other'] as const;
const SEVERITY_MAP: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
  inappropriate_content: 'high',
  harassment: 'critical',
  technical_issue: 'medium',
  other: 'low',
};

const flagPostSchema = z.object({
  reporterIdentity: z.string().min(4).max(128),
  reasonType: z.enum(VALID_REASONS),
  description: z.string().max(500).optional(),
});

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
    const parsed = flagPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { reporterIdentity, reasonType, description } = parsed.data;

    // Verify session existence and membership in Firestore
    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const sessionDoc = await db.collection('phase5_sessions').doc(sessionId).get();
    if (!sessionDoc.exists) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const sessionParsed = Phase5SessionSchema.safeParse({ id: sessionDoc.id, ...sessionDoc.data() });
    if (!sessionParsed.success) {
      return NextResponse.json({ error: 'Invalid session data structure' }, { status: 422 });
    }

    const sessionData = sessionParsed.data;
    const isMember =
      sessionData.facilitatorId === reporterIdentity ||
      sessionData.metadata?.facilitatorId === reporterIdentity ||
      (Array.isArray(sessionData.participantIdentities) &&
        sessionData.participantIdentities.includes(reporterIdentity));

    if (!isMember) {
      return NextResponse.json(
        { error: 'Forbidden: you are not a member of this session' },
        { status: 403 }
      );
    }

    // Build reason string (type + optional description)
    let reason: string = reasonType;
    if (description && description.trim().length > 0) {
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
    
    // Store by sessionId for easy lookup
    const existing = ephemeralFlags.get(`session:${sessionId}`);
    const sessionFlags: FlagReport[] = Array.isArray(existing) ? existing : [];
    sessionFlags.push(flagReport);
    ephemeralFlags.set(`session:${sessionId}`, sessionFlags);

    logger.info('[SessionFlag] Flag created', {
      flagId,
      sessionId,
      reasonType,
      reporterIdentitySuffix: reporterIdentity.slice(-6),
    });

    return NextResponse.json({
      success: true,
      flagId,
      message: 'Report submitted. Facilitators have been notified.',
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('[SessionFlag] POST Error', { error: errorMessage });
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
    const rawSessionFlags = ephemeralFlags.get(`session:${sessionId}`);
    const sessionFlags: FlagReport[] = Array.isArray(rawSessionFlags) ? rawSessionFlags : [];

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
    logger.error('[SessionFlag] GET Error', { error: errorMessage });
    return NextResponse.json(
      { error: 'Failed to retrieve flags', details: errorMessage },
      { status: 500 }
    );
  }
}
