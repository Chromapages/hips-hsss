import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { createHmac } from 'crypto';
import { SessionPrismaService } from '../common/prisma';
import {
  CreateSessionTokenInput,
  SessionTokenResponse,
  WebRTCConfig,
} from '../common/dto/session.dto';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: SessionPrismaService,
  ) {}

  async createSessionToken(input: CreateSessionTokenInput): Promise<SessionTokenResponse> {
    const bookingRefSecret = process.env.BOOKING_REF_SECRET;
    if (!bookingRefSecret) {
      throw new Error('BOOKING_REF_SECRET is required');
    }

    // Laptop-only enforcement (5.13)
    if (input.deviceType !== 'desktop') {
      throw new ForbiddenException(
        'Sessions are only available on desktop or laptop computers. Please access this session from a desktop device.',
      );
    }

    // Generate anonymous session token
    const anonSessionToken = this.generateAnonSessionToken();
    const roomId = uuidv4();

    // Create session record in session DB (never linked to commerce User ID)
    const sessionRecord = await this.prisma.sessionRecord.create({
      data: {
        anonSessionToken,
        sessionId: createHmac('sha256', bookingRefSecret)
          .update(input.sessionId)
          .digest('hex').slice(0, 32),
        roomId,
        status: 'LOBBY',
      },
    });

    // Log token issuance
    await this.prisma.auditEvent.create({
      data: {
        sessionRecordId: sessionRecord.id,
        eventType: 'TOKEN_ISSUED',
        severity: 'INFO',
        actorRole: 'system',
        eventData: {
          deviceType: input.deviceType,
          clientTimestamp: input.clientTimestamp,
        },
        deviceFingerprintHash: input.deviceFingerprintHash,
      },
    });

    // Generate JWT
    const token = this.jwtService.sign({
      anonSessionToken,
      sessionRecordId: sessionRecord.id,
      roomId,
      type: 'session_token',
    });

    return {
      token,
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
      roomId,
      webrtcConfig: this.getWebRTCConfig(),
    };
  }

  async validateSessionToken(token: string): Promise<{
    anonSessionToken: string;
    sessionRecordId: string;
    roomId: string;
  }> {
    try {
      const payload = this.jwtService.verify<{
        anonSessionToken: string;
        sessionRecordId: string;
        roomId: string;
        type: string;
      }>(token);

      if (payload.type !== 'session_token') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Verify session record exists and is active
      const sessionRecord = await this.prisma.sessionRecord.findUnique({
        where: { anonSessionToken: payload.anonSessionToken },
      });

      if (!sessionRecord) {
        throw new UnauthorizedException('Session not found');
      }

      if (sessionRecord.status === 'ENDED' || sessionRecord.status === 'ABANDONED') {
        throw new UnauthorizedException('Session has ended');
      }

      return {
        anonSessionToken: payload.anonSessionToken,
        sessionRecordId: payload.sessionRecordId,
        roomId: payload.roomId,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired session token');
    }
  }

  private generateAnonSessionToken(): string {
    // Generate a random token with session prefix
    const randomPart = uuidv4().replace(/-/g, '').substring(0, 24);
    return `hips_${randomPart}`;
  }

  private getWebRTCConfig(): WebRTCConfig {
    return {
      iceServers: this.getIceServers(),
      dtlsRole: 'client',
      maxParticipants: this.configService.get<number>('LIVEKIT_MAX_PARTICIPANTS', 12),
    };
  }

  private getIceServers(): RTCIceServer[] {
    const liveKitUrl = this.configService.get<string>('LIVEKIT_URL');

    const servers: RTCIceServer[] = [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
    ];

    // Add LiveKit TURN if configured (self-hosted in HIPAA VPC)
    if (liveKitUrl) {
      servers.push({
        urls: `${liveKitUrl}/turn`,
        username: this.configService.get<string>('LIVEKIT_API_KEY', ''),
        credential: this.configService.get<string>('LIVEKIT_API_SECRET', ''),
      });
    }

    return servers;
  }
}
