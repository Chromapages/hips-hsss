import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { BaseService } from './base-service.js';

export type EscalationLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EscalationRecord = {
  alertId: string;
  sessionId: string;
  participantId: string;
  level: EscalationLevel;
  reason: string;
  triggeredBy: string;
  status: 'open' | 'reviewing' | 'resolved';
  createdAt: Date;
};

function toDbLevel(level: EscalationLevel): string {
  switch (level) {
    case 'CRITICAL': return 'crisis';
    case 'HIGH': return 'urgent';
    default: return 'watch';
  }
}

@Injectable()
export class EscalationQueueService extends BaseService {
  private readonly MAX_PENDING = 100;

  constructor(protected override readonly prisma: PrismaService) {
    super(prisma, EscalationQueueService.name);
  }

  async enqueue(
    alertId: string,
    sessionId: string,
    participantId: string,
    level: EscalationLevel,
    reason: string,
    triggeredBy: string,
  ): Promise<void> {
    if (level !== 'HIGH' && level !== 'CRITICAL') {
      this.logger.debug(`Skipping enqueue for non-escalation level: ${level}`);
      return;
    }

    const pendingCount = await this.prisma.escalationQueue.count({
      where: { status: 'open' },
    });

    if (pendingCount >= this.MAX_PENDING) {
      this.logger.warn(`Escalation queue full (${this.MAX_PENDING}). Dropping: ${alertId}`);
      throw new Error(`Escalation queue full. Alert ${alertId} was not queued.`);
    }

    await this.prisma.escalationQueue.create({
      data: {
        alertId,
        sessionRef: sessionId,
        level: toDbLevel(level),
        source: 'keyword',
        summary: reason,
        status: 'open',
      },
    });

    await this.logAuditEvent({
      service: 'safety-engine.escalation-queue',
      action: 'ESCALATION_ENQUEUED',
      actorRef: triggeredBy,
      subjectRef: sessionId,
      metadata: { alertId, level, reason },
    });

    this.logger.log(`Escalation enqueued: ${alertId} [${level}]`);
  }

  async getPending(): Promise<EscalationRecord[]> {
    const records = await this.prisma.escalationQueue.findMany({
      where: { status: 'open' },
      orderBy: { createdAt: 'asc' },
    });
    return records.map((r: { alertId: string | null; sessionRef: string; level: string; summary: string; status: string; createdAt: Date }) => ({
      alertId: r.alertId ?? '',
      sessionId: r.sessionRef,
      participantId: r.sessionRef,
      level: this.toApiLevel(r.level),
      reason: r.summary,
      triggeredBy: 'system',
      status: r.status as EscalationRecord['status'],
      createdAt: r.createdAt,
    }));
  }

  async acknowledge(id: string, actorRef: string): Promise<void> {
    const record = await this.prisma.escalationQueue.findUnique({ where: { id } });
    if (!record) return;

    await this.prisma.escalationQueue.update({
      where: { id },
      data: { status: 'reviewing', reviewerHandle: actorRef },
    });

    await this.logAuditEvent({
      service: 'safety-engine.escalation-queue',
      action: 'ESCALATION_ACKNOWLEDGED',
      actorRef,
      subjectRef: record.sessionRef,
      metadata: { escalationId: id, alertId: record.alertId },
    });
  }

  async resolve(id: string, actorRef: string, outcome: string): Promise<void> {
    const record = await this.prisma.escalationQueue.findUnique({ where: { id } });
    if (!record) return;

    await this.prisma.escalationQueue.update({
      where: { id },
      data: { status: 'resolved' },
    });

    await this.logAuditEvent({
      service: 'safety-engine.escalation-queue',
      action: 'ESCALATION_RESOLVED',
      actorRef,
      subjectRef: record.sessionRef,
      metadata: { escalationId: id, alertId: record.alertId, outcome },
    });
  }

  async dismiss(id: string, actorRef: string, reason: string): Promise<void> {
    const record = await this.prisma.escalationQueue.findUnique({ where: { id } });
    if (!record) return;

    await this.prisma.escalationQueue.update({
      where: { id },
      data: { status: 'resolved' },
    });

    await this.logAuditEvent({
      service: 'safety-engine.escalation-queue',
      action: 'ESCALATION_DISMISSED',
      actorRef,
      subjectRef: record.sessionRef,
      metadata: { escalationId: id, alertId: record.alertId, dismissalReason: reason },
    });
  }

  private toApiLevel(dbLevel: string): EscalationLevel {
    switch (dbLevel) {
      case 'crisis': return 'CRITICAL';
      case 'urgent': return 'HIGH';
      case 'watch': return 'MEDIUM';
      default: return 'LOW';
    }
  }
}