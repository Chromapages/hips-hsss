import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as kms from "aws-cdk-lib/aws-kms";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly sessionSecurityGroup: ec2.SecurityGroup;
  public readonly sessionServiceSecurityGroup: ec2.SecurityGroup;
  public readonly vaultSecurityGroup: ec2.SecurityGroup;
  public readonly vaultServiceSecurityGroup: ec2.SecurityGroup;
  public readonly safetySecurityGroup: ec2.SecurityGroup;
  public readonly albSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with isolated private subnets for vault DB
    this.vpc = new ec2.Vpc(this, "HipsVpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "PrivateApp",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: "IsolatedData",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
      natGateways: 1,
    });

    // VPC Flow Logs — capture all traffic for security auditing
    const flowLogRole = new iam.Role(this, "VpcFlowLogRole", {
      assumedBy: new iam.ServicePrincipal("vpc-flow-logs.amazonaws.com"),
    });
    new ec2.FlowLog(this, "VpcFlowLog", {
      resourceType: ec2.FlowLogResourceType.fromVpc(this.vpc),
      destination: ec2.FlowLogDestination.toCloudWatchLogs(
        new logs.LogGroup(this, "VpcFlowLogGroup", {
          retention: logs.RetentionDays.THREE_MONTHS,
        }),
        flowLogRole,
      ),
    });

    // Security groups per service — enforce at network level
    this.sessionSecurityGroup = new ec2.SecurityGroup(
      this,
      "SessionSecurityGroup",
      { vpc: this.vpc, description: "Session service - session DB only" },
    );

    // Session service ECS tasks use this SG (attached to ENI)
    this.sessionServiceSecurityGroup = new ec2.SecurityGroup(
      this,
      "SessionServiceSecurityGroup",
      { vpc: this.vpc, description: "Security group for session ECS tasks" },
    );

    this.vaultSecurityGroup = new ec2.SecurityGroup(
      this,
      "VaultSecurityGroup",
      {
        vpc: this.vpc,
        description: "Vault service - vault DB only",
        allowAllOutbound: false,
      },
    );

    // Vault service ECS tasks use this SG (attached to ENI)
    this.vaultServiceSecurityGroup = new ec2.SecurityGroup(
      this,
      "VaultServiceSecurityGroup",
      { vpc: this.vpc, description: "Security group for vault ECS tasks" },
    );

    this.safetySecurityGroup = new ec2.SecurityGroup(
      this,
      "SafetySecurityGroup",
      {
        vpc: this.vpc,
        description: "Safety service - session DB read only",
      },
    );

    // ALB security group — allows HTTP/HTTPS from anywhere
    this.albSecurityGroup = new ec2.SecurityGroup(this, "AlbSecurityGroup", {
      vpc: this.vpc,
      description: "ALB security group - allows HTTP/HTTPS inbound",
      allowAllOutbound: true,
    });
    this.albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "HTTP inbound",
    );
    this.albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "HTTPS inbound",
    );

    // Vault DB: inbound from vault service SG on 5432
    this.vaultSecurityGroup.addIngressRule(
      this.vaultServiceSecurityGroup,
      ec2.Port.tcp(5432),
      "Vault service ECS tasks access to Vault DB",
    );

    // Allow vault service to reach vault DB (egress)
    this.vaultSecurityGroup.addEgressRule(
      this.vaultServiceSecurityGroup,
      ec2.Port.tcp(5432),
      "Vault service to Vault DB",
    );

    // Session DB: inbound from session ECS tasks (not the DB SG itself)
    this.sessionSecurityGroup.addIngressRule(
      this.sessionServiceSecurityGroup,
      ec2.Port.tcp(5432),
      "Session service ECS tasks access to Session DB",
    );

    // Safety SG can read session DB (ingress from safety SG on 5432)
    this.sessionSecurityGroup.addIngressRule(
      this.safetySecurityGroup,
      ec2.Port.tcp(5432),
      "Safety service read access to Session DB",
    );

    // Allow ALB to reach ECS services on application ports
    this.vaultServiceSecurityGroup.addIngressRule(
      this.albSecurityGroup,
      ec2.Port.tcp(3001),
      "ALB access to vault service",
    );
    this.sessionServiceSecurityGroup.addIngressRule(
      this.albSecurityGroup,
      ec2.Port.tcp(3000),
      "ALB access to session service",
    );
    this.safetySecurityGroup.addIngressRule(
      this.albSecurityGroup,
      ec2.Port.tcp(3002),
      "ALB access to safety service",
    );

    // Application Load Balancer in public subnet
    const alb = new elbv2.ApplicationLoadBalancer(this, "HipsAlb", {
      vpc: this.vpc,
      internetFacing: true,
      securityGroup: this.albSecurityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    // HTTP listener only — HTTPS certificate requires a real domain (add when ready)
    const httpListener = alb.addListener("HttpListener", {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
    });

    // Vault service target group
    const vaultTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      "VaultTargetGroup",
      {
        vpc: this.vpc,
        port: 3001,
        protocol: elbv2.ApplicationProtocol.HTTP,
        targetType: elbv2.TargetType.IP,
        healthCheck: {
          path: "/healthz",
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(5),
        },
      },
    );

    // Session service target group
    const sessionTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      "SessionTargetGroup",
      {
        vpc: this.vpc,
        port: 3000,
        protocol: elbv2.ApplicationProtocol.HTTP,
        targetType: elbv2.TargetType.IP,
        healthCheck: {
          path: "/health",
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(5),
        },
      },
    );

    // Safety service target group
    const safetyTargetGroup = new elbv2.ApplicationTargetGroup(
      this,
      "SafetyTargetGroup",
      {
        vpc: this.vpc,
        port: 3002,
        protocol: elbv2.ApplicationProtocol.HTTP,
        targetType: elbv2.TargetType.IP,
        healthCheck: {
          path: "/health",
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(5),
        },
      },
    );

    // Path-based routing: /vault/* → vault, /session/* → session, /safety/* → safety
    httpListener.addTargetGroups("VaultTargetGroup", {
      targetGroups: [vaultTargetGroup],
      priority: 1,
      conditions: [elbv2.ListenerCondition.pathPatterns(["/vault/*"])],
    });
    httpListener.addTargetGroups("SessionTargetGroup", {
      targetGroups: [sessionTargetGroup],
      priority: 2,
      conditions: [elbv2.ListenerCondition.pathPatterns(["/session/*"])],
    });
    httpListener.addTargetGroups("SafetyTargetGroup", {
      targetGroups: [safetyTargetGroup],
      priority: 3,
      conditions: [elbv2.ListenerCondition.pathPatterns(["/safety/*"])],
    });

    // Default target group (fallback for root path)
    httpListener.addTargetGroups("DefaultTargetGroup", {
      targetGroups: [vaultTargetGroup],
    });

    // Export security groups for ECS task attachment
    new cdk.CfnOutput(this, "SessionServiceSecurityGroupId", {
      value: this.sessionServiceSecurityGroup.securityGroupId,
      exportName: "HIPS-SessionServiceSecurityGroup",
    });

    new cdk.CfnOutput(this, "VaultServiceSecurityGroupId", {
      value: this.vaultServiceSecurityGroup.securityGroupId,
      exportName: "HIPS-VaultServiceSecurityGroup",
    });

    // Export ALB DNS name and target group ARNs
    new cdk.CfnOutput(this, "AlbDnsName", {
      value: alb.loadBalancerDnsName,
      exportName: "HIPS-AlbDnsName",
    });
    new cdk.CfnOutput(this, "AlbArn", {
      value: alb.loadBalancerArn,
      exportName: "HIPS-AlbArn",
    });
    new cdk.CfnOutput(this, "VaultTargetGroupArn", {
      value: vaultTargetGroup.targetGroupArn,
      exportName: "HIPS-VaultTargetGroupArn",
    });
    new cdk.CfnOutput(this, "SessionTargetGroupArn", {
      value: sessionTargetGroup.targetGroupArn,
      exportName: "HIPS-SessionTargetGroupArn",
    });
    new cdk.CfnOutput(this, "SafetyTargetGroupArn", {
      value: safetyTargetGroup.targetGroupArn,
      exportName: "HIPS-SafetyTargetGroupArn",
    });
    new cdk.CfnOutput(this, "AlbSecurityGroupId", {
      value: this.albSecurityGroup.securityGroupId,
      exportName: "HIPS-AlbSecurityGroupId",
    });
  }
}