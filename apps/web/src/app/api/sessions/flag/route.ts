import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { ROLES } from '@/lib/roles';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import crypto from 'crypto';

/**
 * Phase 5 — Session Flag/Report Handler (5.11)
 * Handles anonymous flagging within a session.
 * No Firebase UID — uses anonymous identity from session context.
 */

interface FlagReport {
  id: string;
  sessionId: string;
  reporterIdentity: string;
  reason: string;
  severity: 'HIGH' | 'CRITICAL';
  createdAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
  metadata?: {
    participantCount: number;
    sessionActive: boolean;
  };
}

export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  // Rate limit: 5 submissions per minute per IP
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
  const rateLimitResult = checkRateLimit(ip, 5, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many flag submissions. Please slow down.' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult.resetAt, 0, 5) }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));

    const { sessionId, reporterIdentity, reason, severity } = body;

    // Validate required fields
    if (!sessionId || !reporterIdentity || !reason || !severity) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, reporterIdentity, reason, severity' },
        { status: 400 }
      );
    }

    // Validate severity
    if (!['HIGH', 'CRITICAL'].includes(severity)) {
      return NextResponse.json(
        { error: 'Severity must be HIGH or CRITICAL' },
        { status: 400 }
      );
    }

    // Validate reason is not empty
    if (reason.trim().length < 10) {
      return NextResponse.json(
        { error: 'Reason must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Optional Firebase auth — if token provided, use Firebase UID as reporterIdentity
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    let firebaseUid: string | null = null;
    if (token) {
      try { firebaseUid = (await verifyFirebaseIdToken(token))?.sub ?? null; } catch { /* ignore */ }
    }
    const resolvedReporterIdentity = firebaseUid || reporterIdentity;

    // Get session context for metadata
    let sessionActive = false;
    let participantCount = 0;

    try {
      const sessionRef = db.collection('phase5_sessions').doc(sessionId);
      const sessionDoc = await sessionRef.get();

      if (sessionDoc.exists) {
        const sessionData = sessionDoc.data();
        sessionActive = sessionData?.status === 'active';
        participantCount = sessionData?.participantCount || 0;

        // Mark session as flagged
        await sessionRef.update({
          flagged: true,
          flaggedBy: resolvedReporterIdentity,
          flaggedReason: reason,
          flaggedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('[SessionFlag] Could not update session:', err);
    }

    // Create flag report
    const flagReport: FlagReport = {
      id: crypto.randomUUID(),
      sessionId,
      reporterIdentity: resolvedReporterIdentity,
      reason: reason.trim(),
      severity,
      createdAt: new Date().toISOString(),
      status: 'pending',
      metadata: {
        participantCount,
        sessionActive,
      },
    };

    // Store flag report
    try {
      await db.collection('session_flags').add(flagReport);
    } catch (err) {
      console.error('[SessionFlag] Failed to store flag:', err);
      return NextResponse.json(
        { error: 'Failed to record safety flag report in database.' },
        { status: 500 }
      );
    }

    console.log(`[SessionFlag] Flag created for session ${sessionId}: ${severity} by ${reporterIdentity}`);

    return NextResponse.json({
      success: true,
      flagId: flagReport.id,
      message: 'Report submitted. Facilitators have been notified.',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionFlag] Error:', errorMessage);
    return NextResponse.json(
      {
        error: 'Failed to submit report',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET — Retrieve flag status (for facilitators)
 */
export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  try {
    // Auth: require FACILITATOR or ADMIN role
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let payload;
    try {
      payload = await verifyFirebaseIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userDoc = await db.collection('users').doc(payload.uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Forbidden: User record not found' }, { status: 403 });
    }
    const userData = userDoc.data();
    const userRole = userData?.role || null;

    if (userRole !== ROLES.FACILITATOR && userRole !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    // Query flags for this session
    const flagsSnapshot = await db.collection('session_flags')
      .where('sessionId', '==', sessionId)
      .get();

    const flags = flagsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      sessionId,
      flagCount: flags.length,
      flags,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[SessionFlag] GET Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to retrieve flags' },
      { status: 500 }
    );
  }
}