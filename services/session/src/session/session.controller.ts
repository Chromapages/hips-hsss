import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { SessionGuard } from './session.guard.js';

@Controller('sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('livekit-token')
  @UseGuards(SessionGuard)
  async getLiveKitToken(@Req() req: any) {
    const sessionRef = req['sessionRef'];
    // The SessionGuard has already verified the token and extracted the sessionRef.
    // We now issue a LiveKit token for this session reference.
    return this.sessionService.issueLiveKitToken(sessionRef);
  }
}
