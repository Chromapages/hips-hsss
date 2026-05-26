import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const SAFETY_ENGINE_URL = process.env.SAFETY_ENGINE_URL || 'http://localhost:3003';
const SESSION_SERVICE_SECRET = process.env.SESSION_SERVICE_SECRET;

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
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
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Safety Flag Proxy Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
