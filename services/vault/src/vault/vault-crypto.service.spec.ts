import 'reflect-metadata';
import { VaultCryptoService } from './vault-crypto.service.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ConfigService } from '@nestjs/config';

type MockKmsCommand = {
  KeySpec?: string;
};

vi.mock('@aws-sdk/client-kms', () => ({
  KMSClient: class {
    send = vi.fn().mockImplementation((command: MockKmsCommand) => {
      if (command.KeySpec === 'AES_256') {
        return Promise.resolve({
          Plaintext: Buffer.from('01234567890123456789012345678901'),
          CiphertextBlob: Buffer.from('mock-encrypted-dek'),
        });
      }
      return Promise.resolve({
        Plaintext: Buffer.from('01234567890123456789012345678901'),
      });
    });
  },
  GenerateDataKeyCommand: class {
    constructor(public params: Record<string, unknown>) {
      Object.assign(this, params);
    }
  },
  DecryptCommand: class {
    constructor(public params: Record<string, unknown>) {
      Object.assign(this, params);
    }
  },
}));

describe('VaultCryptoService', () => {
  let service: VaultCryptoService;
  let mockConfigService: Pick<ConfigService, 'get'>;

  beforeEach(() => {
    mockConfigService = {
      get: vi.fn((key: string) => {
        if (key === 'VAULT_KMS_KEY_ID') return 'mock-key-id';
        if (key === 'AWS_REGION') return 'us-east-1';
        return null;
      }),
    };

    service = new VaultCryptoService(mockConfigService as ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt and decrypt text correctly using mock KMS', async () => {
    const plaintext = 'Sensitive vault payload';
    const encrypted = await service.encrypt(plaintext);
    
    expect(encrypted).toBeDefined();
    expect(Buffer.isBuffer(encrypted)).toBe(true);
    
    const decrypted = await service.decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });
});
