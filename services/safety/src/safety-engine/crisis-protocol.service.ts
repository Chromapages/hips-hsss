import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service.js';
import { BaseService } from './base-service.js';

/**
 * Crisis Protocol Service
 *
 * Human-initiated ONLY. No automated AI decisions trigger crisis protocol.
 * Must be explicitly invoked by a human moderator or crisis responder.
 */

/**
 * Fetch with retry and timeout - exponential backoff: 1s, 2s, 4s
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) return response;
      if (i === retries - 1) return response;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries exceeded');
}

@Injectable()
export class CrisisProtocolService extends BaseService {
  constructor(
    protected override readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super(prisma, CrisisProtocolService.name);
  }

  /**
   * Triggers crisis protocol for a given safety alert.
   * MUST be invoked by a human actor — no auto-trigger.
   *
   * @param alertId - The safety alert to escalate
   * @param actorId - Human who initiated (moderator/supervisor ID)
   * @param reason  - Why crisis protocol is being triggered
   */
  async trigger(alertId: string, actorId: string, reason: string): Promise<CrisisResponse> {
    const alert = await this.prisma.safetyAlert.findUnique({ where: { id: alertId } });

    if (!alert) {
      throw new BadRequestException(`Safety alert not found: ${alertId}`);
    }

    // Only CRITICAL alerts qualify for crisis protocol
    if (alert.severity !== 'CRITICAL') {
      throw new BadRequestException(
        `Crisis protocol only available for CRITICAL alerts. Got: ${alert.severity}`,
      );
    }

    const vaultUrl = this.configService.get<string>('VAULT_SERVICE_URL');
    const vaultSecret = this.configService.get<string>('VAULT_API_SECRET');

    if (!vaultUrl || !vaultSecret) {
      this.logger.error('VAULT_SERVICE_URL or VAULT_API_SECRET not configured');
      throw new BadRequestException('Vault service configuration missing');
    }

    // Retrieve PII for emergency response
    // Look up the actual participantId from the session record
    let participantId: string;
    const sessionRecord = await this.prisma.session.findUnique({
      where: { id: alert.sessionId },
    });
    if (sessionRecord?.anonymousParticipantId) {
      participantId = sessionRecord.anonymousParticipantId;
    } else {
      participantId = alert.sessionId;
    }
    const subjectRef = `participant:${participantId}`;
    let piiData: Record<string, unknown> | null = null;
    let vaultSuccess = false;

    try {
      const response = await fetchWithRetry(
        `${vaultUrl}/records/${subjectRef}?actor=${actorId}&purpose=${encodeURIComponent(reason)}`,
        {
          headers: {
            'x-vault-secret': vaultSecret,
            'x-api-version': '2024-01',
          },
        },
      );

      if (response.ok) {
        piiData = await response.json();
        vaultSuccess = true;
      }
    } catch (err) {
      this.logger.error(`Vault fetch failed for crisis protocol: ${err}`);
    }

    // Update alert with crisis activation
    await this.prisma.safetyAlert.update({
      where: { id: alertId },
      data: {
        anonymizedReason: `${alert.anonymizedReason} [CRISIS_ACTIVATED by ${actorId}]`,
        isResolved: false,
      },
    });

    await this.logAuditEvent({
      service: 'safety-engine.crisis-protocol',
      action: 'CRISIS_TRIGGERED',
      actorRef: actorId,
      subjectRef: alert.sessionId,
      metadata: {
        alertId,
        severity: alert.severity,
        reason,
        vaultSuccess,
      },
    });

    this.logger.warn(`Crisis protocol ACTIVATED: alert=${alertId} by=${actorId}`);

    return {
      success: true,
      alertId,
      sessionId: alert.sessionId,
      participantId: alert.sessionId, // sessionId is used as participant ref in this context
      piiAvailable: vaultSuccess,
      pii: vaultSuccess ? piiData : null,
      message: 'Crisis protocol activated. PII retrieved for emergency response.',
      activatedAt: new Date().toISOString(),
    };
  }
}

export type CrisisResponse = {
  success: boolean;
  alertId: string;
  sessionId: string;
  participantId: string;
  piiAvailable: boolean;
  pii: Record<string, unknown> | null;
  message: string;
  activatedAt: string;
};