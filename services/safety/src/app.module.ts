import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SafetyModule } from './safety/safety.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        limit: 200,
        ttl: 60000,
      },
    ]),
    SafetyModule,
  ],
})
export class AppModule {}