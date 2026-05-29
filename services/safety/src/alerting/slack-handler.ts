/**
 * SNS → Slack Lambda Handler
 *
 * Subscribes to the hips-safety-crisis SNS topic and routes crisis alerts to Slack.
 * This is designed to run as an AWS Lambda function triggered by SNS subscription.
 *
 * Environment variables required:
 *   SLACK_WEBHOOK_URL — Slack incoming webhook URL for #crisis-alerts channel
 *   SLACK_CHANNEL — Optional: override channel (default: #crisis-alerts)
 */

interface SNSEvent {
  Records: SNSRecord[];
}

interface SNSRecord {
  Sns: {
    TopicArn: string;
    MessageId: string;
    Message: string;
    Subject?: string;
    Timestamp: string;
    MessageAttributes?: Record<string, SNSMessageAttribute>;
  };
}

interface SNSMessageAttribute {
  Type: string;
  Value: string;
}

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: { type: string; text: string }[];
}

interface SlackActionsElement {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  url?: string;
  style?: string;
}

interface SlackPayload {
  username?: string;
  icon_emoji?: string;
  text?: string;
  blocks?: SlackBlock[];
}

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

async function handler(event: SNSEvent): Promise<{ statusCode: number; body: string }> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL ?? '';
  const channel = process.env.SLACK_CHANNEL ?? '#crisis-alerts';

  console.log('Processing SNS event for Slack integration');

  if (!webhookUrl || webhookUrl === '') {
    console.warn('No Slack webhook URL configured, skipping');
    return { statusCode: 200, body: 'No webhook URL configured' };
  }

  for (const record of event.Records ?? []) {
    try {
      const message = JSON.parse(record.Sns.Message);

      // Extract Slack-specific payload
      const slackPayload: SlackPayload = message.slack ?? {
        text: message.default ?? 'Crisis alert from HIPS',
      };

      // Override webhook URL if provided in message attributes
      const actualWebhookUrl = message.SlackWebhookUrl ?? webhookUrl;

      // Build formatted Slack message
      const alertData = slackPayload.text
        ? parseAlertData(message)
        : { raw: message };

      const blocks: SlackBlock[] = buildSlackBlocks(alertData, message);

      const payload: SlackPayload = {
        username: 'HIPS Safety Engine',
        icon_emoji: ':rotating_light:',
        text: slackPayload.text ?? `Crisis alert: ${message.sessionId ?? 'unknown session'}`,
        blocks,
      };

      console.log(`Routing Slack message to ${channel}`);

      const response = await fetchWithRetry(actualWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Slack webhook error: ${response.status} ${errorBody}`);
        return { statusCode: 500, body: `Slack webhook error: ${response.status}` };
      }

      console.log(`Slack message sent successfully`);
    } catch (err) {
      console.error(`Error processing SNS record for Slack: ${err}`);
      return { statusCode: 500, body: `Error: ${err}` };
    }
  }

  return { statusCode: 200, body: 'OK' };
}

function parseAlertData(message: Record<string, unknown>): Record<string, unknown> {
  try {
    return {
      alertId: message.alertId ?? 'unknown',
      sessionId: message.sessionId ?? 'unknown',
      severity: message.severity ?? 'UNKNOWN',
      crisisType: message.crisisType ?? 'UNKNOWN',
      actorId: message.actorId ?? 'unknown',
      timestamp: message.timestamp ?? new Date().toISOString(),
      piiAvailable: message.piiAvailable ?? false,
      message: message.message ?? '',
    };
  } catch {
    return { raw: message };
  }
}

function buildSlackBlocks(alertData: Record<string, unknown>, rawMessage: Record<string, unknown>): SlackBlock[] {
  const severity = String(alertData.severity ?? 'UNKNOWN');
  const crisisType = String(alertData.crisisType ?? 'UNKNOWN');

  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `Crisis Alert: ${crisisType.replace(/_/g, ' ')}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Session:*\n${alertData.sessionId ?? 'unknown'}` },
        { type: 'mrkdwn', text: `*Severity:*\n${severity}` },
        { type: 'mrkdwn', text: `*Triggered by:*\n${alertData.actorId ?? 'unknown'}` },
        { type: 'mrkdwn', text: `*Time:*\n${new Date(String(alertData.timestamp ?? Date.now())).toISOString()}` },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Message:*\n${alertData.message ?? 'No message provided'}`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: alertData.piiAvailable === true
            ? '✅ PII available via Identity Vault — emergency contact can be retrieved'
            : '⚠️ PII not accessible — Vault access not available',
        },
      ],
    },
    {
      type: 'divider',
    },
  ];
}

export { handler };
export default handler;

const mockTest = process.argv.includes('--test');
if (mockTest) {
  const mockEvent: SNSEvent = {
    Records: [{
      Sns: {
        TopicArn: 'arn:aws:sns:us-east-1:123456789012:hips-safety-crisis',
        MessageId: 'test-msg-id',
        Message: JSON.stringify({
          default: '[TEST] Crisis alert',
          alertId: 'test-alert-id',
          sessionId: 'test-session-123',
          severity: 'CRITICAL',
          crisisType: 'MANUAL_ESCALATION',
          actorId: 'facilitator@hips.foundation',
          timestamp: new Date().toISOString(),
          piiAvailable: true,
          message: 'Test crisis alert - emergency resources displayed to participant',
        }),
        Subject: '[CRITICAL] Crisis Alert — TEST',
        Timestamp: new Date().toISOString(),
      },
    }],
  };

  handler(mockEvent)
    .then((result) => {
      console.log('Test result:', result);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Test failed:', err);
      process.exit(1);
    });
}
