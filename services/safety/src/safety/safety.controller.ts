import { Controller, Post, Body, Get, Param, UseGuards, BadRequestException, HttpException, HttpStatus, Patch, NotFoundException } from '@nestjs/common';
import { SafetyService } from './safety.service.js';
import { ServiceAuthGuard } from './service-auth.guard.js';
import { IngestTranscriptSchema, ManualFlagSchema, EscalateAlertSchema, UpdateAlertStatusSchema } from './safety.schemas.js';

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

  @Get('alerts-by-id/:id')
  async getAlertById(@Param('id') id: string) {
    const alert = await this.safetyService.findAlertById(id);
    if (!alert) throw new NotFoundException('Alert not found');
    return alert;
  }

  @Patch('alerts/:id/status')
  async updateAlertStatus(
    @Param('id') id: string,
    @Body() body: unknown
  ) {
    const result = UpdateAlertStatusSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }
    const { status, actorId, reason } = result.data;
    try {
      return await this.safetyService.updateAlertStatus(id, status, actorId, reason);
    } catch (err) {
      if (err instanceof Error && err.message === 'Alert not found') {
        throw new NotFoundException('Alert not found');
      }
      throw err;
    }
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

  @Post('crisis-access')
  async crisisAccess(@Body() body: unknown) {
    // Human-initiated crisis protocol trigger stub
    // Returns 503 Service Unavailable since vault integration is pending.
    throw new HttpException(
      {
        message: 'Crisis access service is currently unavailable. Vault integration is pending.',
        error: 'Service Unavailable',
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      },
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
}