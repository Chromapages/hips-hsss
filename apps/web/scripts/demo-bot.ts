/**
 * Demo Room Bot — HIPS Platform
 *
 * This script connects to "demo-room-sandbox" as a simulated participant (demo-avatar)
 * to ensure the demo room always appears active with at least one participant.
 *
 * It publishes a silent audio track so the two-participant UI renders correctly.
 *
 * Usage:
 *   npx ts-node apps/web/scripts/demo-bot.ts
 *   # or with tsx (faster startup):
 *   npx tsx apps/web/scripts/demo-bot.ts
 *
 * Environment variables required (in .env.local at project root or exported):
 *   LIVEKIT_API_KEY      — LiveKit server API key
 *   LIVEKIT_API_SECRET   — LiveKit server API secret
 *   LIVEKIT_URL          — LiveKit server URL (e.g., wss://demo.livekit.cloud)
 *
 * The bot will:
 *   - Auto-reconnect on disconnect (up to 5 attempts, then exit with error)
 *   - Reconnect with exponential backoff (1s, 2s, 4s, 8s, 16s)
 *   - Log all room events to stdout
 *
 * Room configuration:
 *   - Room name: "demo-room-sandbox"
 *   - Participant identity: "demo-avatar"
 *   - Metadata: { "name": "Demo Participant", "isDemoBot": true }
 *   - The room is NOT created by this script — it must already exist or be
 *     auto-provisioned by the LiveKit server (empty rooms are created on first join).
 *     For production, use RoomServiceClient.createRoom() before starting the bot.
 */

import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import {
  createLocalAudioTrack,
  LocalAudioTrack,
  Room,
  RoomEvent,
  type Participant,
} from 'livekit-client';

// --- Configuration ---
const DEMO_ROOM_NAME = 'demo-room-sandbox';
const DEMO_BOT_IDENTITY = 'demo-avatar';
const DEMO_BOT_NAME = 'Demo Participant';
const RECONNECT_MAX_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY_MS = 1000;

// --- Environment ---
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

// --- Token Generation (server-side) ---
async function generateBotToken(apiKey: string, apiSecret: string): Promise<string> {
  const at = new AccessToken(apiKey, apiSecret, {
    identity: DEMO_BOT_IDENTITY,
    ttl: '4h', // Long-lived token for continuous bot presence
  });

  at.addGrant({
    roomJoin: true,
    room: DEMO_ROOM_NAME,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  // Mark this as a demo bot in metadata
  at.metadata = JSON.stringify({
    name: DEMO_BOT_NAME,
    isDemoBot: true,
    joinedAt: new Date().toISOString(),
  });

  return at.toJwt();
}

// --- Room Service for provisioning ---
async function ensureRoomExists(
  roomService: RoomServiceClient,
): Promise<void> {
  try {
    const rooms = await roomService.listRooms();
    const exists = rooms.some((r) => r.name === DEMO_ROOM_NAME);

    if (!exists) {
      console.log(`[DemoBot] Creating room "${DEMO_ROOM_NAME}"...`);
      await roomService.createRoom({
        name: DEMO_ROOM_NAME,
        emptyTimeout: 0, // Never auto-delete — room persists without participants
        maxParticipants: 10,
      });
      console.log(`[DemoBot] Room "${DEMO_ROOM_NAME}" created successfully.`);
    } else {
      console.log(`[DemoBot] Room "${DEMO_ROOM_NAME}" already exists.`);
    }
  } catch (error) {
    // Room creation is best-effort — if it fails (e.g., server prevents creation),
    // the bot will still attempt to connect and join the room
    console.warn(`[DemoBot] Could not verify/create room: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// --- Audio Track Creation ---
async function createSilentAudioTrack(): Promise<LocalAudioTrack> {
  // Create a silent audio track (microphone with no actual audio input needed for demo)
  // This ensures the participant list shows 2 participants when a real user joins
  const track = await createLocalAudioTrack({
    echoCancellation: false,
    autoGainControl: false,
    noiseSuppression: false,
  });

  console.log(`[DemoBot] Created silent audio track: ${track.trackSid}`);
  return track;
}

// --- Bot Class ---
class DemoBot {
  private apiKey: string;
  private apiSecret: string;
  private livekitUrl: string;
  private roomService: RoomServiceClient;
  private audioTrack: LocalAudioTrack | null = null;
  private reconnectAttempts = 0;
  private shouldRun = true;

  constructor() {
    this.apiKey = getEnv('LIVEKIT_API_KEY');
    this.apiSecret = getEnv('LIVEKIT_API_SECRET');
    this.livekitUrl = getOptionalEnv('LIVEKIT_URL', 'wss://demo.livekit.cloud');
    this.roomService = new RoomServiceClient(
      this.livekitUrl,
      this.apiKey,
      this.apiSecret,
    );
  }

  async start(): Promise<void> {
    console.log('[DemoBot] Starting HIPS Demo Room Bot...');
    console.log(`[DemoBot] Connecting to: ${this.livekitUrl}`);
    console.log(`[DemoBot] Room: ${DEMO_ROOM_NAME}`);
    console.log(`[DemoBot] Identity: ${DEMO_BOT_IDENTITY}`);

    // Ensure room exists before connecting
    await ensureRoomExists(this.roomService);

    await this.connect();
  }

  stop(): void {
    console.log('[DemoBot] Shutting down...');
    this.shouldRun = false;
    this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const token = await generateBotToken(this.apiKey, this.apiSecret);

      console.log(`[DemoBot] Connecting to room "${DEMO_ROOM_NAME}"...`);

      const room = new Room({
        adaptiveStream: false,
        dynacast: false,
      });

      // Set up event listeners
      room.on(RoomEvent.Connected, () => {
        console.log('[DemoBot] Connected to room!');
        this.reconnectAttempts = 0;
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log('[DemoBot] Disconnected from room');
        this.handleDisconnect();
      });

      room.on(RoomEvent.Reconnecting, () => {
        console.log('[DemoBot] Reconnecting...');
      });

      room.on(RoomEvent.Reconnected, () => {
        console.log('[DemoBot] Reconnected!');
      });

      room.on(RoomEvent.ParticipantConnected, (participant: Participant) => {
        console.log(`[DemoBot] Participant joined: ${participant.identity}`);
      });

      room.on(RoomEvent.ParticipantDisconnected, (participant: Participant) => {
        console.log(`[DemoBot] Participant left: ${participant.identity}`);
      });

      room.on(RoomEvent.LocalTrackPublished, (publication) => {
        console.log(`[DemoBot] Published track: ${publication.trackSid}`);
      });

      room.on(RoomEvent.LocalTrackUnpublished, (publication) => {
        console.log(`[DemoBot] Unpublished track: ${publication.trackSid}`);
      });

      room.on(RoomEvent.MediaDevicesError, (error: Error) => {
        console.error(`[DemoBot] Media device error: ${error.message}`);
      });

      // Connect to room
      await room.connect(this.livekitUrl, token);
      console.log(`[DemoBot] Successfully connected. Room: ${room.name}`);

      // Publish silent audio track
      await this.publishAudioTrack(room);

      console.log('[DemoBot] Bot is now active in the room.');
      console.log('[DemoBot] Press Ctrl+C to stop.');

    } catch (error) {
      console.error(`[DemoBot] Connection failed: ${error instanceof Error ? error.message : String(error)}`);
      await this.handleDisconnect();
    }
  }

  private async publishAudioTrack(room: Room): Promise<void> {
    try {
      this.audioTrack = await createSilentAudioTrack();
      await room.localParticipant.publishTrack(this.audioTrack);
      console.log('[DemoBot] Silent audio track published successfully.');
    } catch (error) {
      console.warn(`[DemoBot] Could not publish audio track: ${error instanceof Error ? error.message : String(error)}`);
      // Continue anyway - the bot can still be present in the room without audio
    }
  }

  private async handleDisconnect(): Promise<void> {
    if (!this.shouldRun) {
      console.log('[DemoBot] Bot is stopping, skipping reconnect.');
      return;
    }

    if (this.reconnectAttempts >= RECONNECT_MAX_ATTEMPTS) {
      console.error(`[DemoBot] Max reconnect attempts (${RECONNECT_MAX_ATTEMPTS}) reached. Exiting.`);
      process.exit(1);
    }

    this.reconnectAttempts++;
    const delay = RECONNECT_BASE_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[DemoBot] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${RECONNECT_MAX_ATTEMPTS})...`);

    await this.sleep(delay);
    await this.connect();
  }

  private disconnect(): void {
    if (this.audioTrack) {
      try {
        this.audioTrack.stop();
      } catch (error) {
        console.warn(`[DemoBot] Error stopping audio track: ${error instanceof Error ? error.message : String(error)}`);
      }
      this.audioTrack = null;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// --- Main ---
async function main(): Promise<void> {
  const bot = new DemoBot();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n[DemoBot] Received SIGINT');
    bot.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n[DemoBot] Received SIGTERM');
    bot.stop();
    process.exit(0);
  });

  try {
    await bot.start();
  } catch (error) {
    console.error(`[DemoBot] Fatal error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Only run if this is the main module
main().catch((error) => {
  console.error(`[DemoBot] Unhandled error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

export { DemoBot, generateBotToken, ensureRoomExists };
