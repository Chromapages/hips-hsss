import { NextRequest, NextResponse } from 'next/server';
import { RoomServiceClient, DataPacket_Kind } from 'livekit-server-sdk';

const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';
const host = process.env.LIVEKIT_URL || 'https://hips-hsss.livekit.cloud';

const livekitHost = host.replace('wss://', 'https://');
const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

const SAFETY_SERVICE_URL = process.env.SAFETY_SERVICE_URL || 'http://localhost:3003';
const SESSION_SERVICE_SECRET = process.env.SESSION_SERVICE_SECRET;

async function callSafetyService(endpoint: string, method: string, body?: unknown) {
  const response = await fetch(`${SAFETY_SERVICE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SESSION_SERVICE_SECRET}`,
    },
    body: body != null ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error(`Safety service error: ${response.status}`);
  }

  return response.json();
}

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
      await roomService.sendData(sessionId, signalData, DataPacket_Kind.RELIABLE, [offenderId]);
    } catch (err) {
      console.error('[SafetyMitigation] Failed to send targeted signal:', err);
    }

    // 2. Perform LiveKit action (kick/mute) - this is correctly here
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

    // 3. Record Mitigation via Safety Service API (not direct DB access)
    try {
      await callSafetyService(`/safety/mitigations`, 'POST', {
        alertId,
        action: actionTaken,
        success,
        metadata: { offenderId }
      });
    } catch (err) {
      console.error('[SafetyMitigation] Failed to record mitigation via safety service:', err);
    }

    // 4. Record Audit Event (session DB) - TODO: add /session/audit endpoint to session-service
    // Currently logs only since session-service doesn't expose an audit endpoint
    console.log(`[SafetyMitigation] Audit: SAFETY_MITIGATION event for session ${sessionId}, offender ${offenderId}, action ${actionTaken}`);

    return NextResponse.json({ success });
  } catch (error) {
    console.error('[SafetyMitigation] Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}