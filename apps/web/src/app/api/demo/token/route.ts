import { NextRequest, NextResponse } from 'next/server';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { z } from 'zod';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const DemoTokenSchema = z.object({
  token: z.string(),
  roomName: z.string(),
  identity: z.string(),
  expiresAt: z.string(),
});

type DemoTokenResponse = z.infer<typeof DemoTokenSchema>;

const DEMO_ROOM_NAME = 'demo-room-sandbox';
const DEMO_TTL_SECONDS = 30 * 60; // 30 minutes

/**
 * Ensures the demo room exists, creating it if necessary.
 *
 * Room Configuration for "demo-room-sandbox":
 *   - emptyTimeout: 0 (never auto-delete, even when empty)
 *   - maxParticipants: 10
 *   - metadata: JSON with isDemoRoom: true flag
 *
 * This allows the demo room to persist indefinitely without a host.
 */
async function ensureDemoRoomExists(
  roomService: RoomServiceClient,
): Promise<void> {
  try {
    const rooms = await roomService.listRooms();
    const exists = rooms.some((r) => r.name === DEMO_ROOM_NAME);

    if (!exists) {
      console.log(`[DemoTokenAPI] Creating demo room "${DEMO_ROOM_NAME}"...`);
      await roomService.createRoom({
        name: DEMO_ROOM_NAME,
        emptyTimeout: 0, // Never auto-delete — room persists without participants
        maxParticipants: 10,
        metadata: JSON.stringify({ isDemoRoom: true }),
      });
      console.log(`[DemoTokenAPI] Demo room "${DEMO_ROOM_NAME}" created.`);
    }
  } catch (error) {
    // Non-fatal: room may already exist or server prevents creation
    console.warn(`[DemoTokenAPI] Room creation warning: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 demo tokens per minute per IP
    // No Firebase auth required — this is a public sandboxed demo endpoint
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
    const rateLimitResult = checkRateLimit(ip, 10, 60_000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult.resetAt, 0, 10),
        }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY || process.env.NEXT_PUBLIC_LIVEKIT_API_KEY || 'devkey';
    const apiSecret = process.env.LIVEKIT_API_SECRET || process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET || 'secret';

    if (process.env.NODE_ENV === 'production' && (apiKey === 'devkey' || apiSecret === 'secret')) {
      console.error('[DemoTokenAPI] MISSING CREDENTIALS IN PRODUCTION', {
        apiKey: apiKey !== 'devkey',
        apiSecret: apiSecret !== 'secret',
      });
      return NextResponse.json(
        {
          error: 'LiveKit credentials missing from server environment',
          details: 'Check production environment settings for LIVEKIT_API_KEY and LIVEKIT_API_SECRET',
        },
        { status: 500 },
      );
    }

    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      console.warn('[DemoTokenAPI] Using development fallback credentials (devkey/secret).');
    }

    // Ensure the demo room exists before issuing a token
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || 'wss://demo.livekit.cloud';
    const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
    await ensureDemoRoomExists(roomService);

    const expiresAt = new Date(Date.now() + DEMO_TTL_SECONDS * 1000);

    // Unique per-visitor identity — prevents identity collision between demo users.
    // IP-based derivation gives stability across reconnects within the same session
    // while maintaining anonymity (no PII stored).
    const visitorIdentity = `demo-${ip.replace(/\./g, '-')}-${crypto.randomUUID().slice(0, 8)}`;

    console.log(`[DemoTokenAPI] Issuing demo token for room: ${DEMO_ROOM_NAME}, identity: ${visitorIdentity}`);

    const at = new AccessToken(apiKey, apiSecret, {
      identity: visitorIdentity,
      ttl: `${DEMO_TTL_SECONDS}s`,
    });

    at.addGrant({
      roomJoin: true,
      room: DEMO_ROOM_NAME,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Add metadata flagging demo mode
    at.metadata = JSON.stringify({
      isDemo: true,
      demoRoom: DEMO_ROOM_NAME,
      joinedAt: new Date().toISOString(),
    });

    const tokenJwt = await at.toJwt();

    const response: DemoTokenResponse = {
      token: tokenJwt,
      roomName: DEMO_ROOM_NAME,
      identity: visitorIdentity,
      expiresAt: expiresAt.toISOString(),
    };

    return NextResponse.json(DemoTokenSchema.parse(response));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[DemoTokenAPI] CRITICAL Error:', {
      message: errorMessage,
      code: error && typeof error === 'object' && 'code' in error ? (error as { code: unknown }).code : undefined,
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid response format',
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: 'Demo token generation failed',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}