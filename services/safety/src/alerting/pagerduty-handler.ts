/**
 * SNS → PagerDuty Lambda Handler
 *
 * Subscribes to the hips-safety-crisis SNS topic and routes crisis alerts to PagerDuty.
 * This is designed to run as an AWS Lambda function triggered by SNS subscription.
 *
 * Environment variables required:
 *   PAGERDUTY_ROUTING_KEY — PagerDuty Events API v2 routing key
 *   PAGERDUTY_SERVICE_NAME — Optional: override service name (default: HIPS Safety)
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
  };
}

interface PagerDutyEvent {
  routing_key: string;
  event_action: 'trigger' | 'acknowledge' | 'resolve';
  payload: {
    summary: string;
    severity: 'critical' | 'high' | 'low' | 'info';
    source: string;
    timestamp?: string;
    custom_details?: Record<string, unknown>;
  };
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

export async function handler(event: SNSEvent): Promise<{ statusCode: number; body: string }> {
  const routingKey = process.env.PAGERDUTY_ROUTING_KEY ?? '';
  const serviceName = process.env.PAGERDUTY_SERVICE_NAME ?? 'HIPS Safety';

  console.log('Processing SNS event for PagerDuty integration');

  for (const record of event.Records ?? []) {
    try {
      const message = JSON.parse(record.Sns.Message);

      // Extract PagerDuty-specific payload
      const pdPayload = message.pagerduty ?? {
        routing_key: routingKey,
        event_action: 'trigger',
        payload: {
          summary: message.default ?? 'Crisis alert from HIPS',
          severity: 'critical',
          source: serviceName,
          custom_details: message,
        },
      };

      // Override with env routing key if not in message
      if (!pdPayload.routing_key || pdPayload.routing_key === '') {
        pdPayload.routing_key = routingKey;
      }

      // Ensure we have a valid routing key
      if (!pdPayload.routing_key || pdPayload.routing_key === '') {
        console.warn('No PagerDuty routing key configured, skipping');
        continue;
      }

      const pdEvent: PagerDutyEvent = {
        routing_key: pdPayload.routing_key,
        event_action: pdPayload.event_action ?? 'trigger',
        payload: {
          summary: pdPayload.payload?.summary ?? 'Crisis alert',
          severity: pdPayload.payload?.severity ?? 'critical',
          source: pdPayload.payload?.source ?? serviceName,
          timestamp: pdPayload.payload?.timestamp ?? new Date().toISOString(),
          custom_details: pdPayload.payload?.custom_details ?? {},
        },
      };

      console.log(`Routing PagerDuty event: ${pdEvent.payload.summary}`);

      const response = await fetchWithRetry('https://events.pagerduty.com/v2/enqueue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdEvent),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`PagerDuty API error: ${response.status} ${errorBody}`);
        return { statusCode: 500, body: `PagerDuty API error: ${response.status}` };
      }

      const result = await response.json();
      console.log(`PagerDuty event accepted: ${JSON.stringify(result)}`);
    } catch (err) {
      console.error(`Error processing SNS record: ${err}`);
      return { statusCode: 500, body: `Error: ${err}` };
    }
  }

  return { statusCode: 200, body: 'OK' };
}

// Allow direct invocation for testing
if (require.main === module) {
  const mockEvent: SNSEvent = {
    Records: [{
      Sns: {
        TopicArn: 'arn:aws:sns:us-east-1:123456789012:hips-safety-crisis',
        MessageId: 'test-msg-id',
        Message: JSON.stringify({
          default: '[TEST] Crisis alert',
          pagerduty: {
            routing_key: process.env.PAGERDUTY_ROUTING_KEY ?? 'TEST_KEY',
            event_action: 'trigger',
            payload: {
              summary: 'TEST: Crisis alert for session test-session',
              severity: 'critical',
              source: 'hips-safety-engine-test',
              custom_details: {
                alertId: 'test-alert',
                sessionId: 'test-session',
                severity: 'CRITICAL',
                crisisType: 'MANUAL_ESCALATION',
                actorId: 'test-actor',
                timestamp: new Date().toISOString(),
                piiAvailable: true,
                message: 'Test crisis alert',
              },
            },
          },
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
