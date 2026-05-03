import { NextRequest, NextResponse } from 'next/server';
import { RoomServiceClient, DataPacket_Kind } from 'livekit-server-sdk';
import { safetyPrisma, sessionPrisma } from '@/lib/prisma';

const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';
const host = process.env.LIVEKIT_URL || 'https://hips-hsss.livekit.cloud';

// LiveKit server SDK needs an HTTP/HTTPS URL, not wss://
const livekitHost = host.replace('wss://', 'https://');
const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Security: Verify the webhook secret
    if (token !== process.env.WEBHOOK_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, offenderId, assessment, alertId, mitigationAction } = await req.json();

    console.warn(`[SafetyMitigation] ALERT in session ${sessionId}: ${assessment.category} (${assessment.severity}) -> Action: ${mitigationAction}`);

    // 1. Broadcast Safety Signal to all participants in the room
    const encoder = new TextEncoder();
    const signalData = encoder.encode(JSON.stringify({
      type: 'SAFETY_EVENT',
      payload: {
        category: assessment.category,
        severity: assessment.severity,
        reason: assessment.reason,
        action: mitigationAction
      }
    }));

    try {
      // Only send the signal to the offending participant to avoid confusing others
      await roomService.sendData(sessionId, signalData, DataPacket_Kind.RELIABLE, [offenderId]);
    } catch (err) {
      console.error('[SafetyMitigation] Failed to send targeted signal:', err);
    }

    // 2. Automated Intervention Logic
    let success = true;
    let actionTaken = mitigationAction || 'SIGNAL_ONLY';

    if (mitigationAction === 'KICK') {
      try {
        await roomService.removeParticipant(sessionId, offenderId);
        console.log(`[SafetyMitigation] Kicked participant ${offenderId} from room ${sessionId}.`);
      } catch (err) {
        console.error('[SafetyMitigation] Failed to kick participant:', err);
        success = false;
      }
    } else if (mitigationAction === 'MUTE') {
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

    // 3. Record Mitigation in Safety DB
    try {
      await safetyPrisma.safetyMitigation.create({
        data: {
          alertId,
          action: actionTaken,
          success,
          metadata: { offenderId }
        }
      });
    } catch (err) {
      console.error('[SafetyMitigation] Failed to record mitigation in safety DB:', err);
    }

    // 4. Record Audit Event in Session DB
    try {
      await sessionPrisma.auditEvent.create({
        data: {
          eventType: 'SAFETY_MITIGATION',
          subjectId: sessionId,
          metadata: {
            offenderId,
            action: actionTaken,
            category: assessment.category,
            severity: assessment.severity,
            success
          }
        }
      });
    } catch (err) {
      console.error('[SafetyMitigation] Failed to record audit event in session DB:', err);
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('[SafetyMitigation] Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
