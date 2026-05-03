import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const palettes = ['coastal', 'sunrise', 'forest'] as const;

function makeAvatar(seed: string) {
  const first = seed.charCodeAt(0) || 1;
  const second = seed.charCodeAt(1) || 2;

  return {
    style: (first % 12) + 1,
    palette: palettes[second % palettes.length] || 'coastal',
    gesture: 'idle',
    locked: true,
  };
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = await verifyFirebaseIdToken(token);

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('[LiveKitAPI] MISSING CREDENTIALS', { apiKey: !!apiKey, apiSecret: !!apiSecret });
      return NextResponse.json({ 
        error: 'LiveKit credentials missing from server environment',
        details: 'Check .env.local for LIVEKIT_API_KEY and LIVEKIT_API_SECRET'
      }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const roomName = body.sessionId || 'general-sanctuary';
    const anonymousIdentity = `anon-${crypto.randomUUID().split('-')[0]}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    console.log(`[LiveKitAPI] Issuing token for room: ${roomName}, identity: ${anonymousIdentity}`);

    const at = new AccessToken(apiKey, apiSecret, {
      identity: anonymousIdentity,
      ttl: '1h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const tokenJwt = await at.toJwt();

    return NextResponse.json({
      token: tokenJwt,
      roomName,
      anonymousIdentity,
      avatar: makeAvatar(anonymousIdentity),
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('[LiveKitAPI] CRITICAL Error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: 'LiveKit token generation failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
