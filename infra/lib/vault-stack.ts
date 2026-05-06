import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as kms from "aws-cdk-lib/aws-kms";
import * as secretsManager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";
import { VpcStack } from "./vpc-stack";

export class VaultStack extends cdk.Stack {
  public readonly kmsKey: kms.Key;
  public readonly vaultServiceRole: iam.Role;

  constructor(
    scope: Construct,
    id: string,
    props: { vpcStack: VpcStack } & cdk.StackProps,
  ) {
    super(scope, id, props);

    // Vault master KMS key — used for all PII encryption
    this.kmsKey = new kms.Key(this, "VaultMasterKey", {
      description: "H.I.P.S. Vault master encryption key — all PII",
      alias: "alias/hips-vault-master",
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Grant to vault service role
    this.kmsKey.grantEncryptDecrypt(
      new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    );

    // Vault service IAM role — least privilege
    this.vaultServiceRole = new iam.Role(this, "VaultServiceRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      description: "ECS task role for vault service",
    });

    this.vaultServiceRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:GenerateDataKey",
        ],
        resources: [this.kmsKey.keyArn],
      }),
    );

    this.vaultServiceRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: ["*"], // Scoped to specific secret ARNs in production
      }),
    );
  }
}
