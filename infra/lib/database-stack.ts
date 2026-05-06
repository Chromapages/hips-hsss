import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as kms from "aws-cdk-lib/aws-kms";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { VpcStack } from "./vpc-stack";

export class DatabaseStack extends cdk.Stack {
  public readonly vaultDb: rds.DatabaseInstance;
  public readonly sessionDb: rds.DatabaseInstance;

  constructor(
    scope: Construct,
    id: string,
    props: { vpcStack: VpcStack } & cdk.StackProps,
  ) {
    super(scope, id, props);

    const { vpcStack } = props;

    // KMS key for vault DB encryption
    const vaultKmsKey = new kms.Key(this, "VaultDbKey", {
      description: "KMS key for Identity Vault PostgreSQL DB",
      alias: "alias/hips-vault-prod",
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Vault DB — isolated subnet, KMS encrypted, no public access
    this.vaultDb = new rds.DatabaseInstance(this, "VaultDb", {
      engine: rds.DatabaseEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      credentials: rds.Credentials.fromGeneratedSecret("vaultadmin"),
      vpc: vpcStack.vpc,
      vpcSubnets: {
        subnetGroupName: "IsolatedData",
      },
      securityGroups: [vpcStack.vaultSecurityGroup],
      storageEncryptionKey: vaultKmsKey,
      publiclyAccessible: false,
      allocatedStorage: 20,
      multiAz: true,
      backupRetention: cdk.Duration.days(30),
    });

    // Session DB — separate instance, no KMS (no PII)
    this.sessionDb = new rds.DatabaseInstance(this, "SessionDb", {
      engine: rds.DatabaseEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      credentials: rds.Credentials.fromGeneratedSecret("sessionadmin"),
      vpc: vpcStack.vpc,
      vpcSubnets: {
        subnetGroupName: "PrivateApp",
      },
      securityGroups: [vpcStack.sessionSecurityGroup],
      publiclyAccessible: false,
      allocatedStorage: 20,
      backupRetention: cdk.Duration.days(7),
    });
  }
}
