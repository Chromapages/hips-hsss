import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { AutoTeardownService } from './auto-teardown.service';
import { TokenModule } from '../token';
import { SessionPrismaService } from '../common/prisma';
import { SessionSecretGuard } from '../common/guards';
import { SessionTokenGuard } from './session-token.guard';

@Module({
  imports: [TokenModule],
  controllers: [SessionController],
  providers: [
    SessionService,
    AutoTeardownService,
    SessionPrismaService,
    SessionSecretGuard,
    SessionTokenGuard,
  ],
  exports: [SessionService],
})
export class SessionModule {}
