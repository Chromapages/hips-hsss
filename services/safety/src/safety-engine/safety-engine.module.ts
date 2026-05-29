import { Module } from '@nestjs/common';
import { SafetyEngineService } from './safety-engine.service.js';
import { KeywordMonitorService } from './keyword-monitor.service.js';
import { EscalationQueueService } from './escalation-queue.service.js';
import { CrisisProtocolService } from './crisis-protocol.service.js';
import { SafetyEngineController } from './safety-engine.controller.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  providers: [
    PrismaService,
    SafetyEngineService,
    KeywordMonitorService,
    EscalationQueueService,
    CrisisProtocolService,
  ],
  controllers: [SafetyEngineController],
  exports: [
    SafetyEngineService,
    KeywordMonitorService,
    EscalationQueueService,
    CrisisProtocolService,
  ],
})
export class SafetyEngineModule {}