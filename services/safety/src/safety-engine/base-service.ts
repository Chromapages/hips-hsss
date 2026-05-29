import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

export interface AuditEventInput {
  service: string;
  action: string;
  actorRef: string;
  subjectRef?: string;
  metadata?: Record<string, unknown>;
}

export abstract class BaseService {
  protected readonly logger: Logger;

  protected constructor(
    protected readonly prisma: PrismaService,
    serviceName: string
  ) {
    this.logger = new Logger(serviceName);
  }

  protected async logAuditEvent(input: AuditEventInput): Promise<void> {
    await this.prisma.safetyAuditLog.create({
      data: {
        action: `${input.service}:${input.action}`,
        actor: input.actorRef,
        metadata: {
          service: input.service,
          action: input.action,
          subjectRef: input.subjectRef ?? null,
          ...(input.metadata ?? {}),
        },
      },
    });
    this.logger.debug(`AuditLog: ${input.service} | ${input.action} | ${input.actorRef}`);
  }
}