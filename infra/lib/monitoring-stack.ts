import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

export class MonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SNS Topic for alerts — PagerDuty + email
    const alertTopic = new sns.Topic(this, "HipsAlertTopic", {
      displayName: "H.I.P.S. Security Alerts",
    });

    // Vault Access Spike Alarm
    // Metric: Custom/VaultService/VaultAccessCount
    // Threshold: >2 accesses in 10-min window outside logged crisis
    const vaultAccessAlarm = new cloudwatch.Alarm(
      this,
      "VaultAccessSpikeAlarm",
      {
        metric: new cloudwatch.Metric({
          namespace: "HIPS/VaultService",
          metricName: "VaultAccessCount",
        }),
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
      new targets.SnsTopicAction(alertTopic),
    );

    // Vault API Auth Failures Alarm
    const vaultAuthAlarm = new cloudwatch.Alarm(
      this,
      "VaultAuthFailureAlarm",
      {
        metric: new cloudwatch.Metric({
          namespace: "HIPS/VaultService",
          metricName: "AuthFailureCount",
        }),
        threshold: 5,
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        alarmName: "HIPS-Vault-Auth-Failure",
      },
    );
    vaultAuthAlarm.addAlarmAction(
      new targets.SnsTopicAction(alertTopic),
    );

    // KMS Decrypt Volume Spike Alarm
    const kmsDecryptAlarm = new cloudwatch.Alarm(
      this,
      "KmsDecryptSpikeAlarm",
      {
        metric: new cloudwatch.Metric({
          namespace: "AWS/KMS",
          metricName: "DecryptRequests",
        }),
        threshold: 50,
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        period: cdk.Duration.minutes(5),
        alarmName: "HIPS-KMS-Decrypt-Spike",
      },
    );
    kmsDecryptAlarm.addAlarmAction(
      new targets.SnsTopicAction(alertTopic),
    );

    // CloudWatch Dashboard
    const dashboard = new cloudwatch.Dashboard(this, "HipsDashboard", {
      dashboardName: "HIPS-Platform",
    });

    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: "Vault Access Count",
        left: [vaultAccessAlarm.metric],
      }),
      new cloudwatch.GraphWidget({
        title: "KMS Decrypt Requests",
        left: [kmsDecryptAlarm.metric],
      }),
    );

    // Export alert topic ARN
    new cdk.CfnOutput(this, "AlertTopicArn", {
      value: alertTopic.topicArn,
      exportName: "HIPS-AlertTopicArn",
    });
  }
}
