import type { SessionLifecycleRecord, SessionLifecycleStatus } from "@hips/types";

export class SessionLifecycleManager {
  private readonly records = new Map<string, SessionLifecycleRecord>();

  create(sessionId: string, participantLimit = 2, now = new Date()) {
    const record: SessionLifecycleRecord = {
      sessionId,
      roomName: `session-${sessionId}`,
      status: "created",
      participantLimit,
      createdAt: now,
    };

    this.records.set(sessionId, record);
    return record;
  }

  transition(
    sessionId: string,
    status: Exclude<SessionLifecycleStatus, "created">,
    now = new Date(),
  ) {
    const record = this.records.get(sessionId);

    if (!record) {
      throw new Error(`Unknown session ${sessionId}`);
    }

    if (record.status === "ended") {
      return record;
    }

    if (status === "active" && !record.startedAt) {
      record.startedAt = now;
    }

    if (status === "ended") {
      record.endedAt = now;
    }

    record.status = status;
    return record;
  }

  get(sessionId: string) {
    return this.records.get(sessionId) ?? null;
  }
}
