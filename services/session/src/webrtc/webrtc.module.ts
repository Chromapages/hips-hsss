import { Module } from '@nestjs/common';
import { SessionGateway } from './session.gateway';
import { WsAuthGuard } from './ws-auth.guard';
import { TokenModule } from '../token';
import { GroupModule } from '../group';
import { SessionPrismaService } from '../common/prisma';

@Module({
  imports: [TokenModule, GroupModule],
  providers: [SessionGateway, WsAuthGuard, SessionPrismaService],
  exports: [SessionGateway],
})
export class WebrtcModule {}