import { Injectable, OnModuleInit, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { LiveKitTokenService } from '../livekit-token-service.js';
import { PrismaService } from '../prisma.service.js';
import type { AnonymousLiveSessionToken } from '@hips/types';

interface CreateSessionOptions {
  ownerUid: string;
  startsAt: Date;
  endsAt: Date;
  participantLimit?: number;
}

@Injectable()
export class SessionService implements OnModuleInit {
  private livekitService!: LiveKitTokenService;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('LIVEKIT_API_KEY');
    const apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET');

    if (!apiKey || !apiSecret) {
      console.warn('LiveKit credentials missing. Token issuance will fail.');
      return;
    }

    this.livekitService = new LiveKitTokenService({
      apiKey,
      apiSecret,
      durationSeconds: 3600 * 2, // 2 hours
    });
  }

  /**
   * Create a new session record in the database.
   */
  async createSession(opts: CreateSessionOptions): Promise<{
    id: string;
    sessionTokenRef: string;
    status: string;
  }> {
    const sessionId = randomUUID();
    // sessionTokenRef is the opaque reference callers use for join token requests
    const sessionTokenRef = `sess_${randomUUID().replace(/-/g, '').slice(0, 20)}`;

    const record = await this.prisma.sessionRecord.create({
      data: {
        id: sessionId,
        sessionId: sessionTokenRef,
        // ownerUid maps to anonymousParticipantId in the schema
        anonymousParticipantId: opts.ownerUid,
        status: 'PENDING',
        startsAt: opts.startsAt,
        endsAt: opts.endsAt,
      },
    });

    return {
      id: record.id,
      sessionTokenRef: record.sessionId,
      status: record.status,
    };
  }

  /**
   * Issue a LiveKit token using a session ID (UUID, not sessionTokenRef).
   * Returns the full AnonymousLiveSessionToken for the session controller.
   */
  async issueLiveKitToken(sessionId: string): Promise<AnonymousLiveSessionToken> {
    const session = await this.prisma.sessionRecord.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid session ID');
    }

    if (!this.livekitService) {
      throw new UnauthorizedException('LiveKit not configured');
    }

    const tokenData = this.livekitService.issue(session.id);

    console.log(`[SessionService] Issued LiveKit token for session ${sessionId}. No user identity linkage.`);

    return tokenData;
  }

  /**
   * Issue LiveKit token by opaque sessionTokenRef (legacy path).
   */
  async issueLiveKitTokenByRef(sessionRef: string): Promise<AnonymousLiveSessionToken> {
    const session = await this.prisma.sessionRecord.findUnique({
      where: { sessionId: sessionRef },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid session reference');
    }

    if (!this.livekitService) {
      throw new UnauthorizedException('LiveKit not configured');
    }

    const tokenData = this.livekitService.issue(session.id);

    console.log(`[SessionService] Issued LiveKit token for sessionRef ${sessionRef}. No user identity linkage.`);

    return tokenData;
  }

  /**
   * Transition session to ACTIVE status.
   */
  async activateSession(sessionId: string): Promise<void> {
    await this.prisma.sessionRecord.update({
      where: { id: sessionId },
      data: { status: 'ACTIVE' },
    });
  }

  /**
   * Transition session to ENDED status.
   */
  async endSession(sessionId: string): Promise<void> {
    await this.prisma.sessionRecord.update({
      where: { id: sessionId },
      data: { status: 'ENDED' },
    });
  }
}