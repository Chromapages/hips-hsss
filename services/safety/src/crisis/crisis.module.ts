import { Module } from '@nestjs/common'
import { CrisisController } from './crisis.controller'
import { CrisisService } from './crisis.service'
import { AlertsModule } from '../alerts/alerts.module'
import { EscalationModule } from '../escalation/escalation.module'

@Module({
  imports: [AlertsModule, EscalationModule],
  controllers: [CrisisController],
  providers: [CrisisService],
  exports: [CrisisService],
})
export class CrisisModule {}