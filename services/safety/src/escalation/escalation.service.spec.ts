import { EscalationQueueService } from './escalation.service.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Prisma clients with full type safety for tests
const createMockPrisma = () => ({
  safetyAlert: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
  },
  safetyMitigation: {
    create: vi.fn(),
  },
  safetyAuditLog: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
});

describe('EscalationQueueService', () => {
  let service: EscalationQueueService;

  const mockSafetyPrisma = {
    safetyAlert: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    safetyMitigation: {
      create: vi.fn(),
    },
    safetyAuditLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  };
  const mockSessionPrisma = {
    auditEvent: {
      create: vi.fn(),
    },
  };

  const mockConfig = {
    get: vi.fn((key: string) => {
      const config: Record<string, string | undefined> = {
        'SESSION_DATABASE_URL': 'postgresql://test:test@localhost:5432/test_session',
        'VAULT_SERVICE_URL': 'http://localhost:8080',
        'VAULT_API_SECRET': 'test-secret',
      };
      return config[key];
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EscalationQueueService(mockConfig as any, mockSafetyPrisma as any);
    // Simulate module init
    (service as any).sessionPrisma = mockSessionPrisma;
  });

  describe('getEscalationQueue', () => {
    it('should return paginated flagged sessions with hidden identities', async () => {
      const mockAlerts = [
        {
          id: 'alert-1',
          sessionId: 'session-123',
          severity: 'CRITICAL',
          category: 'SELF_HARM',
          anonymizedReason: 'Keyword detected: suicide',
          transcriptChunk: 'I want to end my life',
          isResolved: false,
          createdAt: new Date(),
          mitigations: [],
        },
      ];

      mockSafetyPrisma.safetyAlert.count.mockResolvedValue(1);
      mockSafetyPrisma.safetyAlert.findMany.mockResolvedValue(mockAlerts);

      const result = await service.getEscalationQueue({
        page: 1,
        limit: 20,
        status: 'pending',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].sessionId).toBe('session-123');
      expect(result.data[0].participantHash).toBeDefined();
      expect(result.data[0].participantHash).toMatch(/^P[A-Z0-9]+$/);
      expect(result.data[0].transcriptPreview).toBe('I want to end my life');
      expect(result.pagination.total).toBe(1);
    });

    it('should filter by severity', async () => {
      mockSafetyPrisma.safetyAlert.count.mockResolvedValue(0);
      mockSafetyPrisma.safetyAlert.findMany.mockResolvedValue([]);

      await service.getEscalationQueue({
        page: 1,
        limit: 20,
        severity: 'CRITICAL',
        status: 'all',
      });

      expect(mockSafetyPrisma.safetyAlert.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            severity: 'CRITICAL',
          }),
        }),
      );
    });

    it('should truncate long transcripts in preview', async () => {
      const longTranscript = 'A'.repeat(300);
      const mockAlerts = [
        {
          id: 'alert-1',
          sessionId: 'session-123',
          severity: 'HIGH',
          category: 'HARM',
          anonymizedReason: 'Harmful content',
          transcriptChunk: longTranscript,
          isResolved: false,
          createdAt: new Date(),
          mitigations: [],
        },
      ];

      mockSafetyPrisma.safetyAlert.count.mockResolvedValue(1);
      mockSafetyPrisma.safetyAlert.findMany.mockResolvedValue(mockAlerts);

      const result = await service.getEscalationQueue({
        page: 1,
        limit: 20,
        status: 'all',
      });

      expect(result.data[0].transcriptPreview!.length).toBeLessThanOrEqual(203); // 200 + '...'
      expect(result.data[0].transcriptPreview).toContain('...');
    });
  });

  describe('escalateAlert', () => {
    it('should create mitigation, audit log, and AuditEvent on escalation', async () => {
      const mockAlert = {
        id: 'alert-1',
        sessionId: 'session-123',
        severity: 'CRITICAL',
        category: 'SELF_HARM',
        anonymizedReason: 'Keyword detected',
        transcriptChunk: 'Test transcript',
        isResolved: false,
        createdAt: new Date(),
      };

      mockSafetyPrisma.safetyAlert.findUnique.mockResolvedValue(mockAlert);
      mockSafetyPrisma.safetyMitigation.create.mockResolvedValue({ id: 'mitigation-1' });
      mockSafetyPrisma.safetyAuditLog.create.mockResolvedValue({ id: 'audit-1' });
      mockSessionPrisma.auditEvent.create.mockResolvedValue({ id: 'event-1' });

      // Mock fetch for crisis protocol
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ pii: 'test-pii' }),
      });

      const result = await service.escalateAlert(
        {
          alertId: 'alert-1',
          reason: 'Admin escalation for crisis protocol',
          crisisLevel: 'EMERGENCY',
        },
        'admin-uid',
        'admin@example.com',
      );

      expect(result.success).toBe(true);
      expect(result.alertId).toBe('alert-1');
      expect(mockSafetyPrisma.safetyMitigation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'ESCALATE',
            success: true,
          }),
        }),
      );
      expect(mockSafetyPrisma.safetyAuditLog.create).toHaveBeenCalled();
      expect(mockSessionPrisma.auditEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventType: 'SAFETY_FLAGGED',
            subjectId: 'session-123',
          }),
        }),
      );
    });

    it('should throw NotFoundException for non-existent alert', async () => {
      mockSafetyPrisma.safetyAlert.findUnique.mockResolvedValue(null);

      await expect(
        service.escalateAlert(
          {
            alertId: 'non-existent',
            reason: 'Test',
            crisisLevel: 'STANDARD',
          },
          'admin-uid',
          'admin@example.com',
        ),
      ).rejects.toThrow('Alert non-existent not found');
    });
  });

  describe('resolveAlert', () => {
    it('should update alert status and create audit log', async () => {
      const mockAlert = {
        id: 'alert-1',
        sessionId: 'session-123',
        severity: 'HIGH',
        category: 'HARM',
        anonymizedReason: 'Test',
        transcriptChunk: null,
        isResolved: false,
        createdAt: new Date(),
      };

      mockSafetyPrisma.safetyAlert.findUnique.mockResolvedValue(mockAlert);
      mockSafetyPrisma.safetyAlert.update.mockResolvedValue({ ...mockAlert, isResolved: true });
      mockSafetyPrisma.safetyMitigation.create.mockResolvedValue({ id: 'mitigation-1' });
      mockSafetyPrisma.safetyAuditLog.create.mockResolvedValue({ id: 'audit-1' });

      const result = await service.resolveAlert(
        {
          alertId: 'alert-1',
          resolution: 'RESOLVED',
          notes: 'Handled by admin',
        },
        'admin-uid',
      );

      expect(result.success).toBe(true);
      expect(mockSafetyPrisma.safetyAlert.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'alert-1' },
          data: { isResolved: true },
        }),
      );
    });
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs', async () => {
      const mockLogs = [
        { id: 'log-1', action: 'ALERT_ESCALATED', actor: 'admin-1', createdAt: new Date() },
        { id: 'log-2', action: 'ALERT_RESOLVED', actor: 'admin-2', createdAt: new Date() },
      ];

      mockSafetyPrisma.safetyAuditLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.getAuditLogs(10);

      expect(result).toHaveLength(2);
      expect(mockSafetyPrisma.safetyAuditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      );
    });
  });
});
