import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { SessionPrismaService } from '../common/prisma';
import { SessionSecretGuard } from '../common/guards';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('SESSION_SERVICE_SECRET');
        if (!secret) {
          throw new Error('SESSION_SERVICE_SECRET is required');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '4h', // Short-lived token for session access
          },
        };
      },
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService, SessionPrismaService, SessionSecretGuard],
  exports: [TokenService],
})
export class TokenModule {}
