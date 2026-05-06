import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get sessionServiceUrl(): string {
    return this.configService.get<string>('SESSION_SERVICE_URL', 'http://localhost:3001');
  }

  get sessionServiceSecret(): string {
    return this.configService.get<string>('SESSION_SERVICE_SECRET', '');
  }

  get sessionDatabaseUrl(): string {
    return this.configService.get<string>('SESSION_DATABASE_URL', '');
  }

  get liveKitUrl(): string {
    return this.configService.get<string>('LIVEKIT_URL', '');
  }

  get liveKitApiKey(): string {
    return this.configService.get<string>('LIVEKIT_API_KEY', '');
  }

  get liveKitApiSecret(): string {
    return this.configService.get<string>('LIVEKIT_API_SECRET', '');
  }

  get liveKitMaxParticipants(): number {
    return this.configService.get<number>('LIVEKIT_MAX_PARTICIPANTS', 12);
  }

  get safetyEngineUrl(): string {
    return this.configService.get<string>('SAFETY_ENGINE_URL', 'http://localhost:3003');
  }

  get safetyEngineSecret(): string {
    return this.configService.get<string>('SAFETY_ENGINE_SECRET', '');
  }

  get sessionIdleTimeoutMinutes(): number {
    return this.configService.get<number>('SESSION_IDLE_TIMEOUT_MINUTES', 10);
  }
}