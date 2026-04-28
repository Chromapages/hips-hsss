import { Controller, Post, Get, Body, Param, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { VaultService } from './vault.service.js';
import type { CreateVaultRecordInput, VaultAccessInput } from './vault.service.js';
import { ConfigService } from '@nestjs/config';

@Controller('records')
export class VaultController {
  constructor(
    private vaultService: VaultService,
    private configService: ConfigService
  ) {}

  private validateSecret(secret: string | undefined) {
    const expectedSecret = this.configService.get<string>('VAULT_API_SECRET');
    if (!secret || secret !== expectedSecret) {
      throw new UnauthorizedException('Invalid vault secret');
    }
  }

  @Post()
  async createRecord(
    @Body() data: CreateVaultRecordInput,
    @Headers('x-vault-secret') secret?: string
  ) {
    this.validateSecret(secret);
    return this.vaultService.createRecord(data);
  }

  @Get(':ref')
  async getRecord(
    @Param('ref') subjectRef: string,
    @Headers('x-vault-secret') secret: string,
    @Query('actor') actor: string,
    @Query('purpose') purpose: string
  ) {
    this.validateSecret(secret);
    return this.vaultService.getRecord(subjectRef, actor, purpose);
  }

  @Post('access-log')
  async logAccess(
    @Body() data: VaultAccessInput,
    @Headers('x-vault-secret') secret: string
  ) {
    this.validateSecret(secret);
    return this.vaultService.logAccess(data);
  }
}
