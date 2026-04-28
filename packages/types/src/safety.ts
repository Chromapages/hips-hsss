export type SafetyLevel = "watch" | "urgent" | "crisis";

export type SafetyEvent = {
  id: string;
  sessionRef: string;
  level: SafetyLevel;
  source: "keyword" | "manual";
  summary: string;
  createdAt: Date;
};

export type EscalationQueueItem = SafetyEvent & {
  status: "open" | "reviewing" | "resolved";
  reviewerHandle?: string;
};

export type VaultAccessRequest = {
  escalationId: string;
  reviewerHandle: string;
  justification: string;
  requestedAt: Date;
};
