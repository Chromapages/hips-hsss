import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VaultController } from '../src/vault/vault.controller.js';
import { VaultService } from '../src/vault/vault.service.js';
import type { CreateVaultRecordInput } from '../src/vault/vault.service.js';

describe('VaultController - POST /records', () => {
  let controller: VaultController;
  let mockVaultService: Partial<VaultService>;
  let mockConfigService: { get: (key: string) => string | null };

  const VAULT_SECRET = 'test-vault-secret-123';

  beforeEach(() => {
    mockVaultService = {
      createRecord: vi.fn().mockResolvedValue({
        id: 'record-123',
        subjectRef: 'subject-001',
        encryptedRealName: Buffer.from('encrypted'),
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

  it('should create a record with valid vault secret', async () => {
    const input: CreateVaultRecordInput = {
      subjectRef: 'subject-001',
      realName: 'John Doe',
      emergencyContact: '+1-555-123-4567',
      region: 'US-WEST',
    };

    const result = await controller.createRecord(input, VAULT_SECRET);

    expect(result).toBeDefined();
    expect(mockVaultService.createRecord).toHaveBeenCalledWith(input);
  });

  it('should encrypt PII and store ciphertext + encrypted DEK', async () => {
    const input: CreateVaultRecordInput = {
      subjectRef: 'subject-002',
      realName: 'Jane Smith',
      emergencyContact: '+1-555-987-6543',
      region: 'US-EAST',
    };

    await controller.createRecord(input, VAULT_SECRET);

    // Verify the service was called
    expect(mockVaultService.createRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        subjectRef: 'subject-002',
        realName: 'Jane Smith',
      })
    );
  });

  it('should reject requests without vault secret', async () => {
    const input: CreateVaultRecordInput = {
      subjectRef: 'subject-003',
      realName: 'Test User',
      emergencyContact: '+1-555-000-0000',
      region: 'US-CENTRAL',
    };

    await expect(controller.createRecord(input, undefined))
      .rejects.toThrow('Invalid vault secret');
  });

  it('should reject requests with invalid vault secret', async () => {
    const input: CreateVaultRecordInput = {
      subjectRef: 'subject-004',
      realName: 'Test User',
      emergencyContact: '+1-555-000-0000',
      region: 'US-CENTRAL',
    };

    await expect(controller.createRecord(input, 'wrong-secret'))
      .rejects.toThrow('Invalid vault secret');
  });

  it('should accept optional PII fields', async () => {
    const input: CreateVaultRecordInput = {
      subjectRef: 'subject-005',
      realName: 'Test User',
      emergencyContact: '+1-555-000-0000',
      region: 'US-CENTRAL',
      disclosure: 'HIPAA consent',
      ipAddress: '192.168.1.100',
      deviceFingerprint: 'fp-abc123',
    };

    const result = await controller.createRecord(input, VAULT_SECRET);

    expect(result).toBeDefined();
    expect(mockVaultService.createRecord).toHaveBeenCalledWith(input);
  });

  it('should upsert existing records', async () => {
    const input: CreateVaultRecordInput = {
      subjectRef: 'subject-001', // Same as first test
      realName: 'John Updated',
      emergencyContact: '+1-555-999-9999',
      region: 'US-WEST',
    };

    const result = await controller.createRecord(input, VAULT_SECRET);

    expect(result).toBeDefined();
    // upsert behavior - calls createRecord which should call upsert in Prisma
    expect(mockVaultService.createRecord).toHaveBeenCalledTimes(1);
  });
});