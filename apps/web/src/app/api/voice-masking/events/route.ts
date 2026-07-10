import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const voiceMaskingEventSchema = z.object({
  name: z.enum([
    'voice_masking.raw_publish_blocked',
    'voice_masking.fallback_triggered',
  ]),
  mode: z.enum(['dsp', 'neural']),
  reason: z.string().trim().min(1).max(240),
  sessionId: z.string().trim().min(1).max(160).optional(),
  participantIdentity: z.string().trim().min(1).max(160).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = voiceMaskingEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const event = parsed.data;
  const meta = {
    mode: event.mode,
    reason: event.reason,
    sessionId: event.sessionId,
    participantIdentity: event.participantIdentity,
  };

  if (event.name === 'voice_masking.raw_publish_blocked') {
    logger.error('[VoiceMasking] raw publish blocked', meta);
  } else {
    logger.warn('[VoiceMasking] fallback triggered', meta);
  }

  return NextResponse.json({ ok: true });
}
