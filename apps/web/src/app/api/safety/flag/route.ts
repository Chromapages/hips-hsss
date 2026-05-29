import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const SAFETY_ENGINE_URL = process.env.SAFETY_ENGINE_URL || 'http://localhost:3003';
const SESSION_SERVICE_SECRET = process.env.SESSION_SERVICE_SECRET;

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

export async function POST(req: NextRequest) {
  try {
    // 1. Idempotency check — must be first to avoid duplicate work
    const idempotencyKey = req.headers.get('X-Idempotency-Key');
    if (idempotencyKey) {
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

    // Validate input before proxying
    if (!body.sessionId || !body.reporterId || !body.level || !body.reason) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    if (!['HIGH', 'CRITICAL'].includes(body.level)) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }

    const response = await fetch(`${SAFETY_ENGINE_URL}/safety/flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SESSION_SERVICE_SECRET}`,
      },
      body: JSON.stringify(body),
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
