import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VaultService } from './vault.service'
import { KmsService } from '../kms/kms.service'
import { VaultRepository } from './vault.repository'

vi.mock('../kms/kms.service', () => {
  return {
    KmsService: vi.fn().mockImplementation(() => ({
      encrypt: vi.fn().mockImplementation((value: string) => Promise.resolve(`encrypted_${value}`)),
    })),
  }
})

const mockVaultRepository = {
  createRecord: vi.fn().mockImplementation(async (data: any) => ({
    id: 'vault_test_uuid',
    ...data,
  })),
  findByToken: vi.fn(),
  logAccess: vi.fn().mockImplementation(async (data: any) => ({
    id: '12345678-1234-1234-1234-123456789012',
    ...data,
    accessedAt: new Date(),
  })),
}

describe('VaultService', () => {
  let vaultService: VaultService

  beforeEach(() => {
    vi.clearAllMocks()
    const mockKms = new KmsService()
    vaultService = new VaultService(mockKms, mockVaultRepository as any)
  })

  describe('createRecord', () => {
    it('should encrypt all PII fields and return expiry dates', async () => {
      const input = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        ipAddress: '192.168.1.1',
        deviceFingerprint: 'fp_abc123',
      }

      const result = await vaultService.createRecord(input)

      expect(result.vaultRef).toBeDefined()
      expect(mockVaultRepository.createRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          encryptedEmail: 'encrypted_test@example.com',
          encryptedName: 'encrypted_Test User',
          encryptedPhone: 'encrypted_+1234567890',
          encryptedIpAddress: 'encrypted_192.168.1.1',
          encryptedDeviceFingerprint: 'encrypted_fp_abc123',
        }),
      )

      expect(result.ipExpiresAt).toBeInstanceOf(Date)
      expect(result.fingerprintExpiresAt).toBeInstanceOf(Date)

      const now = new Date()
      const ipExpiry = new Date(result.ipExpiresAt)
      const fpExpiry = new Date(result.fingerprintExpiresAt)

      const ipDiff = Math.abs(ipExpiry.getTime() - now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const fpDiff = Math.abs(fpExpiry.getTime() - now.getTime() - 90 * 24 * 60 * 60 * 1000)
      expect(ipDiff).toBeLessThan(5000)
      expect(fpDiff).toBeLessThan(5000)
    })

    it('should handle missing optional fields', async () => {
      const input = {
        ipAddress: '10.0.0.1',
        deviceFingerprint: 'fp_xyz789',
      }

      await vaultService.createRecord(input)

      expect(mockVaultRepository.createRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          encryptedIpAddress: 'encrypted_10.0.0.1',
          encryptedDeviceFingerprint: 'encrypted_fp_xyz789',
        }),
      )
    })
  })

  describe('getRecord', () => {
    it('should throw if justification is less than 10 characters', async () => {
      await expect(vaultService.getRecord('token_123', 'short', 'req_123')).rejects.toThrow(
        'Justification required (min 10 characters)',
      )
    })

    it('should throw if justification is only whitespace', async () => {
      await expect(vaultService.getRecord('token_123', '         ', 'req_123')).rejects.toThrow(
        'Justification required (min 10 characters)',
      )
    })

    it('should return record data when justification is valid', async () => {
      const token = 'vault_token_abc'
      const justification = 'Participant requesting their data export'

      const result = await vaultService.getRecord(token, justification, 'req_123')

      expect(result.token).toBe(token)
      expect(result.accessed).toBe(true)
      expect(result.justification).toBe(justification)
      expect(result.accessedAt).toBeDefined()
      expect(mockVaultRepository.logAccess).toHaveBeenCalledWith({
        requesterId: 'req_123',
        vaultRecordId: token,
        justification,
      })
    })
  })

  describe('logAccess', () => {
    it('should return an id and use UUID for id field', async () => {
      const input = {
        requesterId: 'req_123',
        vaultRecordId: 'vault_def',
        justification: 'Safety review access',
      }

      const result = await vaultService.logAccess(input)

      expect(result.id).toBeDefined()
      expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(result.requesterId).toBe(input.requesterId)
      expect(result.vaultRecordId).toBe(input.vaultRecordId)
      expect(result.accessedAt).toBeDefined()
    })
  })

  describe('getAccessLog', () => {
    it('should return paginated structure', async () => {
      const input = { page: 2, pageSize: 10 }

      const result = await vaultService.getAccessLog(input)

      expect(result).toHaveProperty('records')
      expect(result).toHaveProperty('meta')
      expect(result.meta.page).toBe(2)
      expect(result.meta.pageSize).toBe(10)
      expect(result.meta).toHaveProperty('totalCount')
      expect(result.meta).toHaveProperty('totalPages')
    })

    it('should use default pagination when not provided', async () => {
      const result = await vaultService.getAccessLog({ page: 1, pageSize: 20 })

      expect(result.meta.page).toBe(1)
      expect(result.meta.pageSize).toBe(20)
    })
  })
})
