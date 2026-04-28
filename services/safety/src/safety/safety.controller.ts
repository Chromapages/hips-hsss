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

  @Get('alerts/:sessionId')
  async getAlerts(@Param('sessionId') sessionId: string) {
    return this.safetyService.getAlerts(sessionId);
  }
}
