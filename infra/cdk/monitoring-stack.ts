/**
 * CDK Infrastructure: SNS Alerting Stack
 * CHR-73: SNS alerting for crisis events (PagerDuty + Slack)
 *
 * Creates:
 *   - SNS topic: hips-safety-crisis (crisis events)
 *   - Lambda: pagerduty-handler (SNS → PagerDuty)
 *   - Lambda: slack-handler (SNS → Slack #crisis-alerts)
 *   - Subscription filters for event routing
 *
 * Usage:
 *   import { MonitoringStack } from './monitoring-stack';
 *   const stack = new MonitoringStack(app, 'HipsMonitoringStack', {});
 */

import { Stack, StackProps, CfnOutput, Fn, Duration } from 'aws-cdk-lib';
import { Topic, TopicProps, LambdaSubscription, SubscriptionFilter } from 'aws-cdk-lib/aws-sns';
import { Function, FunctionProps, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement, Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface MonitoringStackProps extends StackProps {
  readonlyPagerdutyRoutingKey?: string;
  slackWebhookUrl?: string;
  environment?: 'staging' | 'production';
}

export class MonitoringStack extends Stack {
  public readonly crisisTopicArn: string;

  constructor(scope: Construct, id: string, props: MonitoringStackProps = {}) {
    super(scope, `hips-monitoring-${props.environment ?? 'staging'}`, props);

    const envName = props.environment ?? 'staging';
    const isProd = envName === 'production';
    const topicName = 'hips-safety-crisis';

    // SNS Topic for crisis events
    const crisisTopicProps: TopicProps = {
      topicName,
      displayName: 'HIPS Safety Crisis Alerts',
      fifo: false,
    };

    const crisisTopic = new Topic(this, 'CrisisAlertsTopic', crisisTopicProps);
    this.crisisTopicArn = crisisTopic.topicArn;

    // Lambda IAM role (least privilege)
    const lambdaRole = new Role(this, 'CrisisAlertsLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.addToPolicy(
      new PolicyStatement({
        actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
        resources: ['arn:aws:logs:*:*:*'],
      }),
    );

    // PagerDuty Lambda handler
    const pagerdutyHandlerProps: FunctionProps = {
      functionName: `hips-crisis-${envName}-pagerduty-handler`,
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      timeout: Duration.seconds(30),
      role: lambdaRole,
      environment: {
        PAGERDUTY_ROUTING_KEY: props.readonlyPagerdutyRoutingKey ?? 'PAGERDUTY_ROUTING_KEY_PLACEHOLDER',
        PAGERDUTY_SERVICE_NAME: 'HIPS Safety Engine',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
    };

    const pagerdutyHandler = new Function(this, 'PagerdutyHandler', {
      ...pagerdutyHandlerProps,
      code: Code.fromInline(`
/**
 * SNS → PagerDuty Lambda Handler
 * CHR-73: SNS alerting for crisis events
 */
const PD_API = 'https://events.pagerduty.com/v2/enqueue';

async function handler(event) {
  const routingKey = process.env.PAGERDUTY_ROUTING_KEY;

  for (const record of event.Records ?? []) {
    try {
      const message = JSON.parse(record.Sns.Message);
      const pdPayload = message.pagerduty ?? {
        routing_key: routingKey,
        event_action: 'trigger',
        payload: { summary: message.default ?? 'Crisis alert', severity: 'critical', source: 'hips-safety-engine' },
      };

      if (!pdPayload.routing_key || pdPayload.routing_key === 'PAGERDUTY_ROUTING_KEY_PLACEHOLDER') {
        console.log('PagerDuty routing key not configured, skipping');
        continue;
      }

      const response = await fetch(PD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routing_key: pdPayload.routing_key,
          event_action: pdPayload.event_action ?? 'trigger',
          payload: {
            summary: pdPayload.payload?.summary ?? 'Crisis alert',
            severity: pdPayload.payload?.severity ?? 'critical',
            source: pdPayload.payload?.source ?? 'hips-safety-engine',
            timestamp: new Date().toISOString(),
            custom_details: pdPayload.payload?.custom_details ?? {},
          },
        }),
      });

      if (!response.ok) {
        console.error(\`PagerDuty API error: \${response.status}\`);
        return { statusCode: 500, body: \`Error: \${response.status}\` };
      }

      console.log('PagerDuty event accepted');
    } catch (err) {
      console.error(\`Error: \${err}\`);
      return { statusCode: 500, body: \`Error: \${err}\` };
    }
  }

  return { statusCode: 200, body: 'OK' };
}

module.exports = { handler };
`),
    });

    // Slack Lambda handler
    const slackHandler = new Function(this, 'SlackHandler', {
      functionName: `hips-crisis-${envName}-slack-handler`,
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      timeout: Duration.seconds(30),
      environment: {
        SLACK_WEBHOOK_URL: props.slackWebhookUrl ?? 'SLACK_WEBHOOK_URL_PLACEHOLDER',
        SLACK_CHANNEL: '#crisis-alerts',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
    });

    // SNS → PagerDuty subscription (all messages go to PagerDuty)
    const pdSubscription = new LambdaSubscription(pagerdutyHandler, {
      topic: crisisTopic,
      filterPolicy: {
        // Only route crisis-type events to PagerDuty
        eventType: SubscriptionFilter.stringFilter({
          allowlist: ['MANUAL_ESCALATION', 'KEYWORD_TRIGGERED', 'ADMIN_ACTIVATED'],
        }),
      },
      deliveryPolicy: {
        minDelayInSeconds: 0,
        numRetries: 3,
      },
    });

    // SNS → Slack subscription (all crisis alerts)
    const slackSubscription = new LambdaSubscription(slackHandler, {
      topic: crisisTopic,
      filterPolicy: {
        // Route all messages to Slack
        severity: SubscriptionFilter.stringFilter({
          allowlist: ['CRITICAL', 'HIGH'],
        }),
      },
    });

    // CloudWatch log groups for Lambda functions
    const pdLogGroup = new LogGroup(this, 'PagerdutyHandlerLogs', {
      logGroupName: `/aws/lambda/hips-crisis-${envName}-pagerduty-handler`,
      retention: RetentionDays.THIRTY_DAYS,
    });

    const slackLogGroup = new LogGroup(this, 'SlackHandlerLogs', {
      logGroupName: `/aws/lambda/hips-crisis-${envName}-slack-handler`,
      retention: RetentionDays.THIRTY_DAYS,
    });

    // Outputs
    new CfnOutput(this, 'CrisisAlertsTopicArn', {
      value: crisisTopic.topicArn,
      description: 'SNS topic ARN for HIPS crisis alerts',
      exportName: 'HipsCrisisAlertsTopicArn',
    });

    new CfnOutput(this, 'PagerdutyHandlerArn', {
      value: pagerdutyHandler.functionArn,
      description: 'Lambda ARN for PagerDuty handler',
      exportName: 'HipsPagerdutyHandlerArn',
    });

    new CfnOutput(this, 'SlackHandlerArn', {
      value: slackHandler.functionArn,
      description: 'Lambda ARN for Slack handler',
      exportName: 'HipsSlackHandlerArn',
    });
  }
}
