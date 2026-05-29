import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VaultAccessController } from '../src/vault/vault-access.controller.js';
import { VaultEmergencyContactController } from '../src/vault/vault-access.controller.js';
import { VaultService } from '../src/vault/vault.service.js';
import type { VaultAccessRequestInput } from '../src/vault/vault.service.js';

const VAULT_SECRET = 'test-vault-secret-123';

describe('VaultAccessController - POST /vault/access-request', () => {
  let controller: VaultAccessController;
  let mockVaultService: Partial<VaultService>;
  let mockConfigService: { get: (key: string) => string | null };

  beforeEach(() => {
    mockVaultService = {
      submitAccessRequest: vi.fn().mockResolvedValue({
        id: 'req-123',
        subjectRef: 'subject-001',
        requesterRef: 'participant-001',
        justification: 'I am experiencing a mental health crisis and need emergency access.',
        status: 'PENDING',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };

    mockConfigService = {
      get: vi.fn((key: string) => {
        if (key === 'VAULT_API_SECRET') return VAULT_SECRET;
        return null;
      }),
    };

    controller = new VaultAccessController(
      mockVaultService as VaultService,
      mockConfigService as any
    );
  });

  it('should submit access request with valid secret', async () => {
    const input: VaultAccessRequestInput = {
      subjectRef: 'subject-001',
      requesterRef: 'participant-001',
      justification: 'I am experiencing a mental health crisis and need emergency access to my emergency contact.',
    };

    const result = await controller.submitAccessRequest(input, VAULT_SECRET);

    expect(result).toBeDefined();
    expect(result.id).toBe('req-123');
    expect(result.status).toBe('PENDING');
    expect(mockVaultService.submitAccessRequest).toHaveBeenCalledWith(input);
  });

  it('should store justification for crisis protocol review', async () => {
    const input: VaultAccessRequestInput = {
      subjectRef: 'subject-002',
      requesterRef: 'participant-002',
      justification: 'Crisis situation — facilitating emergency contact retrieval.',
    };

    await controller.submitAccessRequest(input, VAULT_SECRET);

    expect(mockVaultService.submitAccessRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        justification: expect.stringContaining('Crisis'),
      })
    );
  });

  it('should reject requests without vault secret', async () => {
    const input: VaultAccessRequestInput = {
      subjectRef: 'subject-001',
      requesterRef: 'participant-001',
      justification: 'test',
    };

    await expect(controller.submitAccessRequest(input, undefined))
      .rejects.toThrow('Invalid vault secret');
  });

  it('should reject requests with invalid vault secret', async () => {
    const input: VaultAccessRequestInput = {
      subjectRef: 'subject-001',
      requesterRef: 'participant-001',
      justification: 'test',
    };

    await expect(controller.submitAccessRequest(input, 'wrong-secret'))
      .rejects.toThrow('Invalid vault secret');
  });
});

describe('VaultEmergencyContactController - POST /vault/emergency-contact', () => {
  let controller: VaultEmergencyContactController;
  let mockVaultService: Partial<VaultService>;
  let mockConfigService: { get: (key: string) => string | null };

  beforeEach(() => {
    mockVaultService = {
      accessEmergencyContact: vi.fn().mockResolvedValue({
        subjectRef: 'subject-001',
        emergencyContact: '+1-555-123-4567',
        accessedAt: new Date().toISOString(),
      }),
    };

    mockConfigService = {
      get: vi.fn((key: string) => {
        if (key === 'VAULT_API_SECRET') return VAULT_SECRET;
        return null;
      }),
    };

    controller = new VaultEmergencyContactController(
      mockVaultService as VaultService,
      mockConfigService as any
    );
  });

  it('should retrieve emergency contact with valid access request', async () => {
    const result = await controller.accessEmergencyContact(
      { subjectRef: 'subject-001', accessRequestId: 'req-123' },
      VAULT_SECRET,
      'crisis-reviewer-001',
      'Approved for crisis situation'
    );

    expect(result).toBeDefined();
    expect(result.emergencyContact).toBe('+1-555-123-4567');
    expect(mockVaultService.accessEmergencyContact).toHaveBeenCalledWith(
      'subject-001',
      'req-123',
      'crisis-reviewer-001',
      'Approved for crisis situation'
    );
  });

  it('should reject requests without vault secret', async () => {
    await expect(
      controller.accessEmergencyContact(
        { subjectRef: 'subject-001', accessRequestId: 'req-123' },
        undefined,
        'crisis-reviewer-001',
        'Approved'
      )
    ).rejects.toThrow('Invalid vault secret');
  });

  it('should reject requests without actor query param', async () => {
    await expect(
      controller.accessEmergencyContact(
        { subjectRef: 'subject-001', accessRequestId: 'req-123' },
        VAULT_SECRET,
        '',
        'Approved'
      )
    ).rejects.toThrow('actor and justification query params are required');
  });

  it('should reject requests without justification query param', async () => {
    await expect(
      controller.accessEmergencyContact(
        { subjectRef: 'subject-001', accessRequestId: 'req-123' },
        VAULT_SECRET,
        'crisis-reviewer-001',
        ''
      )
    ).rejects.toThrow('actor and justification query params are required');
  });
});
