import { Module } from '@nestjs/common';
import { HealthController, HealthzController } from './health.controller';
import { SessionPrismaService } from '../common/prisma';

@Module({
  controllers: [HealthController, HealthzController],
  providers: [SessionPrismaService],
})
export class HealthModule {}