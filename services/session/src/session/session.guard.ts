import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtVerify } from 'jose';

@Injectable()
export class SessionGuard implements CanActivate {
  private readonly secret: Uint8Array;

  constructor(private configService: ConfigService) {
    const secretStr = this.configService.get<string>('SESSION_SERVICE_SECRET');
    if (!secretStr) {
      throw new Error('SESSION_SERVICE_SECRET environment variable is required');
    }
    this.secret = new TextEncoder().encode(secretStr);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid session token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(token, this.secret);
      
      // Inject the session reference into the request for use in controllers
      request['sessionRef'] = payload.ref;
      
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session token');
    }
  }
}
