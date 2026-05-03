import { SafetyService } from './safety.service.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SafetyService', () => {
  let service: SafetyService;

  const mockPrisma = {
    safetyStrike: {
      upsert: vi.fn(),
    },
    safetyAlert: {
      create: vi.fn(),
    },
  };

  const mockConfig = {
    get: vi.fn((key: string) => {
      if (key === 'GEMINI_API_KEY') return 'test-key';
      return null;
    }),
  };

  beforeEach(() => {
    service = new SafetyService(mockConfig as any, mockPrisma as any);
  });

  describe('determineMitigation', () => {
    it('should return WARNING for the first strike', async () => {
      mockPrisma.safetyStrike.upsert.mockResolvedValue({ count: 1 });
      const action = await (service as any).determineMitigation('session1', 'user1', 'MEDIUM');
      expect(action).toBe('WARNING');
    });

    it('should return MUTE for the second strike', async () => {
      mockPrisma.safetyStrike.upsert.mockResolvedValue({ count: 2 });
      const action = await (service as any).determineMitigation('session1', 'user1', 'MEDIUM');
      expect(action).toBe('MUTE');
    });

    it('should return KICK for the third strike', async () => {
      mockPrisma.safetyStrike.upsert.mockResolvedValue({ count: 3 });
      const action = await (service as any).determineMitigation('session1', 'user1', 'MEDIUM');
      expect(action).toBe('KICK');
    });

    it('should return KICK immediately for CRITICAL severity', async () => {
      mockPrisma.safetyStrike.upsert.mockResolvedValue({ count: 1 });
      const action = await (service as any).determineMitigation('session1', 'user1', 'CRITICAL');
      expect(action).toBe('KICK');
    });
  });
});
