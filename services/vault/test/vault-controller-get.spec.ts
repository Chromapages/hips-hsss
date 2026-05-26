import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VaultController } from '../src/vault/vault.controller.js';
import { VaultService } from '../src/vault/vault.service.js';

describe('VaultController - GET /records/:ref', () => {
  let controller: VaultController;
  let mockVaultService: Partial<VaultService>;
  let mockConfigService: { get: (key: string) => string | null };

  const VAULT_SECRET = 'test-vault-secret-123';

  beforeEach(() => {
    mockVaultService = {
      getRecord: vi.fn().mockResolvedValue({
        subjectRef: 'subject-001',
        realName: 'John Doe',
        emergencyContact: '+1-555-123-4567',
        region: 'US-WEST',
        disclosure: null,
        ipAddress: null,
        deviceFingerprint: null,
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

  it('should decrypt and return plaintext to authorized callers', async () => {
    const result = await controller.getRecord(
      'subject-001',
      VAULT_SECRET,
      'admin-user',
      'ADMIN_ACCESS'
    );

    expect(result).toBeDefined();
    expect(result.realName).toBe('John Doe');
    expect(result.emergencyContact).toBe('+1-555-123-4567');
    expect(mockVaultService.getRecord).toHaveBeenCalledWith(
      'subject-001',
      'admin-user',
      'ADMIN_ACCESS'
    );
  });

  it('should log access before returning data', async () => {
    await controller.getRecord(
      'subject-001',
      VAULT_SECRET,
      'facilitator-01',
      'SESSION_INIT'
    );

    // The service should have logged the access
    expect(mockVaultService.getRecord).toHaveBeenCalledWith(
      'subject-001',
      'facilitator-01',
      'SESSION_INIT'
    );
  });

  it('should reject requests without vault secret', async () => {
    await expect(
      controller.getRecord('subject-001', undefined, 'admin', 'ADMIN_ACCESS')
    ).rejects.toThrow('Invalid vault secret');
  });

  it('should reject requests with invalid vault secret', async () => {
    await expect(
      controller.getRecord('subject-001', 'wrong-secret', 'admin', 'ADMIN_ACCESS')
    ).rejects.toThrow('Invalid vault secret');
  });

  it('should include optional fields when present', async () => {
    (mockVaultService.getRecord as any).mockResolvedValueOnce({
      subjectRef: 'subject-002',
      realName: 'Jane Smith',
      emergencyContact: '+1-555-987-6543',
      region: 'US-EAST',
      disclosure: 'HIPAA consent given',
      ipAddress: '192.168.1.100',
      deviceFingerprint: 'fp-xyz789',
    });

    const result = await controller.getRecord(
      'subject-002',
      VAULT_SECRET,
      'admin',
      'ADMIN_ACCESS'
    );

    expect(result.disclosure).toBe('HIPAA consent given');
    expect(result.ipAddress).toBe('192.168.1.100');
    expect(result.deviceFingerprint).toBe('fp-xyz789');
  });

  it('should throw NotFoundException for unknown subject', async () => {
    (mockVaultService.getRecord as any).mockRejectedValueOnce(
      new Error('Identity record not found')
    );

    await expect(
      controller.getRecord('unknown-ref', VAULT_SECRET, 'admin', 'ADMIN_ACCESS')
    ).rejects.toThrow();
  });
});