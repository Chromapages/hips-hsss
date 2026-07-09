import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createVoiceWorkerStreamToken } from '@/lib/voice-worker-token';

const tokenRequestSchema = z.object({
  sessionId: z.string().trim().min(1).max(160),
  participantIdentity: z.string().trim().min(1).max(160),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = tokenRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  try {
    const result = await createVoiceWorkerStreamToken(parsed.data);
    return NextResponse.json({
      token: result.token,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    return NextResponse.json({
      error: 'voice_worker_token_unavailable',
      message: error instanceof Error ? error.message : 'Voice worker token could not be issued.',
    }, { status: 503 });
  }
}
