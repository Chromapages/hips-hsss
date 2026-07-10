import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "./prisma.service.js";
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

function mapToQueueItem(dbItem: any): EscalationQueueItem {
  return {
    id: dbItem.id,
    sessionRef: dbItem.sessionRef,
    level: dbItem.level as SafetyLevel,
    source: dbItem.source as any,
    summary: dbItem.summary,
    status: dbItem.status as any,
    reviewerHandle: dbItem.reviewerHandle ?? undefined,
    createdAt: dbItem.createdAt,
  };
}

@Injectable()
export class SafetyEngine {
  constructor(
    private prisma: PrismaService,
    private readonly rules = defaultRules
  ) {}

  async scan(sessionRef: string, text: string): Promise<EscalationQueueItem | null> {
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
    );
  }

  async manualFlag(
    sessionRef: string,
    level: SafetyLevel,
    summary: string,
  ): Promise<EscalationQueueItem> {
    return this.addEvent({ sessionRef, level, source: "manual", summary });
  }

  async requestVaultAccess(request: VaultAccessRequest): Promise<EscalationQueueItem> {
    const item = await this.prisma.escalationQueue.findFirst({
      where: { id: request.escalationId },
    });

    if (!item || item.level !== "crisis") {
      throw new Error("Vault access requires a crisis escalation");
    }

    if (request.justification.trim().length < 20) {
      throw new Error("Vault access requires a clear justification");
    }

    const updated = await this.prisma.escalationQueue.update({
      where: { id: request.escalationId },
      data: {
        status: "reviewing",
        reviewerHandle: request.reviewerHandle,
      },
    });
    return mapToQueueItem(updated);
  }

  async listQueue(): Promise<EscalationQueueItem[]> {
    const items = await this.prisma.escalationQueue.findMany({
      where: { status: { not: "resolved" } },
      orderBy: { createdAt: "desc" },
    });
    return items.map(mapToQueueItem);
  }

  async resolveEscalation(id: string): Promise<void> {
    await this.prisma.escalationQueue.update({
      where: { id },
      data: { status: "resolved" },
    });
  }

  private async addEvent(
    input: Omit<SafetyEvent, "id" | "createdAt">,
  ): Promise<EscalationQueueItem> {
    const event = await this.prisma.escalationQueue.create({
      data: {
        sessionRef: input.sessionRef,
        level: input.level,
        source: input.source,
        summary: input.summary,
        status: "open",
      },
    });
    return mapToQueueItem(event);
  }
}