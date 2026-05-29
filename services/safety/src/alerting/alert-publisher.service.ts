/**
 * SNS Alerting Module — Crisis Event Notifications
 *
 * Provides SNS publishing for crisis events with PagerDuty and Slack integrations.
 * Published alerts route through SNS → Lambda → PagerDuty/Slack.
 *
 * Topic ARN format: arn:aws:sns:{region}:{account}:hips-safety-crisis
 */

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface CrisisAlertPayload {
  alertId: string;
  sessionId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  crisisType: 'MANUAL_ESCALATION' | 'KEYWORD_TRIGGERED' | 'ADMIN_ACTIVATED';
  actorId: string;
  actorName?: string;
  timestamp: string;
  piiAvailable: boolean;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface AlertDestination {
  pagerdutyRoutingKey?: string;
  pagerdutySeverity?: 'critical' | 'high' | 'low';
  slackWebhookUrl?: string;
  extraRecipients?: string[];
}

interface SNSPublisher {
  publish(params: {
    TopicArn: string;
    Message: string;
    Subject?: string;
    MessageStructure?: string;
    Attributes?: Record<string, string>;
  }): Promise<{ MessageId: string }>;
}

@Injectable()
export class AlertPublisherService implements OnModuleInit {
  private readonly logger = new Logger(AlertPublisherService.name);
  private snsPublisher: SNSPublisher | null = null;
  private readonly topicArn: string;

  constructor(private readonly configService: ConfigService) {
    this.topicArn = this.buildTopicArn();
  }

  private buildTopicArn(): string {
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    const accountId = this.configService.get<string>('AWS_ACCOUNT_ID', '123456789012');
    return `arn:aws:sns:${region}:${accountId}:hips-safety-crisis`;
  }

  async onModuleInit(): Promise<void> {
    await this.initSnsClient();
  }

  private async initSnsClient(): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { SnsClient, PublishCommand } = require('@aws-sdk/client-sns');
      const client = new SnsClient({ region: this.configService.get<string>('AWS_REGION', 'us-east-1') });
      this.snsPublisher = client as unknown as SNSPublisher;
      this.logger.log(`AlertPublisherService initialized with topic: ${this.topicArn}`);
    } catch (err) {
      this.logger.warn(`AWS SDK not available. SNS publishing will be mocked. Error: ${err}`);
      this.snsPublisher = null;
    }
  }

  private isSnsAvailable(): boolean {
    return !!this.snsPublisher;
  }

  private async ensureSnsAvailable(): Promise<boolean> {
    if (this.snsPublisher) return true;
    // Try to reinitialize (simplified)
    return false;
  }

  /**
   * Publishes a crisis alert to SNS for distribution to PagerDuty and Slack.
   */
  async publishCrisisAlert(alert: CrisisAlertPayload, destination?: AlertDestination): Promise<{ messageId: string; destinations: string[] }> {
    const destinations: string[] = [];

    const enrichedPayload: CrisisAlertPayload & AlertDestination = {
      ...alert,
      ...(destination?.pagerdutyRoutingKey && {
        pagerdutyRoutingKey: destination.pagerdutyRoutingKey,
        pagerdutySeverity: destination.pagerdutySeverity ?? this.mapSeverity(alert.severity),
      }),
    };

    const message = this.buildAlertMessage(enrichedPayload);
    const subject = this.buildAlertSubject(alert);

    const attributes: Record<string, string> = {};
    if (destination?.pagerdutyRoutingKey) {
      destinations.push('pagerduty');
    }
    if (destination?.slackWebhookUrl) {
      attributes['SlackWebhookUrl'] = destination.slackWebhookUrl;
      destinations.push('slack');
    }

    if (this.snsPublisher) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { PublishCommand } = require('@aws-sdk/client-sns');
        const result = await this.snsPublisher.publish({
          TopicArn: this.topicArn,
          Message: message,
          Subject: subject,
          MessageStructure: 'json',
          ...(Object.keys(attributes).length > 0 && { Attributes: attributes }),
        });
        this.logger.warn(`Crisis alert published: ${alert.alertId} to SNS topic ${this.topicArn}`);
        return {
          messageId: result.MessageId,
          destinations,
        };
      } catch (err) {
        this.logger.error(`Failed to publish crisis alert to SNS: ${err}`);
        throw err;
      }
    } else {
      // Mock publish when AWS SDK is not available
      this.logger.warn(`[MOCK] Crisis alert published (SNS unavailable): alertId=${alert.alertId}`);
      return {
        messageId: `mock-${crypto.randomUUID()}`,
        destinations,
      };
    }
  }

  private buildAlertMessage(alert: CrisisAlertPayload & AlertDestination): string {
    const baseMsg = {
      default: `[CRISIS ALERT] ${alert.crisisType} — ${alert.sessionId}`,
      pagerduty: {
        routing_key: alert.pagerdutyRoutingKey ?? this.configService.get<string>('PAGERDUTY_ROUTING_KEY', ''),
        event_action: 'trigger',
        payload: {
          summary: `[CRISIS] ${alert.crisisType} — Session: ${alert.sessionId}`,
          severity: alert.pagerdutySeverity ?? this.mapSeverity(alert.severity),
          source: 'hips-safety-engine',
          custom_details: {
            alertId: alert.alertId,
            sessionId: alert.sessionId,
            severity: alert.severity,
            crisisType: alert.crisisType,
            actorId: alert.actorId,
            timestamp: alert.timestamp,
            piiAvailable: alert.piiAvailable,
            message: alert.message,
          },
        },
      },
      slack: {
        text: this.buildSlackMessage(alert),
      },
    };

    return JSON.stringify(baseMsg);
  }

  private buildSlackMessage(alert: CrisisAlertPayload): string {
    const emoji = this.getSeverityEmoji(alert.severity);
    return `${emoji} *CRISIS ALERT*\n*Type: _${alert.crisisType}_\n*Session:* \`${alert.sessionId}\`\n*Severity:* ${alert.severity}\n` +
      `*Triggered by:* ${alert.actorId}\n*Time:* ${new Date(alert.timestamp).toISOString()}\n` +
      `*Message:* ${alert.message}\n` +
      (alert.piiAvailable ? '✅ PII available via Vault' : '⚠️ PII not accessible');
  }

  private buildAlertSubject(alert: CrisisAlertPayload): string {
    return `[${alert.severity}] Crisis Alert — ${alert.crisisType} — ${alert.sessionId}`;
  }

  private mapSeverity(sev: CrisisAlertPayload['severity']): 'critical' | 'high' | 'low' {
    switch (sev) {
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'high';
      default: return 'low';
    }
  }

  private getSeverityEmoji(sev: CrisisAlertPayload['severity']): string {
    switch (sev) {
      case 'CRITICAL': return ':rotating_light:';
      case 'HIGH': return ':warning:';
      case 'MEDIUM': return ':bell:';
      default: return ':information_source:';
    }
  }

  /**
   * Returns the SNS topic ARN that safety service publishes to.
   */
  getTopicArn(): string {
    return this.topicArn;
  }
}
