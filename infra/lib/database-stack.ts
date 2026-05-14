import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as kms from "aws-cdk-lib/aws-kms";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { VpcStack } from "./vpc-stack";
import { VaultStack } from "./vault-stack";

export interface DatabaseStackProps extends cdk.StackProps {
  vpcStack: VpcStack;
  vaultStack: VaultStack;
}

export class DatabaseStack extends cdk.Stack {
  public readonly vaultDb: rds.DatabaseInstance;
  public readonly sessionDb: rds.DatabaseInstance;
  public readonly sessionKmsKey: kms.Key;

  constructor(
    scope: Construct,
    id: string,
    props: DatabaseStackProps,
  ) {
    super(scope, id, props);

    const { vpcStack, vaultStack } = props;

    // Vault DB — isolated subnet, KMS encrypted with vault master key, no public access
    // Uses the same KMS key as the vault service for unified key management
    this.vaultDb = new rds.DatabaseInstance(this, "VaultDb", {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      credentials: rds.Credentials.fromGeneratedSecret("vaultadmin"),
      vpc: vpcStack.vpc,
      vpcSubnets: {
        subnetGroupName: "IsolatedData",
      },
      securityGroups: [vpcStack.vaultSecurityGroup],
      storageEncryptionKey: vaultStack.kmsKey,
      publiclyAccessible: false,
      allocatedStorage: 20,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      multiAz: false,
      backupRetention: cdk.Duration.days(0),
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    new cdk.CfnOutput(this, "VaultDbHostname", {
      value: this.vaultDb.dbInstanceEndpointAddress,
      exportName: "HIPS-VaultDbHostname",
    });

    // Session DB — isolated subnet, KMS encrypted for HIPAA compliance
    this.sessionKmsKey = new kms.Key(this, "SessionDbKey", {
      description: "KMS key for Session DB encryption",
      alias: "alias/hips-session-prod",
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.sessionDb = new rds.DatabaseInstance(this, "SessionDb", {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      credentials: rds.Credentials.fromGeneratedSecret("sessionadmin"),
      vpc: vpcStack.vpc,
      vpcSubnets: {
        subnetGroupName: "PrivateApp",
      },
      securityGroups: [vpcStack.sessionSecurityGroup],
      storageEncryptionKey: this.sessionKmsKey,
      publiclyAccessible: false,
      allocatedStorage: 20,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      multiAz: false,
      backupRetention: cdk.Duration.days(0),
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    new cdk.CfnOutput(this, "SessionDbHostname", {
      value: this.sessionDb.dbInstanceEndpointAddress,
      exportName: "HIPS-SessionDbHostname",
    });

    new cdk.CfnOutput(this, "SessionKmsKeyId", {
      value: this.sessionKmsKey.keyId,
      exportName: "HIPS-SessionKMSKeyId",
    });
  }
}
