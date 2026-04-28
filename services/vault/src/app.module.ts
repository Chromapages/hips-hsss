import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VaultModule } from './vault/vault.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VaultModule,
  ],
})
export class AppModule {}
