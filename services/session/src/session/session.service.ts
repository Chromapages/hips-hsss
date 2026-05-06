import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { SessionPrismaService } from '../common/prisma';
import {
  FlagSessionInput,
  EndSessionInput,
  UpdateFacilitatorNotesInput,
} from '../common/dto/session.dto';
import { toSafetyFlagType } from '@hips/types';

@Injectable()
export class SessionService {
  constructor(
    private prisma: SessionPrismaService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async flagSession(
    sessionRecordId: string,
    input: FlagSessionInput,
    actorAnonId: string,
    actorRole: string,
  ): Promise<{ escalated: boolean; flagId: string }> {
    const session = await this.prisma.sessionRecord.findUnique({
      where: { id: sessionRecordId },
      include: { groupSession: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Log the flag event
    const flagEvent = await this.prisma.auditEvent.create({
      data: {
        sessionRecordId,
        eventType: 'FLAG_RAISED',
        severity: input.flagType === 'crisis' ? 'CRITICAL' : 'WARNING',
        actorAnonId,
        actorRole,
        eventData: {
          flagType: input.flagType,
          description: input.description,
          timestamp: input.timestamp,
        },
      },
    });

    // Notify Safety Engine
    await this.notifySafetyEngine(session, flagEvent.id, actorAnonId, actorRole, input.flagType);

    return {
      escalated: input.flagType === 'crisis',
      flagId: flagEvent.id,
    };
  }

  async endSession(
    sessionRecordId: string,
    input: EndSessionInput,
    actorAnonId: string,
    actorRole: string,
  ): Promise<{ ended: boolean; endedAt: string }> {
    const session = await this.prisma.sessionRecord.findUnique({
      where: { id: sessionRecordId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status === 'ENDED') {
      throw new BadRequestException('Session has already ended');
    }

    const endedAt = new Date();

    // Update session record
    await this.prisma.sessionRecord.update({
      where: { id: sessionRecordId },
      data: {
        status: 'ENDED',
        endedAt,
        facilitatorNotes: input.notes || session.facilitatorNotes,
      },
    });

    // Log the end event
    await this.prisma.auditEvent.create({
      data: {
        sessionRecordId,
        eventType: input.reason === 'completed' ? 'SESSION_ENDED' : 'SESSION_ABANDONED',
        severity: 'INFO',
        actorAnonId,
        actorRole,
        eventData: {
          reason: input.reason || 'unknown',
          endedAt: endedAt.toISOString(),
        },
      },
    });

    // If recording consent was given, trigger cleanup
    if (session.recordingConsent) {
      await this.cleanupRecording(sessionRecordId);
    }

    return {
      ended: true,
      endedAt: endedAt.toISOString(),
    };
  }

  async getFacilitatorNotes(sessionRecordId: string): Promise<string | null> {
    const session = await this.prisma.sessionRecord.findUnique({
      where: { id: sessionRecordId },
      select: {
        facilitatorNotes: true,
        facilitatorAnonId: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session.facilitatorNotes;
  }

  async updateFacilitatorNotes(
    sessionRecordId: string,
    input: UpdateFacilitatorNotesInput,
    actorAnonId: string,
  ): Promise<{ updated: boolean }> {
    const session = await this.prisma.sessionRecord.findUnique({
      where: { id: sessionRecordId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.prisma.sessionRecord.update({
      where: { id: sessionRecordId },
      data: {
        facilitatorNotes: input.notes,
        facilitatorAnonId: actorAnonId,
      },
    });

    // Log the update
    await this.prisma.auditEvent.create({
      data: {
        sessionRecordId,
        eventType: 'MODERATOR_NOTES_UPDATED',
        severity: 'INFO',
        actorAnonId,
        actorRole: 'facilitator',
        eventData: { notesLength: input.notes.length },
      },
    });

    return { updated: true };
  }

  async updateRecordingConsent(
    sessionRecordId: string,
    consent: boolean,
    actorAnonId: string,
  ): Promise<{ updated: boolean }> {
    const session = await this.prisma.sessionRecord.findUnique({
      where: { id: sessionRecordId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.prisma.sessionRecord.update({
      where: { id: sessionRecordId },
      data: { recordingConsent: consent },
    });

    // Log consent change
    await this.prisma.auditEvent.create({
      data: {
        sessionRecordId,
        eventType: consent ? 'RECORDING_CONSENT_GRANTED' : 'RECORDING_CONSENT_REVOKED',
        severity: 'INFO',
        actorAnonId,
        actorRole: 'participant',
      },
    });

    return { updated: true };
  }

  async autoTeardown(sessionRecordId: string): Promise<void> {
    const session = await this.prisma.sessionRecord.findUnique({
      where: { id: sessionRecordId },
    });

    if (!session || session.status !== 'ACTIVE') {
      return; // Already ended or not active
    }

    await this.prisma.sessionRecord.update({
      where: { id: sessionRecordId },
      data: { status: 'ABANDONED' },
    });

    await this.prisma.auditEvent.create({
      data: {
        sessionRecordId,
        eventType: 'SESSION_AUTO_TEARDOWN',
        severity: 'WARNING',
        actorRole: 'system',
        eventData: {
          reason: 'idle_timeout',
          timeoutMinutes: this.configService.get<number>('SESSION_IDLE_TIMEOUT_MINUTES', 10),
        },
      },
    });
  }

  private async notifySafetyEngine(
    session: any,
    flagEventId: string,
    actorAnonId: string,
    actorRole: string,
    flagType: 'concern' | 'crisis' | 'technical' | 'other',
  ): Promise<void> {
    const safetyEngineUrl = this.configService.get<string>('SAFETY_ENGINE_URL');
    const safetyEngineSecret = this.configService.get<string>('SAFETY_ENGINE_SECRET');

    if (!safetyEngineUrl) {
      console.warn('Safety Engine URL not configured');
      return;
    }

    try {
      await this.httpService.post(
        `${safetyEngineUrl}/safety/v1/flag`,
        {
          sessionId: session.sessionId,
          flagEventId,
          flagType: toSafetyFlagType(flagType),
          timestamp: new Date().toISOString(),
          actorAnonId,
          actorRole,
        },
        {
          headers: {
            'x-safety-secret': safetyEngineSecret,
          },
        },
      ).toPromise();
    } catch (error) {
      console.error('Failed to notify Safety Engine:', error instanceof Error ? error.message : String(error));
      // Don't fail the flag operation if Safety Engine is unavailable
    }
  }

  private async cleanupRecording(sessionRecordId: string): Promise<void> {
    await this.prisma.auditEvent.create({
      data: {
        sessionRecordId,
        eventType: 'RECORDING_STOPPED',
        severity: 'INFO',
        actorRole: 'system',
        eventData: { action: 'cleanup_initiated' },
      },
    });
  }
}