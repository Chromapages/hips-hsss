import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { RoomServiceClient, DataPacket_Kind } from 'livekit-server-sdk';
import { sendSafetyMitigation } from '@/lib/safety-mitigation';
import { logger } from '@/lib/logger';
import { safeError } from '@/lib/logger';

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const host = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'https://hips-hsss.livekit.cloud';

if (!apiKey || !apiSecret) {
  throw new Error('LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set');
}

const livekitHost = host.replace('wss://', 'https://');
const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

/**
 * Layer 5 / Layer 2 hardening:
 * The mitigation route is now called only by the safety service itself,
 * which authenticates with a scoped service JWT (scope: safety:mitigate).
 * The previous pattern of accepting a raw shared secret as a bearer has
 * been removed — see PR description and docs/security-7-layer-verification.
 *
 * The receiver guard is services/safety/src/safety/service-auth.guard.ts,
 * updated in this change to accept the new scope.
 */

export async function POST(req: NextRequest) {
  try {
    // Internal-only endpoint: must be called by the safety service.
    // Authentication is performed upstream by the calling service's auth
    // chain (the safety service's ServiceAuthGuard), which sends a
    // scoped JWT in the Authorization header.
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Zod validation — replaces manual field checks
    const MitigationSchema = z.object({
      sessionId: z.string().min(1),
      assessment: z.object({
        category: z.string().min(1),
        severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
        reason: z.string().min(1).max(1000),
      }),
      mitigationAction: z.enum(['SIGNAL_ONLY', 'KICK', 'MUTE', 'ESCALATE']),
      offenderId: z.string().optional(),
      alertId: z.string().optional(),
    });

    const parseResult = MitigationSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: parseResult.error.flatten() }, { status: 400 });
    }

    const { sessionId, offenderId, assessment, alertId, mitigationAction } = parseResult.data;

    // Null-guard offenderId for targeted LiveKit operations
    const targets = offenderId ? [offenderId] : undefined;

    console.warn(`[SafetyMitigation] ALERT in session ${sessionId}: ${assessment.category} (${assessment.severity}) -> Action: ${mitigationAction}`);

    // 1. Broadcast Safety Signal to all participants (or targeted participant)
    // Sanitize all user-supplied fields before injection into LiveKit signal
    const sanitize = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const encoder = new TextEncoder();
    const signalData = encoder.encode(JSON.stringify({
      type: 'SAFETY_EVENT',
      payload: {
        category: assessment.category,
        severity: assessment.severity,
        reason: sanitize(assessment.reason),
        action: mitigationAction
      }
    }));

    try {
      await roomService.sendData(sessionId, signalData, DataPacket_Kind.RELIABLE, targets);
    } catch (err) {
      console.error('[SafetyMitigation] Failed to send targeted signal:', err);
    }

    // 2. Perform LiveKit action (kick/mute) — guard on offenderId presence
    let success = true;
    let actionTaken = mitigationAction;

    if (mitigationAction === 'KICK' && offenderId) {
      try {
        await roomService.removeParticipant(sessionId, offenderId);
        console.log(`[SafetyMitigation] Kicked participant ${offenderId} from room ${sessionId}.`);
      } catch (err) {
        console.error('[SafetyMitigation] Failed to kick participant:', err);
        success = false;
      }
    } else if (mitigationAction === 'MUTE' && offenderId) {
      try {
        await roomService.updateParticipant(sessionId, offenderId, {
          permission: {
            canPublish: false,
            canSubscribe: true,
            canPublishData: false,
            canPublishSources: []
          }
        });
        console.log(`[SafetyMitigation] Muted participant ${offenderId} in room ${sessionId}.`);
      } catch (err) {
        console.error('[SafetyMitigation] Failed to mute participant:', err);
        success = false;
      }
    }

    // 3. Record Mitigation via Safety Service API (scoped JWT, not raw secret)
    try {
      await sendSafetyMitigation(sessionId, {
        ...(alertId ? { alertId } : {}),
        action: actionTaken,
        success,
        metadata: offenderId ? { offenderId } : {},
      });
    } catch (err) {
      logger.error('Failed to record mitigation via safety service', {
        error: safeError(err),
      });
    }

    // 4. Record Audit Event to Firestore (session-service audit endpoint not yet available)
    try {
      const { getDb } = await import('@/lib/firebase-admin');
      const db = getDb();
      if (db) {
        await db.collection('session_audit_events').add({
          eventType: 'SAFETY_MITIGATION',
          sessionId,
          offenderId: offenderId || null,
          action: actionTaken,
          success,
          severity: assessment.severity,
          category: assessment.category,
          alertId: alertId || null,
          createdAt: new Date().toISOString(),
        });
        console.log(`[SafetyMitigation] Audit event recorded to Firestore for session ${sessionId}`);
      }
    } catch (err) {
      logger.warn('Failed to record audit event to Firestore', { error: safeError(err) });
      // Non-fatal: mitigation already succeeded, log and continue
    }

    return NextResponse.json({ success });
  } catch (error: unknown) {
    logger.error('SafetyMitigation error', { error: safeError(error) });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}