import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class SessionSecretGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.headers['x-session-secret'] as string;
    const validSecret = this.configService.get<string>('SESSION_SERVICE_SECRET');

    if (!validSecret) {
      throw new UnauthorizedException('Session service not configured');
    }

    if (secret !== validSecret) {
      throw new UnauthorizedException('Invalid session secret');
    }

    return true;
  }
}