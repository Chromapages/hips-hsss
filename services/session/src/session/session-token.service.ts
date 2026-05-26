import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { SessionTokenStore } from '../session-token-store.js';
import { PrismaService } from '../prisma.service.js';

const WINDOW_BEFORE_MINUTES = 10;
const WINDOW_AFTER_MINUTES = 10;

export interface SessionTokenOptions {
  sessionId: string;
  firebaseUid: string;
  now?: Date;
}

export interface SessionTokenResult {
  token: string;
}

/**
 * Core session-token business logic — fully synchronous/testable,
 * decoupled from the NestJS request pipeline.
 *
 * Security contract:
 * - The opaque token NEVER contains the Firebase UID.
 * - The firebase UID is stored server-side in SessionTokenStore as anonymousParticipantId.
 */
@Injectable()
export class SessionTokenService {
  constructor(
    private readonly tokenStore: SessionTokenStore,
    private readonly prismaService: PrismaService,
  ) {}

  async issueToken(opts: SessionTokenOptions): Promise<SessionTokenResult> {
    const now = opts.now ?? new Date();

    const session = await this.prismaService.session.findUnique({
      where: { sessionTokenRef: opts.sessionId },
    });

    if (!session) {
      throw new ForbiddenException('Session not found');
    }

    if (session.userId !== opts.firebaseUid) {
      throw new ForbiddenException('Caller does not own this session');
    }

    const windowStart = new Date(session.startsAt.getTime() - WINDOW_BEFORE_MINUTES * 60 * 1000);
    const windowEnd = new Date(session.endsAt.getTime() + WINDOW_AFTER_MINUTES * 60 * 1000);

    if (now < windowStart || now > windowEnd) {
      throw new ForbiddenException(
        `Token requests are only allowed from ${WINDOW_BEFORE_MINUTES} minutes before ` +
        `the session start until ${WINDOW_AFTER_MINUTES} minutes after the session ends`,
      );
    }

    const record = this.tokenStore.issue(session.id, opts.firebaseUid, windowEnd);

    return { token: record.token };
  }
}