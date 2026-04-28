import { randomUUID } from "node:crypto";
import type {
  EscalationQueueItem,
  SafetyEvent,
  SafetyLevel,
  VaultAccessRequest,
} from "@hips/types";

export type SafetyKeywordRule = {
  term: string;
  level: SafetyLevel;
};

const defaultRules: SafetyKeywordRule[] = [
  { term: "988", level: "urgent" },
  { term: "unsafe", level: "urgent" },
  { term: "harm", level: "crisis" },
];

export class SafetyEngine {
  private readonly queue: EscalationQueueItem[] = [];

  constructor(private readonly rules = defaultRules) {}

  scan(sessionRef: string, text: string, now = new Date()) {
    const match = this.rules.find((rule) =>
      text.toLowerCase().includes(rule.term.toLowerCase()),
    );

    if (!match) {
      return null;
    }

    return this.addEvent(
      {
        sessionRef,
        level: match.level,
        source: "keyword",
        summary: `Matched safety rule: ${match.term}`,
      },
      now,
    );
  }

  manualFlag(
    sessionRef: string,
    level: SafetyLevel,
    summary: string,
    now = new Date(),
  ) {
    return this.addEvent({ sessionRef, level, source: "manual", summary }, now);
  }

  requestVaultAccess(request: VaultAccessRequest) {
    const item = this.queue.find((entry) => entry.id === request.escalationId);

    if (!item || item.level !== "crisis") {
      throw new Error("Vault access requires a crisis escalation");
    }

    if (request.justification.trim().length < 20) {
      throw new Error("Vault access requires a clear justification");
    }

    item.status = "reviewing";
    item.reviewerHandle = request.reviewerHandle;
    return item;
  }

  listQueue() {
    return this.queue.filter((entry) => entry.status !== "resolved");
  }

  private addEvent(
    input: Omit<SafetyEvent, "id" | "createdAt">,
    createdAt: Date,
  ) {
    const event: EscalationQueueItem = {
      ...input,
      id: randomUUID(),
      createdAt,
      status: "open",
    };

    this.queue.push(event);
    return event;
  }
}
