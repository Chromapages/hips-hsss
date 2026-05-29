import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

export type KeywordMatch = {
  term: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'HARM' | 'SELF_HARM' | 'HARASSMENT' | 'DISCLOSURE';
  position: number; // character position in text
};

export type KeywordScanResult = {
  matched: boolean;
  matches: KeywordMatch[];
  text: string;
};

// Default rules as a fallback when DB is not yet seeded
const DEFAULT_KEYWORD_RULES = [
  // Self-harm indicators
  { term: 'kill myself', severity: 'CRITICAL', category: 'SELF_HARM' as const },
  { term: 'suicide', severity: 'CRITICAL', category: 'SELF_HARM' as const },
  { term: 'end my life', severity: 'CRITICAL', category: 'SELF_HARM' as const },
  { term: 'want to die', severity: 'CRITICAL', category: 'SELF_HARM' as const },
  { term: 'cut myself', severity: 'HIGH', category: 'SELF_HARM' as const },
  { term: 'overdose', severity: 'CRITICAL', category: 'SELF_HARM' as const },
  // Harm to others
  { term: 'hurt others', severity: 'HIGH', category: 'HARM' as const },
  { term: 'kill you', severity: 'HIGH', category: 'HARM' as const },
  { term: 'attack someone', severity: 'HIGH', category: 'HARM' as const },
  { term: 'bomb', severity: 'CRITICAL', category: 'HARM' as const },
  { term: 'shoot', severity: 'CRITICAL', category: 'HARM' as const },
  { term: 'stab', severity: 'HIGH', category: 'HARM' as const },
  // Harassment
  { term: 'i hate you', severity: 'MEDIUM', category: 'HARASSMENT' as const },
  { term: 'worthless', severity: 'MEDIUM', category: 'HARASSMENT' as const },
  // Crisis resource (also monitor for context)
  { term: '988', severity: 'LOW', category: 'DISCLOSURE' as const },
];

@Injectable()
export class KeywordMonitoringService {
  private rulesCache: { rules: Array<{ term: string; severity: string; category: string }>, expiresAt: number } | null = null;

  constructor(private prisma: PrismaService) {}

  /**
   * Scan text against keyword rules from config.
   * Returns all matches with their severity and category.
   */
  async scanText(text: string): Promise<KeywordScanResult> {
    const lowerText = text.toLowerCase();
    const matches: KeywordMatch[] = [];

    // Load rules from DB; fall back to defaults if none exist
    const rules = await this.getRules();

    for (const rule of rules) {
      const position = lowerText.indexOf(rule.term.toLowerCase());
      if (position !== -1) {
        matches.push({
          term: rule.term,
          severity: rule.severity as KeywordMatch['severity'],
          category: rule.category as KeywordMatch['category'],
          position,
        });
      }
    }

    return {
      matched: matches.length > 0,
      matches,
      text,
    };
  }

  /**
   * Get all enabled keyword rules from the database,
   * falling back to default rules if the DB table is empty.
   * Uses a 60-second TTL cache to avoid querying on every scan.
   */
  private async getRules(): Promise<
    Array<{ term: string; severity: string; category: string }>
  > {
    const now = Date.now();
    if (this.rulesCache && this.rulesCache.expiresAt > now) {
      return this.rulesCache.rules;
    }

    try {
      const dbRules = await this.prisma.keywordRule.findMany({
        where: { enabled: true },
        select: { term: true, severity: true, category: true },
        orderBy: { term: 'asc' },
      });

      if (dbRules.length > 0) {
        this.rulesCache = { rules: dbRules, expiresAt: now + 60_000 };
        return dbRules;
      }
    } catch {
      // DB not available or table doesn't exist yet — use defaults
    }

    this.rulesCache = { rules: DEFAULT_KEYWORD_RULES, expiresAt: now + 60_000 };
    return DEFAULT_KEYWORD_RULES;
  }

  /**
   * List all keyword rules (for admin review).
   */
  async listRules() {
    try {
      return this.prisma.keywordRule.findMany({
        orderBy: { term: 'asc' },
      });
    } catch {
      return DEFAULT_KEYWORD_RULES.map((r, i) => ({
        id: `default-${i}`,
        term: r.term,
        severity: r.severity,
        category: r.category,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }
  }

  /**
   * Upsert a keyword rule (admin config).
   */
  async upsertRule(params: {
    term: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    category: 'HARM' | 'SELF_HARM' | 'HARASSMENT' | 'DISCLOSURE';
  }) {
    const normalized = params.term.toLowerCase().trim();
    return this.prisma.keywordRule.upsert({
      where: { term: normalized },
      update: { severity: params.severity, category: params.category },
      create: { term: normalized, severity: params.severity, category: params.category },
    });
  }
}