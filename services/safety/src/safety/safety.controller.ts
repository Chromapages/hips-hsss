import { Controller, Post, Body, Get, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { SafetyService } from './safety.service.js';
import { ServiceAuthGuard } from './service-auth.guard.js';
import { IngestTranscriptSchema, ManualFlagSchema, EscalateAlertSchema } from './safety.schemas.js';

@Controller('safety')
@UseGuards(ServiceAuthGuard)
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Post('transcript')
  async ingestTranscript(@Body() body: unknown) {
    const result = IngestTranscriptSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }
    const { sessionId, text, participantId } = result.data;
    return this.safetyService.processTranscript(sessionId, participantId, text);
  }

  @Post('flag')
  async manualFlag(@Body() body: unknown) {
    const result = ManualFlagSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }
    const { sessionId, reporterId, level, reason } = result.data;
    return this.safetyService.handleManualFlag(sessionId, reporterId, level, reason);
  }

  @Get('alerts/:sessionId')
  async getAlerts(@Param('sessionId') sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('sessionId is required');
    }
    return this.safetyService.getAlerts(sessionId);
  }

  @Get('alerts')
  async getAllAlerts() {
    return this.safetyService.findAllAlerts();
  }

  @Post('alerts/:id/escalate')
  async escalateAlert(
    @Param('id') id: string,
    @Body() body: unknown
  ) {
    const result = EscalateAlertSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }
    const { actorId, reason } = result.data;
    return this.safetyService.triggerCrisisProtocol(id, actorId, reason);
  }
}