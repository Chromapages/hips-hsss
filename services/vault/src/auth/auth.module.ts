import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { VaultAuthGuard } from './vault-auth.guard.js';
import { IpAllowlistMiddleware } from './ip-allowlist.middleware.js';

/**
 * Auth Module for Vault Service
 *
 * Provides authentication guards and middleware for the vault API.
 *
 * Guards:
 * - VaultAuthGuard: Validates X-Vault-Secret header
 *
 * Middleware:
 * - IpAllowlistMiddleware: Validates IP against VAULT_IP_ALLOWLIST
 *
 * Environment Variables:
 * - VAULT_API_SECRET: Required. The secret key for X-Vault-Secret header validation.
 * - VAULT_IP_ALLOWLIST: Optional. Comma-separated list of allowed IPs/CIDRs.
 *   Example: "10.0.0.0/8,192.168.1.1,::1"
 * - TRUST_X_FORWARDED_FOR: Optional. Set to "true" to trust x-forwarded-for header.
 *   Only enable when behind a trusted proxy/load balancer.
 */
@Module({
  imports: [ConfigModule],
  providers: [
    // Register VaultAuthGuard globally - applies to all routes by default
    // Use @SkipVaultAuth() decorator on routes that don't need it
    {
      provide: APP_GUARD,
      useClass: VaultAuthGuard,
    },
    IpAllowlistMiddleware,
  ],
  exports: [VaultAuthGuard, IpAllowlistMiddleware],
})
export class AuthModule {}