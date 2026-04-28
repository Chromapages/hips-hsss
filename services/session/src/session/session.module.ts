import { Module } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { SessionController } from './session.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  providers: [SessionService, PrismaService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
