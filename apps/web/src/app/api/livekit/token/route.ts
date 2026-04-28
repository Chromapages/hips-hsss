import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { roomName, participantIdentity } = await req.json();

    if (!roomName) {
      return NextResponse.json({ error: 'Missing roomName' }, { status: 400 });
    }

    // In a real implementation, we would validate the "Opaque Session Token" here 
    // against the Session Service before issuing the LiveKit token.
    // For this MVP prototype, we'll generate the LiveKit token using environment variables.
    const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';

    // HARD ANONYMITY: Session Token Hashing
    // The client provides an "opaque session token" (currently passed as roomName).
    // We must NEVER use this token directly as the LiveKit room name or Session DB ID,
    // as it would allow an attacker to link the Commerce DB to the Session DB.
    // Instead, we derive a one-way hash to use as the actual Session ID.
    const sessionSecret = process.env.SESSION_HMAC_SECRET || 'fallback-dev-secret-do-not-use-in-prod';
    const hashedSessionId = crypto
      .createHmac('sha256', sessionSecret)
      .update(roomName)
      .digest('hex');

    // Generate an anonymous identity server-side (Hard Anonymity)
    // We ignore any participantIdentity provided by the client to prevent ID-leakage.
    const identity = crypto.randomUUID();

    const at = new AccessToken(apiKey, apiSecret, {
      identity: identity,
      ttl: '1h',
    });

    at.addGrant({
      roomJoin: true,
      room: hashedSessionId, // Use the hashed ID, NOT the raw token
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({ token: await at.toJwt(), identity, hashedSessionId });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
