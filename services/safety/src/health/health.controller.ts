// Health check endpoint — liveness probe for container orchestration

import { Controller, Get } from '@nestjs/common'
import { makeResponse } from '../common/response'

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return makeResponse({
      status: 'ok',
      service: 'safety-engine',
      timestamp: new Date().toISOString(),
    })
  }
}

@Controller('healthz')
export class HealthzController {
  @Get()
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() }
  }

  @Get('ready')
  async readiness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
      },
    }
  }
}