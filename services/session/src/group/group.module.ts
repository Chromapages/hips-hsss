import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { SessionPrismaService } from '../common/prisma';
import { SessionSecretGuard } from '../common/guards';
import { TokenModule } from '../token';
import { FirestoreModule } from '../firestore/firestore.module';

@Module({
  imports: [TokenModule, FirestoreModule],
  controllers: [GroupController],
  providers: [GroupService, SessionPrismaService, SessionSecretGuard],
  exports: [GroupService],
})
export class GroupModule {}