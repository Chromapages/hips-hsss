import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { z } from 'zod';

const SAFETY_ENGINE_URL = process.env.SAFETY_ENGINE_URL || 'http://localhost:3003';
const SESSION_SERVICE_SECRET = process.env.SESSION_SERVICE_SECRET;

const SafetyIngestSchema = z.object({
  sessionId: z.string().min(1).max(64),
  text: z.string().min(1).max(10000),
  participantId: z.string().min(1).max(64),
});

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

    const response = await fetch(`${SAFETY_ENGINE_URL}/safety/transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SESSION_SERVICE_SECRET}`,
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
