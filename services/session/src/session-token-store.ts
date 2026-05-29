// IMPORTANT: This in-memory store is for development only. For production
// multi-instance deployments, replace with Redis-backed store at redis-token-store.ts
import { randomBytes } from "node:crypto";

export type TokenRecord = {
  token: string;
  sessionId: string;
  anonymousParticipantId: string;
  expiresAt: Date;
  consumed: boolean;
};

// NOTE: This is an in-memory token store. For multi-instance production,
// replace with Redis-based implementation to share tokens across instances.
export class SessionTokenStore {
  private readonly tokens = new Map<string, TokenRecord>();

  constructor() {
    // Periodically purge expired tokens to prevent memory buildup
    setInterval(() => this.purgeExpired(), 60_000);
  }

  issue(sessionId: string, anonymousParticipantId: string, expiresAt: Date) {
    const token = randomBytes(32).toString("hex");
    const record: TokenRecord = {
      token,
      sessionId,
      anonymousParticipantId,
      expiresAt,
      consumed: false,
    };

    this.tokens.set(token, record);

    return record;
  }

  consume(token: string, now = new Date()) {
    const record = this.tokens.get(token);

    if (!record || record.consumed || record.expiresAt <= now) {
      return null;
    }

    record.consumed = true;
    return {
      sessionId: record.sessionId,
      anonymousParticipantId: record.anonymousParticipantId,
    };
  }

  purgeExpired(now = new Date()) {
    for (const [token, record] of this.tokens.entries()) {
      if (record.expiresAt <= now || record.consumed) {
        this.tokens.delete(token);
      }
    }
  }
}
