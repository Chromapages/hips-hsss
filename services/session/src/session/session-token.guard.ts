import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../token';

@Injectable()
export class SessionTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token =
      request.headers['x-session-token'] ||
      (typeof authHeader === 'string' ? authHeader.replace(/^Bearer\s+/i, '') : undefined);

    if (!token || typeof token !== 'string' || token.length < 16) {
      throw new UnauthorizedException('Invalid session token');
    }

    const payload = await this.tokenService.validateSessionToken(token);
    const routeSessionId = request.params?.id;
    if (routeSessionId && payload.sessionRecordId !== routeSessionId && payload.roomId !== routeSessionId) {
      throw new ForbiddenException('Cross-session access denied');
    }

    request.sessionToken = {
      ...payload,
      role: 'participant',
    };

    return true;
  }
}
