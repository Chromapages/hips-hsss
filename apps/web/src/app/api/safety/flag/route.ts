import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseIdToken } from '@/lib/firebase-auth';
import { db } from '@/lib/firebase-admin';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { createServiceToken, SCOPES, AUDIENCES } from '@/lib/auth/serviceToken';
import { z } from 'zod';
import { Phase5SessionSchema } from '@/lib/schemas/session';

const SAFETY_ENGINE_URL = process.env.SAFETY_ENGINE_URL || 'http://localhost:3003';

// In-memory idempotency store: key → { response, timestamp }
// TTL: 60 seconds
const idempotencyStore = new Map<string, { response: unknown; timestamp: number }>();
const IDEMPOTENCY_TTL_MS = 60_000;

// Periodic cleanup of expired keys
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of idempotencyStore.entries()) {
    if (now - entry.timestamp > IDEMPOTENCY_TTL_MS) idempotencyStore.delete(key);
  }
}, 30_000);

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
    // 1. Idempotency check — must be first to avoid duplicate work
    const idempotencyKey = req.headers.get('X-Idempotency-Key');
    if (idempotencyKey) {
      // Validate idempotency key format: max 128 chars, alphanumeric with dashes only
      if (typeof idempotencyKey !== 'string' || idempotencyKey.length > 128 || !/^[a-zA-Z0-9-]+$/.test(idempotencyKey)) {
        return NextResponse.json(
          { error: 'Invalid X-Idempotency-Key header: must be alphanumeric with dashes, max 128 chars' },
          { status: 400 }
        );
      }
      const cached = idempotencyStore.get(idempotencyKey);
      if (cached && Date.now() - cached.timestamp < IDEMPOTENCY_TTL_MS) {
        return NextResponse.json(cached.response, { status: 200 });
      }
    }

    // 2. Verify Authentication
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

    // Validate input with Zod schema
    const levelSchema = z.enum(['HIGH', 'CRITICAL']);
    const parsedLevel = levelSchema.safeParse(body.level);
    if (!body.sessionId || !body.reporterId || !body.reason || !parsedLevel.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Rate limit: 20 flag submissions per minute per authenticated user
    const rateLimitResult = checkRateLimit(firebaseUid, 20, 60_000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please slow down.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.resetAt, rateLimitResult.remaining, 20) }
      );
    }

    // Verify the caller is a member of this session
    if (!await isSessionMember(firebaseUid, body.sessionId)) {
      return NextResponse.json(
        { error: 'Forbidden: you are not a member of this session' },
        { status: 403 }
      );
    }

    const serviceToken = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, {
      subject: 'hips-web',
      ref: body.sessionId,
    });

    const response = await fetch(`${SAFETY_ENGINE_URL}/safety/flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
      },
      body: JSON.stringify({
        ...body,
        level: parsedLevel.data, // use validated enum value
      }),
    });

    if (!response.ok) {
      throw new Error(`Safety engine responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 3. Cache successful response for idempotent replay
    if (idempotencyKey) {
      idempotencyStore.set(idempotencyKey, {
        response: data,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Safety Flag Proxy Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
