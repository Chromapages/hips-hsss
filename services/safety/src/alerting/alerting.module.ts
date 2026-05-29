/**
 * Alerting Module — SNS integration for crisis alerts (CHR-73)
 *
 * Integrates with PagerDuty and Slack for crisis event notifications.
 * Produces: SNS topic, Lambda handlers, IAM policy.
 *
 * Subscription flow:
 *   Safety Engine → SNS (hips-safety-crisis) → Lambda (pagerduty-handler) → PagerDuty
 *                                               → Lambda (slack-handler) → Slack #crisis-alerts
 *
 * IAM policy for safety service:
 *   hips-safety-service-role — allows Publish to hips-safety-crisis SNS topic
 */

import { Module } from '@nestjs/common';
import { AlertPublisherService } from './alert-publisher.service.js';

@Module({
  providers: [AlertPublisherService],
  exports: [AlertPublisherService],
})
export class AlertingModule {}
