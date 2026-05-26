import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CommerceController } from './commerce/commerce.controller.js';
import { CommerceService } from './commerce/commerce.service.js';
import { WebhooksController } from './webhooks/webhooks.controller.js';
import { PrismaService } from './prisma.service.js';
import { FirebaseAuthService } from './auth/firebase-auth.service.js';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [CommerceController, WebhooksController],
  providers: [
    CommerceService,
    PrismaService,
    FirebaseAuthService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}