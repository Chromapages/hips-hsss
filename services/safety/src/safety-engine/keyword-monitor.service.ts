import { Injectable } from '@nestjs/common';
import { BaseService } from './base-service.js';
import { PrismaService } from '../prisma.service.js';
import { AuditEventInput } from './base-service.js';

export type KeywordMatch = {
  keyword: string;
  pattern: string;
  position: number;
  context: string;
};

@Injectable()
export class KeywordMonitorService extends BaseService {
  private readonly CRITICAL_KEYWORDS = [
    'kill myself',
    'suicide',
    'end my life',
    'want to die',
    'hurt myself',
  ] as const;

  private readonly HIGH_KEYWORDS = [
    'kill you',
    'attack',
    'bomb',
    'shoot',
    'stab',
  ] as const;

  private readonly MEDIUM_KEYWORDS = [
    'hate you',
    'threat',
    'violent',
  ] as const;

  constructor(protected override readonly prisma: PrismaService) {
    super(prisma, KeywordMonitorService.name);
  }

  check(text: string): KeywordMatch[] {
    const lower = text.toLowerCase();
    const matches: KeywordMatch[] = [];

    for (const kw of this.CRITICAL_KEYWORDS) {
      const pos = lower.indexOf(kw);
      if (pos !== -1) {
        matches.push({
          keyword: kw,
          pattern: kw,
          position: pos,
          context: this.extractContext(text, pos, kw.length),
        });
      }
    }

    for (const kw of this.HIGH_KEYWORDS) {
      const pos = lower.indexOf(kw);
      if (pos !== -1) {
        matches.push({
          keyword: kw,
          pattern: kw,
          position: pos,
          context: this.extractContext(text, pos, kw.length),
        });
      }
    }

    for (const kw of this.MEDIUM_KEYWORDS) {
      const pos = lower.indexOf(kw);
      if (pos !== -1) {
        matches.push({
          keyword: kw,
          pattern: kw,
          position: pos,
          context: this.extractContext(text, pos, kw.length),
        });
      }
    }

    return matches;
  }

  severityFor(keyword: string): 'CRITICAL' | 'HIGH' | 'MEDIUM' {
    if (this.CRITICAL_KEYWORDS.includes(keyword as typeof this.CRITICAL_KEYWORDS[number])) return 'CRITICAL';
    if (this.HIGH_KEYWORDS.includes(keyword as typeof this.HIGH_KEYWORDS[number])) return 'HIGH';
    return 'MEDIUM';
  }

  async logKeywordScan(
    sessionId: string,
    participantId: string,
    matches: KeywordMatch[],
    textLength: number,
  ): Promise<void> {
    await this.logAuditEvent({
      service: 'safety-engine.keyword-monitor',
      action: 'KEYWORD_SCAN',
      actorRef: participantId,
      subjectRef: sessionId,
      metadata: {
        matchesCount: matches.length,
        textLength,
        matchedKeywords: matches.map(m => m.keyword),
      },
    });
  }

  private extractContext(text: string, position: number, length: number): string {
    const start = Math.max(0, position - 40);
    const end = Math.min(text.length, position + length + 40);
    return text.slice(start, end);
  }
}