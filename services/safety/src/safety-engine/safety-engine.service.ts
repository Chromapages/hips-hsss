import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { BaseService } from './base-service.js';
import { KeywordMonitorService, KeywordMatch } from './keyword-monitor.service.js';
import { EscalationQueueService, EscalationLevel } from './escalation-queue.service.js';
import { CrisisProtocolService } from './crisis-protocol.service.js';

export type SafetyAssessment = {
  sessionId: string;
  participantId: string;
  isSafe: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'NONE' | 'HARM' | 'SELF_HARM' | 'HARASSMENT' | 'DISCLOSURE';
  reason: string;
  keywordMatches: KeywordMatch[];
  alertId?: string;
};

@Injectable()
export class SafetyEngineService extends BaseService {
  constructor(
    protected override readonly prisma: PrismaService,
    private readonly keywordMonitor: KeywordMonitorService,
    private readonly escalationQueue: EscalationQueueService,
    private readonly crisisProtocol: CrisisProtocolService,
  ) {
    super(prisma, SafetyEngineService.name);
  }

  async assessText(
    sessionId: string,
    participantId: string,
    text: string,
  ): Promise<SafetyAssessment> {
    // Phase 1: Fast keyword scan
    const matches = this.keywordMonitor.check(text);

    if (matches.length > 0) {
      const topMatch = matches[0]!;
      const severity = this.keywordMonitor.severityFor(topMatch.keyword);
      const category = this.categorizeFromKeyword(topMatch.keyword);

      // Log the scan
      await this.keywordMonitor.logKeywordScan(sessionId, participantId, matches, text.length);

      // Persist alert
      const alert = await this.prisma.safetyAlert.create({
        data: {
          sessionId,
          severity,
          category,
          anonymizedReason: `Keyword detected: "${topMatch.keyword}" — ${matches.length} total match(es)`,
          transcriptChunk: text,
          isResolved: false,
        },
      });

      // Enqueue HIGH/CRITICAL for human review
      if (severity === 'HIGH' || severity === 'CRITICAL') {
        await this.escalationQueue.enqueue(
          alert.id,
          sessionId,
          participantId,
          severity,
          `Keyword match: ${topMatch.keyword}`,
          'system:safety-engine',
        );
      }

      return {
        sessionId,
        participantId,
        isSafe: false,
        severity,
        category,
        reason: `Keyword detected: "${topMatch.keyword}"`,
        keywordMatches: matches,
        alertId: alert.id,
      };
    }

    // Phase 2: No keyword matches — return safe
    return {
      sessionId,
      participantId,
      isSafe: true,
      severity: 'LOW',
      category: 'NONE',
      reason: 'No safety concerns detected',
      keywordMatches: [],
    };
  }

  async manualFlag(
    sessionId: string,
    reporterId: string,
    level: 'HIGH' | 'CRITICAL',
    reason: string,
  ): Promise<SafetyAssessment> {
    const alert = await this.prisma.safetyAlert.create({
      data: {
        sessionId,
        severity: level,
        category: 'HARM',
        anonymizedReason: `Manual flag by ${reporterId}: ${reason}`,
        transcriptChunk: 'MANUAL_FLAG',
        isResolved: false,
      },
    });

    await this.escalationQueue.enqueue(
      alert.id,
      sessionId,
      reporterId,
      level,
      reason,
      reporterId,
    );

    return {
      sessionId,
      participantId: reporterId,
      isSafe: false,
      severity: level,
      category: 'HARM',
      reason: `Manual flag: ${reason}`,
      keywordMatches: [],
      alertId: alert.id,
    };
  }

  async getAlert(alertId: string) {
    return this.prisma.safetyAlert.findUnique({ where: { id: alertId } });
  }

  async getSessionAlerts(sessionId: string) {
    return this.prisma.safetyAlert.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private categorizeFromKeyword(keyword: string): SafetyAssessment['category'] {
    const selfHarm = ['kill myself', 'suicide', 'end my life', 'want to die', 'hurt myself', 'overdose', 'cut myself', 'slit my wrists', 'hanging', 'pills to die', 'end it all', "don't want to live anymore"];
    if (selfHarm.includes(keyword)) return 'SELF_HARM';
    return 'HARM';
  }
}