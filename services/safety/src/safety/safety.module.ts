import { Module } from '@nestjs/common';
import { SafetyService } from './safety.service.js';
import { SafetyController } from './safety.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  providers: [SafetyService, PrismaService],
  controllers: [SafetyController],
  exports: [SafetyService],
})
export class SafetyModule {}
