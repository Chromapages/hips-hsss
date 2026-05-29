import { Controller, Post, Body, Headers, Query, UnauthorizedException } from '@nestjs/common';
import { VaultService } from './vault.service.js';
import type { VaultAccessRequestInput } from './vault.service.js';
import { ConfigService } from '@nestjs/config';

@Controller('access-request')
export class VaultAccessController {
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

  /**
   * Phase 6.7 — Vault Access Request Flow
   *
   * Participant submits justification for emergency access to their vault record.
   * POST /vault/access-request
   * Body: { subjectRef, requesterRef, justification }
   */
  @Post()
  async submitAccessRequest(
    @Body() data: VaultAccessRequestInput,
    @Headers('x-vault-secret') secret: string
  ) {
    this.validateSecret(secret);
    return this.vaultService.submitAccessRequest(data);
  }
}

@Controller('emergency-contact')
export class VaultEmergencyContactController {
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

  /**
   * Phase 6.7 — Vault Access Request Flow
   *
   * Authenticate an approved access request and retrieve the emergency contact
   * by decrypting via KMS. Logs to VaultAccessLog (INSERT only, immutable).
   * POST /vault/emergency-contact
   * Body: { subjectRef, accessRequestId }
   * Query: actor, justification (both required)
   */
  @Post()
  async accessEmergencyContact(
    @Body() body: { subjectRef: string; accessRequestId: string },
    @Headers('x-vault-secret') secret: string,
    @Query('actor') actor: string,
    @Query('justification') justification: string
  ) {
    this.validateSecret(secret);
    if (!actor || !justification) {
      throw new UnauthorizedException('actor and justification query params are required');
    }
    return this.vaultService.accessEmergencyContact(
      body.subjectRef,
      body.accessRequestId,
      actor,
      justification
    );
  }
}
