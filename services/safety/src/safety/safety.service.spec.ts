import { SafetyService } from './safety.service.js';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('SafetyService', () => {
  let service: SafetyService;

  const mockPrisma = {
    safetyStrike: {
      upsert: vi.fn(),
      findFirst: vi.fn(),
    },
    safetyAlert: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    safetyMitigation: {
      create: vi.fn(),
    },
  };

  const mockConfig = {
    get: vi.fn((key: string) => {
      if (key === 'GEMINI_API_KEY') return 'test-key';
      if (key === 'VAULT_SERVICE_URL') return 'http://vault-service';
      if (key === 'VAULT_API_SECRET') return 'vault-secret';
      if (key === 'WEB_APP_URL') return 'http://web-app';
      if (key === 'WEBHOOK_SECRET') return 'webhook-secret';
      return null;
    }),
  };

  beforeEach(() => {
    service = new SafetyService(mockConfig as any, mockPrisma as any);
    // Initialize Google AI Model mock
    (service as any).model = {
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            isSafe: true,
            severity: 'LOW',
            category: 'NONE',
            reason: 'Clean transcript',
          }),
        },
      }),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
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

  describe('processTranscript buffering and classification', () => {
    it('should buffer transcript and return status buffered when buffer is below max size', async () => {
      const result = await service.processTranscript('session-1', 'user-1', 'Hello world');
      expect(result).toEqual({ status: 'buffered' });
    });

    it('should trigger classification when buffer size reaches MAX_BUFFER_SIZE', async () => {
      // Set MAX_BUFFER_SIZE to 3 for testing
      (service as any).MAX_BUFFER_SIZE = 3;

      await service.processTranscript('session-1', 'user-1', 'First sentence');
      await service.processTranscript('session-1', 'user-1', 'Second sentence');
      
      const classificationResult = await service.processTranscript('session-1', 'user-1', 'Third sentence');
      
      expect(classificationResult).toEqual({
        isSafe: true,
        severity: 'LOW',
        category: 'NONE',
        reason: 'Clean transcript',
      });
      expect((service as any).model.generateContent).toHaveBeenCalled();
    });

    it('should trigger immediate critical alert when matching blocklist keyword', async () => {
      mockPrisma.safetyAlert.create.mockResolvedValue({ id: 'alert-123' });
      mockPrisma.safetyStrike.upsert.mockResolvedValue({ count: 1 });
      mockPrisma.safetyMitigation.create.mockResolvedValue({});
      
      // Mock global fetch for the mitigation webhook
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({ ok: true });

      const result = await service.processTranscript('session-1', 'user-1', 'I want to kill myself');
      
      expect(result).toEqual({
        isSafe: false,
        severity: 'CRITICAL',
        category: 'SELF_HARM',
        reason: 'Keyword detected: "kill myself"',
      });
      expect(mockPrisma.safetyAlert.create).toHaveBeenCalled();
      expect(mockPrisma.safetyMitigation.create).toHaveBeenCalled();
      
      global.fetch = originalFetch;
    });
  });

  describe('triggerCrisisProtocol', () => {
    it('should throw error when alert is not CRITICAL', async () => {
      mockPrisma.safetyAlert.findUnique.mockResolvedValue({
        id: 'alert-1',
        severity: 'MEDIUM',
        sessionId: 'session-1',
      });

      await expect(service.triggerCrisisProtocol('alert-1', 'admin-1', 'Needed info'))
        .rejects.toThrow('Crisis protocol can only be triggered for CRITICAL alerts.');
    });

    it('should query Vault and update alert when alert is CRITICAL', async () => {
      mockPrisma.safetyAlert.findUnique.mockResolvedValue({
        id: 'alert-2',
        severity: 'CRITICAL',
        sessionId: 'session-2',
        anonymizedReason: 'Self-harm risk',
      });
      mockPrisma.safetyStrike.findFirst.mockResolvedValue({
        participantId: 'offender-123',
      });
      mockPrisma.safetyAlert.update.mockResolvedValue({});

      // Mock global fetch for the Vault endpoint
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ realName: 'Jane Doe', emergencyContact: '911' }),
      });

      await service.triggerCrisisProtocol('alert-2', 'admin-1', 'Requested emergency check');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('http://vault-service/records/participant:offender-123'),
        expect.any(Object)
      );
      expect(mockPrisma.safetyAlert.update).toHaveBeenCalledWith({
        where: { id: 'alert-2' },
        data: {
          anonymizedReason: 'Self-harm risk [ESCALATED: PII Accessed by admin-1]',
        },
      });

      global.fetch = originalFetch;
    });
  });
});
