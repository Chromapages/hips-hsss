import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PrismaService } from '../prisma.service.js';

const VAULT_SECRET_HEADER = 'x-vault-secret';

/**
 * Vault API Authentication Guard
 *
 * Validates the X-Vault-Secret header against VAULT_API_SECRET.
 * Logs all auth failures to VaultAccessLog with action=AUTH_FAILURE.
 *
 * Applied to all vault routes that require service-to-service auth.
 */
@Injectable()
export class VaultAuthGuard implements CanActivate {
  private readonly logger = new Logger(VaultAuthGuard.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.headers[VAULT_SECRET_HEADER] as string | undefined;
    const expectedSecret = this.configService.get<string>('VAULT_API_SECRET');

    // Validate secret
    if (!secret || secret !== expectedSecret) {
      await this.logAuthFailure(request, 'INVALID_SECRET');
      throw new UnauthorizedException('Invalid vault secret');
    }

    return true;
  }

  private async logAuthFailure(request: Request, failureReason: string): Promise<void> {
    try {
      // Extract client IP for logging (without x-forwarded-for here - that's middleware concern)
      const clientIp = request.ip || request.socket.remoteAddress || 'unknown';

      await this.prisma.vaultAccessLog.create({
        data: {
          subjectRef: 'AUTH_FAILURE',
          actorRef: clientIp,
          purpose: failureReason,
          action: 'AUTH_FAILURE',
          metadata: {
            failureReason,
            userAgent: request.headers['user-agent'] || 'unknown',
            path: request.path,
          },
        },
      });
    } catch (error) {
      // Auth logging should never break auth check - log error but continue
      this.logger.error('Failed to log auth failure', error);
    }
  }
}