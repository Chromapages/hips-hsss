import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SafetyService } from './safety.service.js';

@Controller('safety')
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Post('transcript')
  async ingestTranscript(
    @Body('sessionId') sessionId: string,
    @Body('text') text: string,
    @Body('participantId') participantId: string
  ) {
    return this.safetyService.processTranscript(sessionId, participantId, text);
  }

  @Post('flag')
  async manualFlag(
    @Body('sessionId') sessionId: string,
    @Body('reporterId') reporterId: string,
    @Body('level') level: 'HIGH' | 'CRITICAL',
    @Body('reason') reason: string
  ) {
    return this.safetyService.handleManualFlag(sessionId, reporterId, level, reason);
  }

  @Get('alerts/:sessionId')
  async getAlerts(@Param('sessionId') sessionId: string) {
    return this.safetyService.getAlerts(sessionId);
  }

  @Get('alerts')
  async getAllAlerts() {
    return this.safetyService.findAllAlerts();
  }

  @Post('alerts/:id/escalate')
  async escalateAlert(
    @Param('id') id: string,
    @Body('actorId') actorId: string,
    @Body('reason') reason: string
  ) {
    return this.safetyService.triggerCrisisProtocol(id, actorId, reason);
  }
}
