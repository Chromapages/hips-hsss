import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as kms from "aws-cdk-lib/aws-kms";
import * as iam from "aws-cdk-lib/aws-iam";

export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly sessionSecurityGroup: ec2.SecurityGroup;
  public readonly vaultSecurityGroup: ec2.SecurityGroup;
  public readonly safetySecurityGroup: ec2.SecurityGroup;

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
      NATGateways: 1,
    });

    // Security groups per service — enforce at network level
    this.sessionSecurityGroup = new ec2.SecurityGroup(
      this,
      "SessionSecurityGroup",
      { vpc: this.vpc, description: "Session service — session DB only" },
    );

    this.vaultSecurityGroup = new ec2.SecurityGroup(
      this,
      "VaultSecurityGroup",
      {
        vpc: this.vpc,
        description: "Vault service — vault DB only",
        allowAllOutbound: false,
      },
    );

    this.safetySecurityGroup = new ec2.SecurityGroup(
      this,
      "SafetySecurityGroup",
      {
        vpc: this.vpc,
        description: "Safety service — session DB read only",
      },
    );

    // Vault DB: inbound from vault SG only on 5432
    this.vaultSecurityGroup.addIngressRule(
      this.vaultSecurityGroup,
      ec2.Port.tcp(5432),
      "Vault DB access",
    );

    // Session DB: inbound from session SG only on 5432
    // Safety SG can read session DB (ingress from safety SG on 5432)
  }
}
