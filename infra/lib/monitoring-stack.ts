import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as actions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as kms from "aws-cdk-lib/aws-kms";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";

export interface MonitoringStackProps extends cdk.StackProps {
  ecsCluster?: ecs.ICluster;
  sessionKmsKey?: kms.IKey;
}

export class MonitoringStack extends cdk.Stack {
  public readonly alertTopic: sns.Topic;

  constructor(scope: Construct, id: string, props?: MonitoringStackProps) {
    super(scope, id, props);

    // SNS Topic for alerts — PagerDuty + email
    this.alertTopic = new sns.Topic(this, "HipsAlertTopic", {
      displayName: "H.I.P.S. Security Alerts",
    });

    // Add email subscription for alerts (configure email in AWS console or via env)
    // The email address should be configured via AWS console or environment variable
    const alertEmail = process.env.ALERT_EMAIL;
    if (alertEmail) {
      this.alertTopic.addSubscription(
        new subs.EmailSubscription(alertEmail),
      );
    }

    // Add PagerDuty integration if webhook URL is provided
    const pagerdutyWebhook = process.env.PAGERDUTY_WEBHOOK_URL;
    if (pagerdutyWebhook) {
      this.alertTopic.addSubscription(
        new subs.UrlSubscription(pagerdutyWebhook),
      );
    }

    // ─── Vault Service Metrics ───────────────────────────────────────────────

    // Vault Access Count metric
    const vaultAccessMetric = new cloudwatch.Metric({
      namespace: "HIPS/VaultService",
      metricName: "VaultAccessCount",
      period: cdk.Duration.minutes(1),
      statistic: "Sum",
    });

    // Vault Auth Failure metric
    const vaultAuthFailureMetric = new cloudwatch.Metric({
      namespace: "HIPS/VaultService",
      metricName: "AuthFailureCount",
      period: cdk.Duration.minutes(1),
      statistic: "Sum",
    });

    // Vault Access Spike Alarm
    // Threshold: >2 accesses in 10-min window outside logged crisis
    const vaultAccessAlarm = new cloudwatch.Alarm(
      this,
      "VaultAccessSpikeAlarm",
      {
        metric: vaultAccessMetric,
        threshold: 2,
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        alarmName: "HIPS-Vault-Access-Spike",
        alarmDescription:
          "Alert when vault access count exceeds 2 in a 10-min window outside crisis events",
      },
    );
    vaultAccessAlarm.addAlarmAction(
      new actions.SnsAction(this.alertTopic),
    );

    // Vault API Auth Failures Alarm
    const vaultAuthAlarm = new cloudwatch.Alarm(
      this,
      "VaultAuthFailureAlarm",
      {
        metric: vaultAuthFailureMetric,
        threshold: 5,
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        alarmName: "HIPS-Vault-Auth-Failure",
      },
    );
    vaultAuthAlarm.addAlarmAction(
      new actions.SnsAction(this.alertTopic),
    );

    // ─── KMS Metrics ─────────────────────────────────────────────────────────

    // KMS Decrypt metric (using AWS managed namespace)
    const kmsDecryptMetric = new cloudwatch.Metric({
      namespace: "AWS/KMS",
      metricName: "DecryptRequests",
      dimensionsMap: {
        KeyId: props?.sessionKmsKey?.keyId ?? "unknown",
      },
      period: cdk.Duration.minutes(5),
      statistic: "Sum",
    });

    // KMS Decrypt Volume Spike Alarm
    const kmsDecryptAlarm = new cloudwatch.Alarm(
      this,
      "KmsDecryptSpikeAlarm",
      {
        metric: kmsDecryptMetric,
        threshold: 50,
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        alarmName: "HIPS-KMS-Decrypt-Spike",
      },
    );
    kmsDecryptAlarm.addAlarmAction(
      new actions.SnsAction(this.alertTopic),
    );

    // ─── CloudWatch Dashboard ────────────────────────────────────────────────

    const dashboard = new cloudwatch.Dashboard(this, "HipsDashboard", {
      dashboardName: "HIPS-Platform",
    });

    // Vault metrics section
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: "Vault Access Count",
        left: [vaultAccessMetric],
        leftAnnotations: [
          {
            value: 2,
            color: "#FF0000",
            label: "Spike Threshold",
          },
        ],
      }),
      new cloudwatch.GraphWidget({
        title: "Vault Auth Failures",
        left: [vaultAuthFailureMetric],
        leftAnnotations: [
          {
            value: 5,
            color: "#FF0000",
            label: "Failure Threshold",
          },
        ],
      }),
    );

    // KMS metrics section
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: "KMS Decrypt Requests",
        left: [kmsDecryptMetric],
        leftAnnotations: [
          {
            value: 50,
            color: "#FF0000",
            label: "Spike Threshold",
          },
        ],
      }),
    );

    // ECS service metrics
    const ecsClusterName = props?.ecsCluster?.clusterName;
    if (ecsClusterName) {
      const ecsMetric = new cloudwatch.Metric({
        namespace: "AWS/ECS",
        metricName: "CPUUtilization",
        dimensionsMap: {
          ClusterName: ecsClusterName,
          ServiceName: "vault-service",
        },
        period: cdk.Duration.minutes(1),
        statistic: "Average",
      });

      dashboard.addWidgets(
        new cloudwatch.GraphWidget({
          title: "Vault Service CPU Utilization",
          left: [ecsMetric],
        }),
      );
    }

    // Export alert topic ARN
    new cdk.CfnOutput(this, "AlertTopicArn", {
      value: this.alertTopic.topicArn,
      exportName: "HIPS-AlertTopicArn",
    });
  }
}
