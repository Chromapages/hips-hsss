import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseIdToken } from '@/lib/firebase-auth';
import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { createServiceToken, SCOPES, AUDIENCES } from '@/lib/auth/serviceToken';
import { Phase5SessionSchema } from '@/lib/schemas/session';

const SAFETY_ENGINE_URL = process.env.SAFETY_ENGINE_URL || 'http://localhost:3003';

const SafetyIngestSchema = z.object({
  sessionId: z.string().min(1).max(64),
  text: z.string().min(1).max(10000),
  participantId: z.string().min(1).max(64),
});

async function isSessionMember(firebaseUid: string, sessionId: string): Promise<boolean> {
  try {
    const sessionDoc = await db.collection('phase5_sessions').doc(sessionId).get();
    if (!sessionDoc.exists) return false;
    const parsed = Phase5SessionSchema.safeParse({ id: sessionDoc.id, ...sessionDoc.data() });
    if (!parsed.success) return false;
    const data = parsed.data;
    return (
      data.facilitatorId === firebaseUid ||
      data.metadata?.facilitatorId === firebaseUid ||
      (Array.isArray(data.participantIdentities) &&
        data.participantIdentities.includes(firebaseUid))
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyFirebaseIdToken(token);
    const firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const parseResult = SafetyIngestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { sessionId, text, participantId } = parseResult.data;

    // Rate limit: 60 transcripts per minute per authenticated user
    const rateLimitResult = checkRateLimit(firebaseUid, 60, 60_000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please slow down transcript submissions.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.resetAt, rateLimitResult.remaining, 60) }
      );
    }

    // Verify the caller is a member of this session
    if (!await isSessionMember(firebaseUid, sessionId)) {
      return NextResponse.json(
        { error: 'Forbidden: you are not a member of this session' },
        { status: 403 }
      );
    }

    const serviceToken = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, {
      subject: 'hips-web',
      ref: sessionId,
    });

    const response = await fetch(`${SAFETY_ENGINE_URL}/safety/transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
      },
      body: JSON.stringify({ sessionId, text, participantId }),
    });

    if (!response.ok) {
      throw new Error(`Safety engine responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Safety Ingest Proxy Error:', message);
    // Return proper HTTP 500 — do NOT return 200 with fake status
    return NextResponse.json({ error: 'Safety service temporarily unavailable', details: message }, { status: 503 });
  }
}
