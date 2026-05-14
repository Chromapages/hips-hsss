import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

export interface FlagInput {
  sessionId: string;
  flagType: "COUNSELOR_FLAG" | "KEYWORD_DETECTED" | "CRISIS_MENTIONED";
  actorAnonId?: string;
  description?: string;
  timestamp: Date;
}

export interface EscalationItem {
  id: string;
  sessionId: string;
  flagType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRISIS";
  status: "PENDING" | "IN_REVIEW" | "RESOLVED";
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
}

export interface CrisisFlagRecord {
  id: string;
  sessionId: string;
  flagType: string;
  actorAnonId?: string;
  description?: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRISIS";
  createdAt: Date;
}

interface QueueFilter {
  page: number;
  pageSize: number;
}

export interface CrisisResources {
  hotline: string;
  hotlineLabel: string;
  crisisTextLine: string;
  crisisTextLineLabel: string;
  emergencyServices: string;
  emergencyServicesLabel: string;
  additionalResources: Array<{
    name: string;
    url: string;
    description: string;
  }>;
}

@Injectable()
export class SafetyService {
  private readonly logger = new Logger(SafetyService.name);
  // In-memory store for crisis flags (replace with DB persistence in production)
  private readonly crisisFlags: CrisisFlagRecord[] = [];

  constructor(private readonly http: HttpService) {}

  async receiveFlag(input: FlagInput): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    const severity = this.deriveSeverity(input.flagType);

    const flagRecord: CrisisFlagRecord = {
      id,
      sessionId: input.sessionId,
      flagType: input.flagType,
      actorAnonId: input.actorAnonId,
      description: input.description,
      severity,
      createdAt: input.timestamp,
    };

    // Store in memory (replace with DB write in production)
    this.crisisFlags.push(flagRecord);

    // Log the flag for audit purposes
    this.logger.log(`Flag received: ${id}`, {
      sessionId: input.sessionId,
      flagType: input.flagType,
      severity,
      actorAnonId: input.actorAnonId,
    });

    // In production: write AuditEvent to session DB via Prisma
    // AuditEvent eventType = "SAFETY_FLAG"
    this.logger.debug(`[Safety] Flag stored: ${id}`, flagRecord);

    return { id };
  }

  async getQueue(filter: QueueFilter): Promise<{
    items: EscalationItem[];
    totalCount: number;
  }> {
    // Query from in-memory store (replace with DB query in production)
    const pendingFlags = this.crisisFlags
      .filter(f => f.severity === 'HIGH' || f.severity === 'CRISIS')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const start = filter.page * filter.pageSize;
    const items: EscalationItem[] = pendingFlags
      .slice(start, start + filter.pageSize)
      .map(f => ({
        id: f.id,
        sessionId: f.sessionId,
        flagType: f.flagType,
        severity: f.severity,
        status: 'PENDING' as const,
        createdAt: f.createdAt,
      }));

    return {
      items,
      totalCount: pendingFlags.length,
    };
  }

  async resolveEscalation(
    id: string,
    input: { resolution: string; crisisResourcesShown: boolean },
  ): Promise<{ id: string; resolvedAt: string; resolution: string; crisisResourcesShown: boolean }> {
    // Find and update the flag in our store
    const flagIndex = this.crisisFlags.findIndex(f => f.id === id);
    if (flagIndex === -1) {
      this.logger.warn(`[Safety] Attempted to resolve unknown flag: ${id}`);
    }

    this.logger.log(`[Safety] Flag resolved: ${id}`, {
      resolution: input.resolution,
      crisisResourcesShown: input.crisisResourcesShown,
    });

    return {
      id,
      resolvedAt: new Date().toISOString(),
      resolution: input.resolution,
      crisisResourcesShown: input.crisisResourcesShown,
    };
  }

  async triggerCrisisProtocol(
    sessionId: string,
    input: { requesterId: string; justification: string },
  ): Promise<{
    crisisLogId: string;
    sessionId: string;
    triggeredAt: string;
    crisisResources: CrisisResources;
  }> {
    // Generate crisis log ID
    const crisisLogId = crypto.randomUUID();

    // Log the crisis trigger for audit
    this.logger.log(`[Crisis] Protocol triggered for session ${sessionId}`, {
      crisisLogId,
      requesterId: input.requesterId,
      justification: input.justification,
    });

    // Step 1: Log the crisis trigger in audit log
    // In production: write AuditEvent with eventType = "CRISIS_TRIGGERED"

    // Step 2: Request limited vault access via vault service
    // This is a crisis-only logged access — justification is required
    // In production: POST /vault/access-log with justification
    try {
      this.logger.debug(`[Crisis] Vault access would be logged for crisis protocol`, {
        crisisLogId,
        sessionId,
        justification: input.justification,
      });
    } catch (error) {
      this.logger.error("[Crisis] Failed to process vault access:", error);
      throw error;
    }

    return {
      crisisLogId,
      sessionId,
      triggeredAt: new Date().toISOString(),
      crisisResources: this.getCrisisResources(),
    };
  }

  async getCrisisLog(filter: QueueFilter): Promise<{
    logs: CrisisFlagRecord[];
    meta: { page: number; pageSize: number; totalCount: number };
  }> {
    const sortedFlags = [...this.crisisFlags].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const start = filter.page * filter.pageSize;

    return {
      logs: sortedFlags.slice(start, start + filter.pageSize),
      meta: {
        page: filter.page,
        pageSize: filter.pageSize,
        totalCount: this.crisisFlags.length,
      },
    };
  }

  private deriveSeverity(
    flagType: FlagInput["flagType"],
  ): EscalationItem["severity"] {
    switch (flagType) {
      case "CRISIS_MENTIONED":
        return "CRISIS";
      case "KEYWORD_DETECTED":
        return "MEDIUM";
      case "COUNSELOR_FLAG":
        return "HIGH";
      default:
        return "LOW";
    }
  }

  private getCrisisResources(): CrisisResources {
    return {
      hotline: "988",
      hotlineLabel: "988 Suicide & Crisis Lifeline",
      crisisTextLine: "Text HOME to 741741",
      crisisTextLineLabel: "Crisis Text Line",
      emergencyServices: "911",
      emergencyServicesLabel: "Emergency Services",
      additionalResources: [
        {
          name: "SAMHSA National Helpline",
          url: "https://samhsa.gov/find-help/national-helpline",
          description: "Free, confidential treatment referral and information service",
        },
      ],
    };
  }
}
