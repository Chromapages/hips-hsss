import { Module } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { SessionController } from './session.controller.js';
import { SessionTokenController } from './session-token.controller.js';
import { SessionTokenService } from './session-token.service.js';
import { SessionTokenStore } from '../session-token-store.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  providers: [SessionService, SessionTokenService, PrismaService, SessionTokenStore],
  controllers: [SessionController, SessionTokenController],
  exports: [SessionService, SessionTokenService],
})
export class SessionModule {}
