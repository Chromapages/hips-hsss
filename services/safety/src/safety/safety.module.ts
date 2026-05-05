import { Module } from '@nestjs/common';
import { SafetyService } from './safety.service.js';
import { SafetyController } from './safety.controller.js';
import { SafetyEngine } from '../safety-engine.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  providers: [SafetyService, SafetyEngine, PrismaService],
  controllers: [SafetyController],
  exports: [SafetyService, SafetyEngine],
})
export class SafetyModule {}