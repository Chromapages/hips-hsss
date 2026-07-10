import { createHmac, randomBytes, randomUUID } from "node:crypto";
import type {
  AnonymousLiveSessionToken,
  AvatarPalette,
  AvatarProfile,
} from "@hips/types";

type LiveKitTokenOptions = {
  apiKey: string;
  apiSecret: string;
  durationSeconds: number;
};

const palettes: AvatarPalette[] = ["coastal", "sunrise", "forest"];

function base64Url(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function makeAvatar(seed: string): AvatarProfile {
  const first = seed.charCodeAt(0);
  const second = seed.charCodeAt(1);

	  return {
	    style: (first % 12) as any,
	    palette: palettes[second % palettes.length] ?? "coastal",
	    gesture: "idle",
		    bodyType: (first % 2) as 0 | 1,
	    skinTone: ["#E8B092", "#C58A63", "#905C38", "#5C3826"][first % 4],
	    hairStyle: first % 16,
	    hairColor: ["#1c1917", "#292524", "#44403c", "#78716c", "#ca8a04", "#d97706", "#8b5cf6", "#0ea5e9"][second % 8],
	    eyeColor: ["#1c1917", "#3f2d20", "#6b7280", "#2563eb", "#059669", "#a16207"][second % 6],
	    faceShape: first % 4,
	    noseStyle: second % 4,
	    eyeStyle: (second % 7) as any,
	    eyebrowStyle: (first % 4) as any,
	    mouthStyle: (second % 4) as any,
	    clothingType: (second % 6) as any,
	    clothingColor: ["#173B57", "#C59A35", "#10B981", "#FBBF24", "#EF4444", "#06B6D4"][first % 6],
	    accessoryType: (first % 6) as any,
	  } as any;
	}

export class LiveKitTokenService {
  private readonly identityCache = new Map<string, string>();

  constructor(private readonly options: LiveKitTokenOptions) {}

  issue(sessionId: string, userRef?: string, now = new Date()): AnonymousLiveSessionToken {
    // Validate sessionId: only alphanumeric, hyphens, and underscores allowed.
    // Prevents injection into roomName which is used as a LiveKit room identifier.
    if (!/^[a-zA-Z0-9_-]+$/.test(sessionId)) {
      throw new Error(
        `Invalid sessionId "${sessionId}": must contain only alphanumeric characters, hyphens, and underscores. ` +
        `Received value may contain unsafe characters and was rejected for security.`
      );
    }

    const identityCacheKey = userRef ? `${sessionId}:${userRef}` : `${sessionId}:${randomUUID()}`;
    let anonymousIdentity = this.identityCache.get(identityCacheKey);
    if (!anonymousIdentity) {
      anonymousIdentity = randomBytes(32).toString("hex");
      this.identityCache.set(identityCacheKey, anonymousIdentity);
    }
    const roomName = `session-${sessionId}`;
    const expiresAt = new Date(
      now.getTime() + this.options.durationSeconds * 1000 + 300_000,
    );
    const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const grants = {
      exp: Math.floor(expiresAt.getTime() / 1000),
      iss: this.options.apiKey,
      sub: anonymousIdentity,
      video: {
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
      },
    };
    const body = base64Url(JSON.stringify(grants));
    const unsigned = `${header}.${body}`;

    return {
      jwt: `${unsigned}.${sign(unsigned, this.options.apiSecret)}`,
      roomName,
      anonymousIdentity,
      expiresAt,
      avatar: makeAvatar(anonymousIdentity),
    };
  }
}
