import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { SafetyEngineService } from './safety-engine.service.js';
import { EscalationQueueService } from './escalation-queue.service.js';
import { CrisisProtocolService } from './crisis-protocol.service.js';
import { ServiceAuthGuard } from '../safety/service-auth.guard.js';
import { z } from 'zod';

const AssessTextSchema = z.object({
  sessionId: z.string().min(1),
  participantId: z.string().min(1),
  text: z.string().min(1).max(50000),
});

const ManualFlagSchema = z.object({
  sessionId: z.string().min(1),
  reporterId: z.string().min(1),
  level: z.enum(['HIGH', 'CRITICAL']),
  reason: z.string().min(1),
});

const TriggerCrisisSchema = z.object({
  actorId: z.string().min(1),
  reason: z.string().min(1),
});

const AcknowledgeEscalationSchema = z.object({
  actorRef: z.string().min(1),
});

const ResolveEscalationSchema = z.object({
  actorRef: z.string().min(1),
  outcome: z.string().min(1),
});

const DismissEscalationSchema = z.object({
  actorRef: z.string().min(1),
  reason: z.string().min(1),
});

@Controller('safety-engine')
@UseGuards(ServiceAuthGuard)
export class SafetyEngineController {
  constructor(
    private readonly safetyEngine: SafetyEngineService,
    private readonly escalationQueue: EscalationQueueService,
    private readonly crisisProtocol: CrisisProtocolService,
  ) {}

  @Post('assess')
  async assessText(@Body() body: unknown) {
    const result = AssessTextSchema.safeParse(body);
    if (!result.success) throw new BadRequestException(result.error.errors);
    return this.safetyEngine.assessText(result.data.sessionId, result.data.participantId, result.data.text);
  }

  @Post('flag')
  async manualFlag(@Body() body: unknown) {
    const result = ManualFlagSchema.safeParse(body);
    if (!result.success) throw new BadRequestException(result.error.errors);
    return this.safetyEngine.manualFlag(
      result.data.sessionId,
      result.data.reporterId,
      result.data.level,
      result.data.reason,
    );
  }

  @Get('alerts/:alertId')
  async getAlert(@Param('alertId') alertId: string) {
    return this.safetyEngine.getAlert(alertId);
  }

  @Get('alerts/session/:sessionId')
  async getSessionAlerts(@Param('sessionId') sessionId: string) {
    return this.safetyEngine.getSessionAlerts(sessionId);
  }

  @Post('crisis/:alertId')
  async triggerCrisisProtocol(@Param('alertId') alertId: string, @Body() body: unknown) {
    const result = TriggerCrisisSchema.safeParse(body);
    if (!result.success) throw new BadRequestException(result.error.errors);
    return this.crisisProtocol.trigger(alertId, result.data.actorId, result.data.reason);
  }

  @Get('escalations')
  async getPendingEscalations() {
    return this.escalationQueue.getPending();
  }

  @Post('escalations/:id/acknowledge')
  async acknowledgeEscalation(@Param('id') id: string, @Body() body: unknown) {
    const result = AcknowledgeEscalationSchema.safeParse(body);
    if (!result.success) throw new BadRequestException(result.error.errors);
    return this.escalationQueue.acknowledge(id, result.data.actorRef);
  }

  @Post('escalations/:id/resolve')
  async resolveEscalation(@Param('id') id: string, @Body() body: unknown) {
    const result = ResolveEscalationSchema.safeParse(body);
    if (!result.success) throw new BadRequestException(result.error.errors);
    return this.escalationQueue.resolve(id, result.data.actorRef, result.data.outcome);
  }

  @Post('escalations/:id/dismiss')
  async dismissEscalation(@Param('id') id: string, @Body() body: unknown) {
    const result = DismissEscalationSchema.safeParse(body);
    if (!result.success) throw new BadRequestException(result.error.errors);
    return this.escalationQueue.dismiss(id, result.data.actorRef, result.data.reason);
  }
}