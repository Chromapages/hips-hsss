import { Injectable } from "@nestjs/common";
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

interface QueueFilter {
  page: number;
  pageSize: number;
}

@Injectable()
export class SafetyService {
  constructor(private readonly http: HttpService) {}

  async receiveFlag(input: FlagInput): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    const severity = this.deriveSeverity(input.flagType);

    // In production: write to session DB via Prisma
    // AuditEvent is created with eventType = "SAFETY_FLAG"
    console.log(`[Safety] Flag received: ${id}`, {
      sessionId: input.sessionId,
      flagType: input.flagType,
      severity,
    });

    return { id };
  }

  async getQueue(filter: QueueFilter): Promise<{
    items: EscalationItem[];
    totalCount: number;
  }> {
    // In production: query from session DB
    return {
      items: [],
      totalCount: 0,
    };
  }

  async resolveEscalation(
    id: string,
    input: { resolution: string; crisisResourcesShown: boolean },
  ) {
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
  ) {
    // Step 1: Log the crisis trigger in the audit log
    const crisisLogId = crypto.randomUUID();

    // Step 2: Request limited vault access via vault service
    // This is a crisis-only logged access — justification is required
    try {
      // In production: call vault service to log access
      // POST /vault/access-log with justification
      console.log(`[Crisis] Protocol triggered for session ${sessionId}`, {
        requesterId: input.requesterId,
        justification: input.justification,
      });
    } catch (error) {
      console.error("[Crisis] Failed to log vault access:", error);
    }

    return {
      crisisLogId,
      sessionId,
      triggeredAt: new Date().toISOString(),
      crisisResources: this.getCrisisResources(),
    };
  }

  async getCrisisLog(filter: QueueFilter) {
    return {
      logs: [],
      meta: {
        page: filter.page,
        pageSize: filter.pageSize,
        totalCount: 0,
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

  private getCrisisResources() {
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
