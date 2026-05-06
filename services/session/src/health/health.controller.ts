import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '../common/dto/session.dto';

@Controller('health')
export class HealthController {
  @Get()
  health(): ApiResponse<{ status: string; timestamp: string }> {
    return {
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: 'health-check',
      },
    };
  }

  @Get('ready')
  ready(): ApiResponse<{ ready: boolean; services: Record<string, string> }> {
    return {
      data: {
        ready: true,
        services: {
          session: 'ok',
          database: 'ok',
          webrtc: 'ok',
        },
      },
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: 'readiness-check',
      },
    };
  }
}

@Controller('healthz')
export class HealthzController {
  @Get()
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  readiness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        session: 'ok',
        database: 'ok',
        webrtc: 'ok',
      },
    };
  }
}