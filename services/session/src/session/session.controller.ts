import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  HttpCode,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { getAdminAuth } from '../firebase-init.js';
import { SessionService } from './session.service.js';
import { SessionTokenStore } from '../session-token-store.js';
import { PrismaService } from '../prisma.service.js';
import { hashOwnerUid } from './anonymisation.js';

/** Firebase-authenticated request */
interface AuthRequest extends Request {
  userId?: string;
}

/** ─── DTOs ─────────────────────────────────────────────────── */

interface CreateSessionBody {
  startsAt: string;
  endsAt: string;
  participantLimit?: number;
}

interface JoinBody {
  sessionId: string;
}

interface FlagBody {
  reason?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, unknown>;
}

interface ReconnectBody {
  sessionId: string;
}

/** ─── Response shapes ─────────────────────────────────────── */

interface LiveKitTokenResponse {
  jwt: string;
  roomName: string;
  anonymousIdentity: string;
  expiresAt: string;
  avatar: { style: number; palette: string; gesture: string };
}

interface SessionResponse {
  id: string;
  status: string;
  startsAt: string;
  endsAt: string;
  participantCount: number;
}

interface ReconnectResponse {
  reconnectUntil: string;
  canReconnect: boolean;
}

/** ─── Controller ──────────────────────────────────────────── */

@Controller('api/sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly prisma: PrismaService,
    private readonly tokenStore: SessionTokenStore,
  ) {}

  /**
   * POST /api/sessions — create a new session
   */
  @Post()
  @HttpCode(201)
  async createSession(
    @Body() body: CreateSessionBody,
    @Req() req: AuthRequest,
  ): Promise<{ id: string; sessionTokenRef: string; status: string }> {
    const userId = await this.requireAuth(req);
    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(body.endsAt);

    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      throw new UnauthorizedException('Invalid date format in startsAt or endsAt');
    }

    if (endsAt <= startsAt) {
      throw new UnauthorizedException('endsAt must be after startsAt');
    }

    // Create session via the session service
    // Enforce participantLimit upper bound to prevent resource exhaustion
    const participantLimit = Math.min(Math.max(body.participantLimit ?? 2, 2), 10);
    const session = await this.sessionService.createSession({
      ownerUid: userId,
      startsAt,
      endsAt,
      participantLimit,
    });

    return session;
  }

  /**
   * GET /api/sessions/:id — get session state
   */
  @Get(':id')
  async getSession(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<SessionResponse> {
    const userId = await this.requireAuth(req);
    const session = await this.loadAndAuthorize(id, userId);

    return {
      id: session.id,
      status: session.status,
      startsAt: session.startsAt.toISOString(),
      endsAt: session.endsAt.toISOString(),
      participantCount: 0,
    };
  }

  /**
   * POST /api/sessions/:id/join — get LiveKit token for session
   * Only issues tokens for PENDING (pre-join window) or ACTIVE sessions.
   */
  @Post(':id/join')
  @HttpCode(200)
  async joinSession(
    @Param('id') sessionId: string,
    @Req() req: AuthRequest,
  ): Promise<LiveKitTokenResponse> {
    const userId = await this.requireAuth(req);
    const session = await this.loadAndAuthorize(sessionId, userId);

    // Only allow joining PENDING or ACTIVE sessions; ENDED/EXPIRED sessions cannot be joined
    if (session.status !== 'PENDING' && session.status !== 'ACTIVE') {
      throw new BadRequestException(`Cannot join session in status ${session.status}`);
    }

    const token = await this.sessionService.issueLiveKitToken(sessionId);

    return {
      jwt: token.jwt,
      roomName: token.roomName,
      anonymousIdentity: token.anonymousIdentity,
      expiresAt: token.expiresAt.toISOString(),
      avatar: {
        style: token.avatar.style,
        palette: token.avatar.palette,
        gesture: token.avatar.gesture,
      },
    };
  }

  /**
   * POST /api/sessions/:id/end — end a session
   */
  @Post(':id/end')
  @HttpCode(200)
  async endSession(
    @Param('id') sessionId: string,
    @Req() req: AuthRequest,
  ): Promise<{ status: string; endedAt: string }> {
    const userId = await this.requireAuth(req);
    await this.loadAndAuthorize(sessionId, userId);

    // Reject end-before-start and double-end transitions.
    const session = await this.prisma.sessionRecord.findUnique({ where: { id: sessionId } });
    if (session?.status === 'PENDING' || session?.status === 'ENDED') {
      throw new ForbiddenException(`Cannot end session in status ${session.status}`);
    }

    const updated = await this.prisma.sessionRecord.update({
      where: { id: sessionId },
      data: { status: 'ENDED' },
    });

    return {
      status: updated.status,
      endedAt: new Date().toISOString(),
    };
  }

  /**
   * POST /api/sessions/:id/flag — flag/report a session
   */
  @Post(':id/flag')
  @HttpCode(200)
  async flagSession(
    @Param('id') sessionId: string,
    @Body() body: FlagBody,
    @Req() req: AuthRequest,
  ): Promise<{ flagged: boolean; flagId: string }> {
    const userId = await this.requireAuth(req);
    await this.loadAndAuthorize(sessionId, userId);

    const flagId = `flag_${randomUUID()}`;

    await this.prisma.auditEvent.create({
      data: {
        id: flagId,
        eventType: 'SAFETY_FLAGGED',
        subjectId: sessionId,
        metadata: {
          reporterUid: userId,
          reason: body.reason ?? 'No reason provided',
          severity: body.severity ?? 'medium',
          metadata: (body.metadata ?? {}) as any,
          flaggedAt: new Date().toISOString(),
        },
      },
    });

    return { flagged: true, flagId };
  }

  /**
   * POST /api/sessions/:id/reconnect — handle session reconnect
   */
  @Post(':id/reconnect')
  @HttpCode(200)
  async reconnectSession(
    @Param('id') sessionId: string,
    @Body() _body: ReconnectBody,
    @Req() req: AuthRequest,
  ): Promise<ReconnectResponse> {
    const userId = await this.requireAuth(req);
    await this.loadAndAuthorize(sessionId, userId);

    const session = await this.prisma.sessionRecord.findUnique({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    const windowEnd = new Date(session.endsAt.getTime() + 10 * 60 * 1000);
    const now = new Date();
    const canReconnect = now < windowEnd;

    await this.prisma.auditEvent.create({
      data: {
        id: `reconnect_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        eventType: 'ROOM_JOINED',
        subjectId: sessionId,
        metadata: {
          participantUid: userId,
          action: 'reconnect',
          canReconnect,
          checkedAt: now.toISOString(),
        },
      },
    });

    return {
      reconnectUntil: windowEnd.toISOString(),
      canReconnect,
    };
  }

  /** ─── Auth helpers ────────────────────────────────────────── */

  private async requireAuth(req: AuthRequest): Promise<string> {
    const authHeader = (req.headers as Record<string, string | undefined>)['authorization'];
    const idToken = authHeader?.replace(/^Bearer\s+/i, '');

    if (!idToken) {
      throw new UnauthorizedException('Missing Firebase ID token');
    }

    let decodedIdToken: { uid: string };
    try {
      decodedIdToken = await getAdminAuth().verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException('Invalid Firebase ID token');
    }

    return decodedIdToken.uid;
  }

  /**
   * Load the session and assert the caller owns it.
   *
   * Authorization model (C4): only the session owner (facilitator who created the session)
   * may act on it. Participants are read-only participants — they join via joinSession
   * which issues LiveKit tokens without requiring session ownership.
   * The `anonymousParticipantId` field stores the owner's UID.
   */
  private async loadAndAuthorize(sessionId: string, userId: string) {
    const session = await this.prisma.sessionRecord.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    if (session.anonymousParticipantId !== hashOwnerUid(userId)) {
      throw new ForbiddenException('Not authorized for this session');
    }

    return session;
  }
}