import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authorizeSessionAccess } from '@/lib/session-authz';
import { dispatchVoiceMaskingAgent } from '@/lib/voice-masking-agent';

const dispatchSchema = z.object({
  sessionId: z.string().min(1).max(128),
  participantIdentity: z.string().min(1).max(128),
  persona: z.enum(['clara', 'arthur']).optional(),
  antiCadence: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = dispatchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid voice masking dispatch request' }, { status: 400 });
  }

  const principal = await authorizeSessionAccess(parsed.data.sessionId, req.headers.get('authorization'));
  if (!principal) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const roomName = `session-${parsed.data.sessionId}`;

  try {
    const result = await dispatchVoiceMaskingAgent({
      sessionId: parsed.data.sessionId,
      roomName,
      participantIdentity: parsed.data.participantIdentity,
      ...(parsed.data.persona ? { persona: parsed.data.persona } : {}),
      ...(typeof parsed.data.antiCadence === 'boolean' ? { antiCadence: parsed.data.antiCadence } : {}),
    });

    return NextResponse.json(result, { status: result.dispatched ? 201 : 202 });
  } catch (error) {
    console.error('[VoiceMaskingAgent] Dispatch failed:', error);
    return NextResponse.json({ error: 'Voice masking agent dispatch failed' }, { status: 500 });
  }
}
