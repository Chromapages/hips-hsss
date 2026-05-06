import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'
import { HealthzController } from './health.controller'

@Module({
  controllers: [HealthController, HealthzController],
})
export class HealthModule {}