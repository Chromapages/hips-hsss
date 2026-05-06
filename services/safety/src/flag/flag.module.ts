import { Module } from '@nestjs/common'
import { FlagController } from './flag.controller'
import { FlagService } from './flag.service'
import { EscalationModule } from '../escalation/escalation.module'

@Module({
  imports: [EscalationModule],
  controllers: [FlagController],
  providers: [FlagService],
  exports: [FlagService],
})
export class FlagModule {}