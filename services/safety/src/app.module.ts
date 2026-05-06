import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { EscalationModule } from './escalation/escalation.module'
import { FlagModule } from './flag/flag.module'
import { KeywordModule } from './keywords/keyword.module'
import { CrisisModule } from './crisis/crisis.module'
import { AlertsModule } from './alerts/alerts.module'

@Module({
  imports: [
    HealthModule,
    EscalationModule,
    FlagModule,
    KeywordModule,
    CrisisModule,
    AlertsModule,
  ],
})
export class AppModule {}