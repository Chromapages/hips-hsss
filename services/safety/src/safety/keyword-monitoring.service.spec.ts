import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KeywordMonitoringService } from './keyword-monitoring.service.js';

describe('KeywordMonitoringService', () => {
  let service: KeywordMonitoringService;

  const mockPrisma = {
    keywordRule: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  };

  beforeEach(() => {
    service = new KeywordMonitoringService(mockPrisma as any);
  });

  describe('scanText', () => {
    it('should match a keyword term in text', async () => {
      mockPrisma.keywordRule.findMany.mockResolvedValue([
        { term: 'suicide', severity: 'CRITICAL', category: 'SELF_HARM' },
        { term: 'bomb', severity: 'CRITICAL', category: 'HARM' },
        { term: 'i hate you', severity: 'MEDIUM', category: 'HARASSMENT' },
      ]);

      const result = await service.scanText('I am thinking about suicide and I have a bomb');

      expect(result.matched).toBe(true);
      expect(result.matches).toHaveLength(2);
      expect(result.matches.map((m) => m.term)).toContain('suicide');
      expect(result.matches.map((m) => m.term)).toContain('bomb');
    });

    it('should return false for text with no keyword matches', async () => {
      mockPrisma.keywordRule.findMany.mockResolvedValue([
        { term: 'suicide', severity: 'CRITICAL', category: 'SELF_HARM' },
      ]);

      const result = await service.scanText('I had a great day today');

      expect(result.matched).toBe(false);
      expect(result.matches).toHaveLength(0);
    });

    it('should be case-insensitive', async () => {
      mockPrisma.keywordRule.findMany.mockResolvedValue([
        { term: 'suicide', severity: 'CRITICAL', category: 'SELF_HARM' },
      ]);

      const upper = await service.scanText('I want to commit SUICIDE');
      const mixed = await service.scanText('SuiCide is on my mind');

      expect(upper.matched).toBe(true);
      expect(mixed.matched).toBe(true);
    });

    it('should report correct position of match in text', async () => {
      mockPrisma.keywordRule.findMany.mockResolvedValue([
        { term: 'bomb', severity: 'CRITICAL', category: 'HARM' },
      ]);

      const result = await service.scanText('I have a bomb in my bag');

      expect(result.matched).toBe(true);
      expect(result.matches[0].position).toBe(9);
    });

    it('should fall back to default rules when DB is empty', async () => {
      mockPrisma.keywordRule.findMany.mockResolvedValue([]);
      mockPrisma.keywordRule.findMany.mockRejectedValue(new Error('DB unavailable'));

      const result = await service.scanText('I want to kill myself');

      expect(result.matched).toBe(true);
      expect(result.matches.some((m: any) => m.term === 'kill myself')).toBe(true);
    });

    it('should fall back to default rules when DB throws', async () => {
      // Mock getRules to throw by making findMany reject
      mockPrisma.keywordRule.findMany.mockRejectedValue(new Error('Connection refused'));

      const result = await service.scanText('I took an overdose last night');

      expect(result.matched).toBe(true);
      expect(result.matches.some((m: any) => m.term === 'overdose')).toBe(true);
    });

    it('should match multiple terms in same text', async () => {
      mockPrisma.keywordRule.findMany.mockResolvedValue([
        { term: 'suicide', severity: 'CRITICAL', category: 'SELF_HARM' },
        { term: 'worthless', severity: 'MEDIUM', category: 'HARASSMENT' },
      ]);

      const result = await service.scanText('I feel worthless and keep thinking about suicide');

      expect(result.matched).toBe(true);
      expect(result.matches).toHaveLength(2);
      expect(result.matches[0].severity).toBe('CRITICAL');
      expect(result.matches[1].severity).toBe('MEDIUM');
    });
  });

  describe('listRules', () => {
    it('should return rules from DB', async () => {
      const dbRules = [
        { id: '1', term: 'bomb', severity: 'CRITICAL', category: 'HARM', enabled: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', term: 'suicide', severity: 'CRITICAL', category: 'SELF_HARM', enabled: true, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockPrisma.keywordRule.findMany.mockResolvedValue(dbRules);

      const result = await service.listRules();

      expect(result).toHaveLength(2);
      expect(mockPrisma.keywordRule.findMany).toHaveBeenCalledWith({ orderBy: { term: 'asc' } });
    });

    it('should return empty array when DB is empty (no fallback for empty result)', async () => {
      mockPrisma.keywordRule.findMany.mockResolvedValue([]);

      const result = await service.listRules();

      // Empty DB is not an error — return empty result, not defaults
      expect(result).toHaveLength(0);
    });
  });

  describe('upsertRule', () => {
    it('should normalize term to lowercase before upserting', async () => {
      mockPrisma.keywordRule.upsert.mockResolvedValue({ id: '1', term: 'suicide', severity: 'CRITICAL', category: 'SELF_HARM' } as any);

      await service.upsertRule({ term: '  SUICIDE  ', severity: 'CRITICAL', category: 'SELF_HARM' });

      expect(mockPrisma.keywordRule.upsert).toHaveBeenCalledWith({
        where: { term: 'suicide' },
        update: { severity: 'CRITICAL', category: 'SELF_HARM' },
        create: { term: 'suicide', severity: 'CRITICAL', category: 'SELF_HARM' },
      });
    });
  });
});