import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { TokenModule } from './token/token.module';
import { GroupModule } from './group/group.module';
import { WebrtcModule } from './webrtc/webrtc.module';
import { HealthModule } from './health/health.module';
import { SessionConfigModule } from './common/config/config.module';

@Module({
  imports: [
    // Global configuration
    SessionConfigModule,

    // Rate limiting (30 req/min for session endpoints)
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: 60000,
            limit: 30,
          },
        ],
      }),
    }),

    // Feature modules
    SessionModule,
    TokenModule,
    GroupModule,
    WebrtcModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}