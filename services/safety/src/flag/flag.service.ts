import { Injectable } from '@nestjs/common'
import { EscalationService } from '../escalation/escalation.service'
import { FlagInput } from '../common/schemas'
import { matchKeywords, AUTO_ESCALATION_SEVERITY_THRESHOLD, KeywordCategory } from '@hips/copy-policy'
import { makeResponse } from '../common/response'

@Injectable()
export class FlagService {
  constructor(private readonly escalationService: EscalationService) {}

  /**
   * Handle a flag from the session engine.
   * - If KEYWORD_MATCH and consent given: run keyword detection against transcript snippet
   * - Auto-promotes to ESCALATION_REVIEW if severity >= threshold
   * - Writes AuditEvent to Session DB via internal HTTP call
   */
  async handleFlag(input: FlagInput): Promise<{ flagId: string; queuePosition: number }> {
    let severity = 0
    let matchedCategories: KeywordCategory[] = []

    // Keyword match only runs for KEYWORD_MATCH flag type with explicit transcript
    if (input.flagType === 'KEYWORD_MATCH' && input.transcriptSnippet) {
      const matches = matchKeywords(input.transcriptSnippet)
      if (matches.length > 0) {
        // Use the highest severity match
        severity = Math.max(...matches.map((m) => m.severity))
        matchedCategories = [...new Set(matches.map((m) => m.matched))]
      }
    } else if (input.flagType === 'COUNSELOR_FLAG') {
      // Counselor-initiated flags are taken at face value — no keyword analysis
      severity = 50 // Medium-high severity
    } else if (input.flagType === 'REPEATED_DISTRESS') {
      severity = 70 // High severity — repeated patterns are serious
    }

    // Create escalation record (escalation service handles auto-escalation logic)
    const escalation = await this.escalationService.createEscalation({
      sessionId: input.sessionId,
      flagType: input.flagType,
      severity,
      notes: input.notes ?? matchedCategories.map((c) => c).join(', '),
    })

    // Write AuditEvent to Session DB via internal service-to-service call
    // This happens async — we don't block on it
    this.notifySessionAudit(input, escalation.id, severity).catch((err) => {
      // Log but don't fail the flag operation
      console.error('Failed to notify session audit log:', err)
    })

    // Estimate queue position based on severity
    const queuePosition = await this.estimateQueuePosition(escalation.id, severity)

    return {
      flagId: escalation.id,
      queuePosition,
    }
  }

  private async estimateQueuePosition(escalationId: string, severity: number): Promise<number> {
    // Count how many higher-severity unresolved escalations exist
    // This is an approximation — the actual sorting is done at query time
    const higherSeverityCount = await this.escalationService.countHigherSeverity(severity)
    return higherSeverityCount + 1
  }

  private async notifySessionAudit(
    input: FlagInput,
    escalationId: string,
    severity: number,
  ): Promise<void> {
    // Internal service-to-service call to log AuditEvent in Session DB
    // SAFETY_ENGINE_SECRET authenticates this call
    const sessionDbUrl = process.env.SESSION_SERVICE_URL ?? 'http://localhost:3000'

    await fetch(`${sessionDbUrl}/internal/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-safety-engine-secret': process.env.SAFETY_ENGINE_SECRET ?? '',
      },
      body: JSON.stringify({
        eventType: 'SAFETY_FLAG',
        sessionId: input.sessionId,
        actorAnonId: input.counselorId,
        metadata: {
          flagType: input.flagType,
          escalationId,
          severity,
          timestamp: input.timestamp,
        },
      }),
    })
  }
}