// Alert service — dispatches crisis alerts via SMS (Twilio) and Slack webhook
// All three channels fire simultaneously on crisis trigger

import { Injectable } from '@nestjs/common'
import type { CrisisAlertChannel } from '@hips/types'

export interface AlertResult {
  channel: CrisisAlertChannel
  status: 'SENT' | 'FAILED'
  recipient: string
  error?: string
}

interface CrisisAlertPayload {
  crisisId: string
  sessionId: string
  requesterId: string
  requesterRole: string
  timestamp: string
  localResource?: string // Local emergency number if available
}

@Injectable()
export class AlertService {
  private readonly twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
  private readonly twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
  private readonly twilioFromNumber = process.env.TWILIO_FROM_NUMBER

  private readonly slackWebhookUrl = process.env.CRISIS_SLACK_WEBHOOK_URL

  private readonly primaryPhone = process.env.CRISIS_SMS_PRIMARY
  private readonly backupPhone = process.env.CRISIS_SMS_BACKUP

  /**
   * Fire all three alert channels simultaneously.
   * Returns results for each channel.
   */
  async dispatchCrisisAlerts(
    payload: CrisisAlertPayload,
    vaultFields?: { emergencyContact?: string; region?: string; country?: string },
  ): Promise<AlertResult[]> {
    const results = await Promise.allSettled([
      this.sendSms(this.primaryPhone, this.formatSmsMessage(payload, vaultFields)),
      this.sendSms(this.backupPhone, this.formatSmsMessage(payload, vaultFields)),
      this.sendSlack(payload, vaultFields),
    ])

    return results.map((result, index) => {
      const channels: CrisisAlertChannel[] = ['SMS_PRIMARY', 'SMS_BACKUP', 'SLACK']
      const recipients: string[] = [
        this.primaryPhone ?? 'unknown',
        this.backupPhone ?? 'unknown',
        this.slackWebhookUrl ?? 'Slack',
      ]

      if (result.status === 'fulfilled') {
        return { channel: channels[index], status: 'SENT', recipient: recipients[index] }
      } else {
        return {
          channel: channels[index],
          status: 'FAILED',
          recipient: recipients[index],
          error: result.reason instanceof Error ? result.reason.message : String(result.reason),
        }
      }
    })
  }

  /**
   * Send an SMS via Twilio.
   */
  private async sendSms(to: string | undefined, body: string): Promise<void> {
    if (!to) throw new Error('No SMS recipient configured')
    if (!this.twilioAccountSid || !this.twilioAuthToken || !this.twilioFromNumber) {
      throw new Error('Twilio credentials not configured')
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.twilioAccountSid}:${this.twilioAuthToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: this.twilioFromNumber,
          Body: body,
        }),
      },
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Twilio SMS failed: ${error}`)
    }
  }

  /**
   * Send Slack notification to #crisis-alerts.
   */
  private async sendSlack(
    payload: CrisisAlertPayload,
    vaultFields?: { emergencyContact?: string; region?: string; country?: string },
  ): Promise<void> {
    if (!this.slackWebhookUrl) throw new Error('Slack webhook URL not configured')

    const regionInfo = vaultFields?.region || vaultFields?.country
      ? ` | Region: ${vaultFields.region ?? ''} ${vaultFields.country ?? ''}`.trim()
      : ''

    const localResource = vaultFields?.emergencyContact
      ? `\nLocal emergency contact: ${vaultFields.emergencyContact}`
      : ''

    const body = {
      text: '🚨 CRISIS PROTOCOL ACTIVATED',
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🚨 Crisis Protocol Activated', emoji: true },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Session:*\n${payload.sessionId}` },
            { type: 'mrkdwn', text: `*Triggered by:*\n${payload.requesterRole} (${payload.requesterId})` },
            { type: 'mrkdwn', text: `*Time:*\n${payload.timestamp}` },
            { type: 'mrkdwn', text: `*Crisis ID:*\n${payload.crisisId}` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Immediate attention required. *SLA: 15 minutes.*${regionInfo}${localResource}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Review in Safety Dashboard', emoji: true },
              url: `${process.env.ADMIN_DASHBOARD_URL ?? 'https://app.hips.foundation'}/admin/safety`,
              style: 'danger',
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `This alert was triggered by a FACILITATOR or ADMIN. Vault fields accessed: emergencyContact, region, country. All access is logged.`,
            },
          ],
        },
      ],
    }

    const response = await fetch(this.slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Slack notification failed: ${error}`)
    }
  }

  /**
   * Format SMS message for crisis alert.
   */
  private formatSmsMessage(
    payload: CrisisAlertPayload,
    vaultFields?: { emergencyContact?: string; region?: string; country?: string },
  ): string {
    const localContact = vaultFields?.emergencyContact
      ? ` | Local contact: ${vaultFields.emergencyContact}`
      : ''

    return [
      `CRISIS PROTOCOL ACTIVATED`,
      `Session: ${payload.sessionId}`,
      `Review at: ${process.env.ADMIN_DASHBOARD_URL ?? 'https://app.hips.foundation'}/admin/safety`,
      `SLA: 15 minutes${localContact}`,
    ].join('\n')
  }

  /**
   * Check if all alert channels are configured (for health checks).
   */
  isConfigured(): { sms: boolean; slack: boolean } {
    return {
      sms: !!(this.twilioAccountSid && this.twilioAuthToken && this.twilioFromNumber && this.primaryPhone && this.backupPhone),
      slack: !!this.slackWebhookUrl,
    }
  }
}