import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LiveKitTokenService } from '../livekit-token-service.js';
import { PrismaService } from '../prisma.service.js';

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
   * Issues a LiveKit token using an opaque session reference.
   * This is the final step in the Hard Anonymity Bridge.
   */
  async issueLiveKitToken(sessionRef: string) {
    // 1. Verify that the sessionRef exists in our database
    const session = await this.prisma.session.findUnique({
      where: { sessionTokenRef: sessionRef },
    });

    if (!session) {
      throw new Error('Invalid session reference');
    }

    // 2. Issue the LiveKit token
    // We use the session.id (UUID) as the room identifier.
    // The participant identity is randomized within the livekitService.
    const tokenData = this.livekitService.issue(session.id);

    console.log(`[SessionService] Issued LiveKit token for sessionRef ${sessionRef}. No user identity linkage.`);

    return tokenData;
  }
}
