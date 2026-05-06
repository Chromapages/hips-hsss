import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionPrismaService } from '../common/prisma';
import { SessionService } from '../session/session.service';

@Injectable()
export class AutoTeardownService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AutoTeardownService.name);
  private intervalHandle: NodeJS.Timeout | null = null;

  constructor(
    private prisma: SessionPrismaService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  onModuleInit() {
    // Check every minute for idle sessions
    this.intervalHandle = setInterval(() => {
      this.checkIdleSessions();
    }, 60000);

    this.logger.log('Auto-teardown service started');
  }

  onModuleDestroy() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
    this.logger.log('Auto-teardown service stopped');
  }

  private async checkIdleSessions() {
    try {
      const idleTimeoutMinutes = this.configService.get<number>('SESSION_IDLE_TIMEOUT_MINUTES', 10);
      const cutoffTime = new Date(Date.now() - idleTimeoutMinutes * 60 * 1000);

      // Find active sessions with no recent activity
      const idleSessions = await this.prisma.sessionRecord.findMany({
        where: {
          status: 'ACTIVE',
          startedAt: {
            lt: cutoffTime,
          },
        },
      });

      for (const session of idleSessions) {
        this.logger.log(`Auto-teardown idle session: ${session.id}`);
        await this.sessionService.autoTeardown(session.id);
      }
    } catch (error) {
      this.logger.error('Error checking idle sessions:', error);
    }
  }
}