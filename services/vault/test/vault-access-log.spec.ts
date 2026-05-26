import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VaultController } from '../src/vault/vault.controller.js';
import { VaultService } from '../src/vault/vault.service.js';
import type { VaultAccessInput } from '../src/vault/vault.service.js';

describe('VaultController - POST /access-log', () => {
  let controller: VaultController;
  let mockVaultService: Partial<VaultService>;
  let mockConfigService: { get: (key: string) => string | null };

  const VAULT_SECRET = 'test-vault-secret-123';

  beforeEach(() => {
    mockVaultService = {
      logAccess: vi.fn().mockResolvedValue({
        id: 'log-123',
        subjectRef: 'subject-001',
        actorRef: 'admin-user',
        purpose: 'RECORD_READ',
        action: 'PII_ACCESS',
        metadata: {},
        timestamp: new Date(),
      }),
    };

    mockConfigService = {
      get: vi.fn((key: string) => {
        if (key === 'VAULT_API_SECRET') return VAULT_SECRET;
        return null;
      }),
    };

    controller = new VaultController(
      mockVaultService as VaultService,
      mockConfigService as any
    );
  });

  it('should create INSERT-only log entries', async () => {
    const input: VaultAccessInput = {
      subjectRef: 'subject-001',
      actorRef: 'admin-user',
      purpose: 'RECORD_READ',
      action: 'PII_ACCESS',
    };

    const result = await controller.logAccess(input, VAULT_SECRET);

    expect(result).toBeDefined();
    expect(result.id).toBe('log-123');
    expect(mockVaultService.logAccess).toHaveBeenCalledWith(input);
  });

  it('should accept optional metadata', async () => {
    const input: VaultAccessInput = {
      subjectRef: 'subject-002',
      actorRef: 'facilitator-01',
      purpose: 'SESSION_INIT',
      action: 'AUTH_VERIFY',
      metadata: {
        sessionId: 'sess-abc123',
        timestamp: '2024-01-15T10:30:00Z',
      },
    };

    const result = await controller.logAccess(input, VAULT_SECRET);

    expect(result).toBeDefined();
    expect(mockVaultService.logAccess).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          sessionId: 'sess-abc123',
        }),
      })
    );
  });

  it('should reject requests without vault secret', async () => {
    const input: VaultAccessInput = {
      subjectRef: 'subject-001',
      actorRef: 'admin-user',
      purpose: 'RECORD_READ',
    };

    await expect(controller.logAccess(input, undefined))
      .rejects.toThrow('Invalid vault secret');
  });

  it('should reject requests with invalid vault secret', async () => {
    const input: VaultAccessInput = {
      subjectRef: 'subject-001',
      actorRef: 'admin-user',
      purpose: 'RECORD_READ',
    };

    await expect(controller.logAccess(input, 'wrong-secret'))
      .rejects.toThrow('Invalid vault secret');
  });

  it('should log IP expiry events', async () => {
    const input: VaultAccessInput = {
      subjectRef: 'subject-001',
      actorRef: 'SYSTEM',
      purpose: 'RECORD_READ',
      action: 'IP_EXPIRY',
      metadata: { expiredAt: new Date().toISOString() },
    };

    await controller.logAccess(input, VAULT_SECRET);

    expect(mockVaultService.logAccess).toHaveBeenCalledWith(input);
  });

  it('should log device fingerprint expiry events', async () => {
    const input: VaultAccessInput = {
      subjectRef: 'subject-001',
      actorRef: 'SYSTEM',
      purpose: 'RECORD_READ',
      action: 'DEVICE_FINGERPRINT_EXPIRY',
      metadata: { expiredAt: new Date().toISOString() },
    };

    await controller.logAccess(input, VAULT_SECRET);

    expect(mockVaultService.logAccess).toHaveBeenCalledWith(input);
  });
});