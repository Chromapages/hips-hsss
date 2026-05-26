import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { VaultService } from './vault.service.js';
import { VaultController } from './vault.controller.js';
import { VaultCryptoService } from './vault-crypto.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [VaultService, VaultCryptoService, PrismaService],
  controllers: [VaultController],
  exports: [VaultService],
})
export class VaultModule {}
