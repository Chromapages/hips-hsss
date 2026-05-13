import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { SessionPrismaService } from '../common/prisma';
import { SessionSecretGuard } from '../common/guards';
import { TokenModule } from '../token';
import { FirestoreModule } from '../firestore/firestore.module';
import { SessionTokenGuard } from '../session/session-token.guard';

@Module({
  imports: [TokenModule, FirestoreModule],
  controllers: [GroupController],
  providers: [GroupService, SessionPrismaService, SessionSecretGuard, SessionTokenGuard],
  exports: [GroupService],
})
export class GroupModule {}
