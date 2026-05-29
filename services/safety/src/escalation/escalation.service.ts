import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma.service.js';
import type { EscalationQueueQueryDto, EscalateAlertDto, ResolveAlertDto } from './escalation.schemas.js';

// NOTE: SessionPrismaClient is instantiated dynamically via SESSION_DATABASE_URL
// (not imported from packages/db/generated/session) to maintain service boundary.
// The safety service must never import session service source or generated code.
// This is the approved cross-service AuditEvent bridge pattern.
type SessionPrismaClient = PrismaClient;

/**
 * Flagged session with identity hidden - for admin eyes only.
 */
export interface FlaggedSessionAdmin {
  alertId: string;
  sessionId: string;
  severity: string;
  category: string;
  reason: string;
  // Identity is NEVER exposed to admin in this view
  // Only anonymous participant hash is shown
  participantHash: string;
  transcriptPreview: string | null;
  isResolved: boolean;
  createdAt: Date;
  strikeCount: number | null;
}

/**
 * Fetch with retry and timeout - exponential backoff: 1s, 2s, 4s
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) return response;
      if (i === retries - 1) return response;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AlertWithMitigations {
  id: string;
  sessionId: string;
  severity: string;
  category: string;
  anonymizedReason: string;
  transcriptChunk: string | null;
  isResolved: boolean;
  createdAt: Date;
  mitigations: { id: string }[];
}

@Injectable()
export class EscalationQueueService implements OnModuleInit {
  private sessionPrisma!: SessionPrismaClient;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  onModuleInit() {
    // Initialize the session database Prisma client for AuditEvents.
    // Uses a separate PrismaClient instance pointed at SESSION_DATABASE_URL.
    // This avoids importing session service source or generated code across
    // service boundaries (approved cross-service AuditEvent bridge pattern).
    const sessionDbUrl = this.configService.get<string>('SESSION_DATABASE_URL');
    if (!sessionDbUrl) {
      console.warn('SESSION_DATABASE_URL missing. AuditEvents will not be created.');
      return;
    }

    this.sessionPrisma = new PrismaClient({
      datasources: {
        db: {
          url: sessionDbUrl,
        },
      },
    }) as SessionPrismaClient;
  }

  /**
   * Get escalation queue for admin review.
   * All participant identities are hidden - only anonymous hashes shown.
   */
  async getEscalationQueue(
    query: EscalationQueueQueryDto,
  ): Promise<PaginatedResult<FlaggedSessionAdmin>> {
    const { page, limit, severity, status } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (severity) {
      where.severity = severity;
    }

    if (status === 'pending') {
      where.isResolved = false;
    } else if (status === 'resolved') {
      where.isResolved = true;
    }
    // 'all' status - no filter applied

    // Get total count
    const total = await this.prisma.safetyAlert.count({ where });

    // Get paginated alerts
    const alerts = await this.prisma.safetyAlert.findMany({
      where,
      orderBy: [
        { severity: 'desc' }, // CRITICAL first
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
      include: {
        mitigations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Transform to admin-safe view (identity hidden)
    const data: FlaggedSessionAdmin[] = alerts.map((alert) => {
      // Create anonymous participant hash from sessionId
      // This provides a consistent but non-identifiable reference
      const participantHash = this.hashParticipant(alert.sessionId);

      return {
        alertId: alert.id,
        sessionId: alert.sessionId,
        severity: alert.severity,
        category: alert.category,
        reason: alert.anonymizedReason,
        participantHash,
        transcriptPreview: alert.transcriptChunk
          ? alert.transcriptChunk.substring(0, 200) + (alert.transcriptChunk.length > 200 ? '...' : '')
          : null,
        isResolved: alert.isResolved,
        createdAt: alert.createdAt,
        strikeCount: alert.mitigations.length > 0 ? alert.mitigations.length : null,
      };
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single alert details for admin review.
   * Identity remains hidden.
   */
  async getAlertDetails(alertId: string): Promise<FlaggedSessionAdmin> {
    const alert = await this.prisma.safetyAlert.findUnique({
      where: { id: alertId },
      include: {
        mitigations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!alert) {
      throw new NotFoundException(`Alert ${alertId} not found`);
    }

    return {
      alertId: alert.id,
      sessionId: alert.sessionId,
      severity: alert.severity,
      category: alert.category,
      reason: alert.anonymizedReason,
      participantHash: this.hashParticipant(alert.sessionId),
      transcriptPreview: alert.transcriptChunk
        ? alert.transcriptChunk.substring(0, 500) + (alert.transcriptChunk.length > 500 ? '...' : '')
        : null,
      isResolved: alert.isResolved,
      createdAt: alert.createdAt,
      strikeCount: alert.mitigations.length,
    };
  }

  /**
   * Escalate an alert to crisis protocol.
   * Creates AuditEvent in session database.
   */
  async escalateAlert(
    dto: EscalateAlertDto,
    adminUid: string,
    adminEmail: string,
  ): Promise<{ success: boolean; alertId: string; crisisProtocolId: string }> {
    const alert = await this.prisma.safetyAlert.findUnique({
      where: { id: dto.alertId },
    });

    if (!alert) {
      throw new NotFoundException(`Alert ${dto.alertId} not found`);
    }

    // Validate crisis protocol eligibility
    if (alert.severity !== 'CRITICAL' && dto.crisisLevel !== 'STANDARD') {
      throw new BadRequestException(
        'Crisis protocol (URGENT/EMERGENCY) can only be triggered for CRITICAL alerts. Use STANDARD escalation for other cases.',
      );
    }

    // Wrap in transaction: mitigation + audit log + session audit event
    const mitigation = await this.prisma.$transaction(async (tx) => {
      const m = await tx.safetyMitigation.create({
        data: {
          alertId: dto.alertId,
          action: 'ESCALATE',
          success: true,
          metadata: {
            crisisLevel: dto.crisisLevel,
            escalatedBy: adminUid,
            escalatedByEmail: adminEmail,
            reason: dto.reason,
            escalatedAt: new Date().toISOString(),
          },
        },
      });

      await tx.safetyAuditLog.create({
        data: {
          action: 'ALERT_ESCALATED',
          actor: adminUid,
          metadata: {
            alertId: dto.alertId,
            sessionId: alert.sessionId,
            crisisLevel: dto.crisisLevel,
            reason: dto.reason,
            mitigationId: m.id,
          },
        },
      });

      if (this.sessionPrisma) {
        try {
          await this.sessionPrisma.auditEvent.create({
            data: {
              eventType: 'SAFETY_FLAGGED',
              subjectId: alert.sessionId,
              metadata: {
                alertId: dto.alertId,
                severity: alert.severity,
                category: alert.category,
                escalatedBy: adminUid,
                escalationReason: dto.reason,
                crisisLevel: dto.crisisLevel,
                mitigationId: m.id,
                participantHash: this.hashParticipant(alert.sessionId),
              },
            },
          });
        } catch (error) {
          console.error('Failed to create AuditEvent in session database:', error);
        }
      }

      return m;
    });

    // 4. Call crisis protocol (request PII from Vault if needed)
    if (alert.severity === 'CRITICAL') {
      await this.triggerCrisisProtocol(
        alert.sessionId,
        adminUid,
        dto.reason,
      );
    }

    return {
      success: true,
      alertId: dto.alertId,
      crisisProtocolId: mitigation.id,
    };
  }

  /**
   * Resolve an alert with admin notes.
   */
  async resolveAlert(
    dto: ResolveAlertDto,
    adminUid: string,
  ): Promise<{ success: boolean; alertId: string }> {
    const alert = await this.prisma.safetyAlert.findUnique({
      where: { id: dto.alertId },
    });

    if (!alert) {
      throw new NotFoundException(`Alert ${dto.alertId} not found`);
    }

    // Wrap in transaction: mitigation + update alert + audit log
    await this.prisma.$transaction(async (tx) => {
      await tx.safetyMitigation.create({
        data: {
          alertId: dto.alertId,
          action: dto.resolution,
          success: true,
          metadata: {
            resolvedBy: adminUid,
            resolution: dto.resolution,
            notes: dto.notes,
            resolvedAt: new Date().toISOString(),
          },
        },
      });

      await tx.safetyAlert.update({
        where: { id: dto.alertId },
        data: { isResolved: dto.resolution !== 'DISMISSED' },
      });

      await tx.safetyAuditLog.create({
        data: {
          action: 'ALERT_RESOLVED',
          actor: adminUid,
          metadata: {
            alertId: dto.alertId,
            sessionId: alert.sessionId,
            resolution: dto.resolution,
            notes: dto.notes,
          },
        },
      });
    });

    return {
      success: true,
      alertId: dto.alertId,
    };
  }

  /**
   * Get audit logs for admin review.
   */
  async getAuditLogs(limit: number = 100): Promise<unknown[]> {
    return this.prisma.safetyAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Trigger crisis protocol - requests PII from Vault.
   */
  private async triggerCrisisProtocol(
    sessionId: string,
    actorId: string,
    reason: string,
  ): Promise<{ success: boolean; pii?: unknown }> {
    const vaultUrl = this.configService.get<string>('VAULT_SERVICE_URL');
    if (!vaultUrl) {
      console.warn('VAULT_SERVICE_URL not configured');
      return { success: false };
    }

    const vaultSecret = this.configService.get<string>('VAULT_API_SECRET');
    const subjectRef = `participant:${sessionId}`;

    try {
      const response = await fetchWithRetry(
        `${vaultUrl}/records/${subjectRef}?actor=${actorId}&purpose=${encodeURIComponent(reason)}`,
        {
          headers: {
            'x-vault-secret': vaultSecret || '',
            'x-api-version': '2024-01',
          },
        },
      );

      if (!response.ok) {
        console.error('Vault access denied for crisis protocol');
        return { success: false };
      }

      const piiData = await response.json();
      return { success: true, pii: piiData };
    } catch (error) {
      console.error('Crisis protocol failed:', error);
      return { success: false };
    }
  }

  /**
   * Generate anonymous participant hash from session ID using HMAC-SHA256.
   */
  private hashParticipant(sessionId: string): string {
    const hmac = crypto.createHmac('sha256', process.env.PARTICIPANT_HASH_KEY || 'dev-key');
    hmac.update(`hips-anon-${sessionId}`);
    return `P${hmac.digest('hex').substring(0, 8).toUpperCase()}`;
  }
}
