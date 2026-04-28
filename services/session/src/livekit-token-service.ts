import { createHmac, randomUUID } from "node:crypto";
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
    style: (first % 12) + 1,
    palette: palettes[second % palettes.length] ?? "coastal",
    gesture: "idle",
    locked: true,
  };
}

export class LiveKitTokenService {
  constructor(private readonly options: LiveKitTokenOptions) {}

  issue(sessionId: string, now = new Date()): AnonymousLiveSessionToken {
    const anonymousIdentity = randomUUID();
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
