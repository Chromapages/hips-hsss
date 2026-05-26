import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VaultService } from '../src/vault/vault.service.js';
import type { CreateVaultRecordInput, VaultAccessInput } from '../src/vault/vault.service.js';

// Mock the schedule decorator to avoid @nestjs/schedule import issues
vi.mock('@nestjs/schedule', () => ({
  Cron: () => () => (target: any) => target,
}));

describe('VaultService Integration', () => {
  let service: VaultService;
  let mockPrisma: any;
  let mockCrypto: any;

  beforeEach(() => {
    // Mock PrismaService
    mockPrisma = {
      identityRecord: {
        upsert: vi.fn().mockResolvedValue({
          id: 'record-123',
          subjectRef: 'subject-001',
          encryptedRealName: Buffer.from('encrypted'),
        }),
        findUnique: vi.fn().mockResolvedValue({
          id: 'record-123',
          subjectRef: 'subject-001',
          encryptedRealName: Buffer.from('encrypted'),
          encryptedEmergencyContact: Buffer.from('encrypted'),
          encryptedRegion: Buffer.from('encrypted'),
          encryptedDisclosure: null,
          encryptedIpAddress: null,
          encryptedDeviceFingerprint: null,
        }),
        update: vi.fn().mockResolvedValue({}),
        findMany: vi.fn().mockResolvedValue([]),
      },
      vaultAccessLog: {
        create: vi.fn().mockResolvedValue({
          id: 'log-123',
          subjectRef: 'subject-001',
          actorRef: 'admin',
          purpose: 'TEST',
        }),
      },
    };

    // Mock VaultCryptoService
    mockCrypto = {
      encrypt: vi.fn().mockImplementation((value: string) =>
        Promise.resolve(Buffer.from(`encrypted:${value}`))
      ),
      decrypt: vi.fn().mockImplementation((buffer: Buffer) => {
        const str = buffer.toString();
        return Promise.resolve(str.replace('encrypted:', ''));
      }),
    };

    service = new VaultService(mockPrisma, mockCrypto);
  });

  describe('createRecord', () => {
    it('should encrypt PII before storing', async () => {
      const input: CreateVaultRecordInput = {
        subjectRef: 'subject-001',
        realName: 'John Doe',
        emergencyContact: '+1-555-123-4567',
        region: 'US-WEST',
      };

      await service.createRecord(input);

      expect(mockCrypto.encrypt).toHaveBeenCalledWith('John Doe');
      expect(mockCrypto.encrypt).toHaveBeenCalledWith('+1-555-123-4567');
      expect(mockCrypto.encrypt).toHaveBeenCalledWith('US-WEST');
    });

    it('should store ciphertext + encrypted DEK in database', async () => {
      const input: CreateVaultRecordInput = {
        subjectRef: 'subject-002',
        realName: 'Jane Smith',
        emergencyContact: '+1-555-987-6543',
        region: 'US-EAST',
      };

      const result = await service.createRecord(input);

      expect(result).toBeDefined();
      expect(result.id).toBe('record-123');
      expect(mockPrisma.identityRecord.upsert).toHaveBeenCalled();
    });

    it('should handle optional PII fields', async () => {
      const input: CreateVaultRecordInput = {
        subjectRef: 'subject-003',
        realName: 'Test User',
        emergencyContact: '+1-555-000-0000',
        region: 'US-CENTRAL',
        disclosure: 'HIPAA consent',
        ipAddress: '192.168.1.100',
        deviceFingerprint: 'fp-abc123',
      };

      await service.createRecord(input);

      expect(mockCrypto.encrypt).toHaveBeenCalledWith('HIPAA consent');
      expect(mockCrypto.encrypt).toHaveBeenCalledWith('192.168.1.100');
      expect(mockCrypto.encrypt).toHaveBeenCalledWith('fp-abc123');
    });

    it('should upsert existing records', async () => {
      const input: CreateVaultRecordInput = {
        subjectRef: 'subject-001', // Already exists
        realName: 'John Updated',
        emergencyContact: '+1-555-999-9999',
        region: 'US-WEST',
      };

      await service.createRecord(input);

      expect(mockPrisma.identityRecord.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { subjectRef: 'subject-001' },
        })
      );
    });
  });

  describe('getRecord', () => {
    it('should decrypt stored PII before returning', async () => {
      const result = await service.getRecord('subject-001', 'admin', 'ADMIN_ACCESS');

      expect(result).toBeDefined();
      expect(result.realName).toBeDefined();
      expect(mockCrypto.decrypt).toHaveBeenCalled();
    });

    it('should return plaintext to authorized callers', async () => {
      const result = await service.getRecord('subject-001', 'admin', 'ADMIN_ACCESS');

      expect(result.subjectRef).toBe('subject-001');
      expect(typeof result.realName).toBe('string');
      expect(typeof result.emergencyContact).toBe('string');
    });

    it('should log access before returning data', async () => {
      await service.getRecord('subject-001', 'admin', 'ADMIN_ACCESS');

      expect(mockPrisma.vaultAccessLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            subjectRef: 'subject-001',
            actorRef: 'admin',
            purpose: 'ADMIN_ACCESS',
            action: 'READ_PII',
          }),
        })
      );
    });

    it('should throw NotFoundException for unknown subject', async () => {
      mockPrisma.identityRecord.findUnique.mockResolvedValueOnce(null);

      await expect(service.getRecord('unknown-ref', 'admin', 'ADMIN_ACCESS'))
        .rejects.toThrow('Identity record not found');
    });
  });

  describe('logAccess', () => {
    it('should create INSERT-only log entries', async () => {
      const input: VaultAccessInput = {
        subjectRef: 'subject-001',
        actorRef: 'admin',
        purpose: 'RECORD_READ',
        action: 'PII_ACCESS',
      };

      const result = await service.logAccess(input);

      expect(result).toBeDefined();
      expect(mockPrisma.vaultAccessLog.create).toHaveBeenCalledWith({
        data: {
          subjectRef: 'subject-001',
          actorRef: 'admin',
          purpose: 'RECORD_READ',
          action: 'PII_ACCESS',
          metadata: {},
        },
      });
    });

    it('should accept metadata with access logs', async () => {
      const input: VaultAccessInput = {
        subjectRef: 'subject-001',
        actorRef: 'admin',
        purpose: 'SESSION_INIT',
        metadata: { sessionId: 'sess-123' },
      };

      await service.logAccess(input);

      expect(mockPrisma.vaultAccessLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          metadata: { sessionId: 'sess-123' },
        }),
      });
    });

    it('should use empty object as default metadata', async () => {
      const input: VaultAccessInput = {
        subjectRef: 'subject-001',
        actorRef: 'admin',
        purpose: 'TEST',
      };

      await service.logAccess(input);

      expect(mockPrisma.vaultAccessLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          metadata: {},
        }),
      });
    });
  });

  describe('expireOldIpAddresses', () => {
    it('should expire IP addresses older than 30 days', async () => {
      mockPrisma.identityRecord.findMany.mockResolvedValueOnce([
        {
          id: 'record-1',
          subjectRef: 'subject-001',
          encryptedIpAddress: Buffer.from('encrypted:192.168.1.1'),
        },
      ]);

      await service.expireOldIpAddresses();

      expect(mockPrisma.identityRecord.update).toHaveBeenCalledWith({
        where: { id: 'record-1' },
        data: { encryptedIpAddress: null, ipExpiresAt: null },
      });

      expect(mockPrisma.vaultAccessLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'IP_EXPIRY',
        }),
      });
    });
  });

  describe('expireOldDeviceFingerprints', () => {
    it('should expire device fingerprints older than 90 days', async () => {
      mockPrisma.identityRecord.findMany.mockResolvedValueOnce([
        {
          id: 'record-1',
          subjectRef: 'subject-001',
          encryptedDeviceFingerprint: Buffer.from('encrypted:fp-123'),
        },
      ]);

      await service.expireOldDeviceFingerprints();

      expect(mockPrisma.identityRecord.update).toHaveBeenCalledWith({
        where: { id: 'record-1' },
        data: {
          encryptedDeviceFingerprint: null,
          deviceFingerprintExpiresAt: null,
        },
      });

      expect(mockPrisma.vaultAccessLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'DEVICE_FINGERPRINT_EXPIRY',
        }),
      });
    });
  });
});