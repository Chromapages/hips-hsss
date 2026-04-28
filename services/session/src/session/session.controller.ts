import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service.js';

@Controller('sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('token')
  async issueToken(
    @Body('sessionId') sessionId: string,
    @Headers('authorization') authHeader: string
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const firebaseToken = authHeader.split('Bearer ')[1];
    if (!firebaseToken) {
      throw new UnauthorizedException('Invalid token format');
    }
    
    return this.sessionService.issueSessionToken(sessionId, firebaseToken);
  }
}
