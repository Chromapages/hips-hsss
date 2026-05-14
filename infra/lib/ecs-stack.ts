import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as servicediscovery from "aws-cdk-lib/aws-servicediscovery";
import { VpcStack } from "./vpc-stack";
import { VaultStack } from "./vault-stack";
import { DatabaseStack } from "./database-stack";

export interface ServiceTaskDefinitionProps {
  imageName: string;
  serviceName: string;
  cpu: number;
  memory: number;
  environment: Record<string, string>;
  secrets?: Record<string, string>;
  portMappings?: { containerPort: number; protocol?: ecs.Protocol }[];
  desiredCount?: number;
  healthCheckPath?: string;
}

export class EcsStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  public readonly vaultTaskDefinition: ecs.FargateTaskDefinition;
  public readonly sessionTaskDefinition: ecs.FargateTaskDefinition;
  public readonly safetyTaskDefinition: ecs.FargateTaskDefinition;
  public readonly vaultService: ecs.FargateService;
  public readonly sessionService: ecs.FargateService;
  public readonly safetyService: ecs.FargateService;

  constructor(
    scope: Construct,
    id: string,
    props: {
      vpcStack: VpcStack;
      vaultStack: VaultStack;
      databaseStack: DatabaseStack;
    } & cdk.StackProps,
  ) {
    super(scope, id, props);

    const { vpcStack: vpc, vaultStack: vault, databaseStack } = props;
    this.addDependency(databaseStack);

    // ─── ECR Repositories ──────────────────────────────────────────────────────
    // Create repos here so they exist before the CI image-push step runs.
    const vaultRepo = new ecr.Repository(this, "VaultRepo", {
      repositoryName: "hips-vault-service",
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      imageScanOnPush: true,
      lifecycleRules: [
        { maxImageCount: 10, description: "Keep last 10 images" },
      ],
    });

    const sessionRepo = new ecr.Repository(this, "SessionRepo", {
      repositoryName: "hips-session-service",
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      imageScanOnPush: true,
      lifecycleRules: [
        { maxImageCount: 10, description: "Keep last 10 images" },
      ],
    });

    const safetyRepo = new ecr.Repository(this, "SafetyRepo", {
      repositoryName: "hips-safety-service",
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      imageScanOnPush: true,
      lifecycleRules: [
        { maxImageCount: 10, description: "Keep last 10 images" },
      ],
    });

    const vaultDbSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "VaultDbSecret",
      "hips/vault/db",
    );
    const sessionDbSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "SessionDbSecret",
      "hips/session/db",
    );
    const safetyDbSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "SafetyDbReadOnlySecret",
      "hips/safety/db",
    );
    const vaultDbHostname = cdk.Fn.importValue("HIPS-VaultDbHostname");
    const sessionDbHostname = cdk.Fn.importValue("HIPS-SessionDbHostname");
    const vaultTargetGroupArn = cdk.Fn.importValue("HIPS-VaultTargetGroupArn");
    const sessionTargetGroupArn = cdk.Fn.importValue("HIPS-SessionTargetGroupArn");
    const safetyTargetGroupArn = cdk.Fn.importValue("HIPS-SafetyTargetGroupArn");

    // Import target groups from VPC stack via fromTargetGroupAttributes
    // (fromTargetGroupArn does not exist in CDK v2.253.1)
    const vaultTargetGroup = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(
      this,
      "VaultTargetGroupImport",
      { targetGroupArn: vaultTargetGroupArn },
    );
    const sessionTargetGroup = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(
      this,
      "SessionTargetGroupImport",
      { targetGroupArn: sessionTargetGroupArn },
    );
    const safetyTargetGroup = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(
      this,
      "SafetyTargetGroupImport",
      { targetGroupArn: safetyTargetGroupArn },
    );

    const awsLogDriver = (streamPrefix: string) =>
      ecs.LogDrivers.awsLogs({
        streamPrefix,
        logRetention: logs.RetentionDays.ONE_MONTH,
      });

    // Cluster for all HIPS services — cluster name is environment-aware
    const envName = scope.node.tryGetContext("environment") || process.env.ENVIRONMENT || "staging";
    const clusterName = `hips-platform-${envName}`;
    this.cluster = new ecs.Cluster(this, "HipsCluster", {
      vpc: vpc.vpc,
      clusterName,
      defaultCloudMapNamespace: {
        name: "hips.internal",
      },
    });

    // ─── Vault Service ─────────────────────────────────────────────────────────

    this.vaultTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "VaultTaskDef",
      {
        cpu: 256,
        memoryLimitMiB: 512,
        taskRole: vault.vaultServiceRole,
      },
    );
    // Grant task execution role permission to pull from ECR
    vaultRepo.grantPull(this.vaultTaskDefinition.obtainExecutionRole());

    const vaultContainer = this.vaultTaskDefinition.addContainer(
      "VaultContainer",
      {
        // Use the ECR repo URI — resolves to the correct registry at deploy time
        image: ecs.ContainerImage.fromEcrRepository(vaultRepo, process.env.IMAGE_TAG || "latest"),
        containerName: "vault-service",
        portMappings: [{ containerPort: 3001 }],
        logging: awsLogDriver("vault-service"),
        healthCheck: {
          command: ["CMD-SHELL", "curl -f http://localhost:3001/healthz || exit 1"],
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(5),
          retries: 3,
          startPeriod: cdk.Duration.seconds(60),
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV || "production",
          VAULT_DATABASE_URL: `postgresql://vaultadmin@${vaultDbHostname}:5432/hips_vault`,
          VAULT_INTERNAL_SECRET: process.env.VAULT_INTERNAL_SECRET || "missing-required-env-var",
          AWS_REGION: cdk.Stack.of(this).region,
        },
        secrets: {
          VAULT_DB_PASSWORD: ecs.Secret.fromSecretsManager(vaultDbSecret, "password"),
        },
      },
    );

    this.vaultService = new ecs.FargateService(this, "VaultService", {
      cluster: this.cluster,
      taskDefinition: this.vaultTaskDefinition,
      serviceName: "vault-service",
      desiredCount: 2,
      healthCheckGracePeriod: cdk.Duration.seconds(30),
      securityGroups: [vpc.vaultSecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      cloudMapOptions: {
        name: "vault-service",
        dnsRecordType: servicediscovery.DnsRecordType.A,
        failureThreshold: 2,
      },
    });

    // ─── Session Service ────────────────────────────────────────────────────────

    // Session service IAM role
    const sessionTaskRole = new iam.Role(this, "SessionTaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      description: "ECS task role for session service",
    });

    // Grant session service access to secrets
    sessionTaskRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [
          sessionDbSecret.secretArn,
        ],
      }),
    );

    // Grant session service access to vault
    sessionTaskRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [
          cdk.Stack.of(this).formatArn({
            service: "secretsmanager",
            resource: "secret",
            resourceName: "hips/vault/*",
          }),
        ],
      }),
    );

    // Grant session service KMS permissions for encryption/decryption
    sessionTaskRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["kms:Encrypt", "kms:Decrypt", "kms:GenerateDataKey"],
        resources: [databaseStack.sessionKmsKey.keyArn],
      }),
    );

    this.sessionTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "SessionTaskDef",
      {
        cpu: 256,
        memoryLimitMiB: 512,
        taskRole: sessionTaskRole,
      },
    );
    // Grant task execution role permission to pull from ECR
    sessionRepo.grantPull(this.sessionTaskDefinition.obtainExecutionRole());

    const sessionContainer = this.sessionTaskDefinition.addContainer(
      "SessionContainer",
      {
        // Use the ECR repo URI — resolves to the correct registry at deploy time
        image: ecs.ContainerImage.fromEcrRepository(sessionRepo, process.env.IMAGE_TAG || "latest"),
        containerName: "session-service",
        portMappings: [{ containerPort: 3000 }],
        logging: awsLogDriver("session-service"),
        healthCheck: {
          command: ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(5),
          retries: 3,
          startPeriod: cdk.Duration.seconds(60),
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV || "production",
          SESSION_DATABASE_URL: `postgresql://sessionadmin@${sessionDbHostname}:5432/hips_session`,
          VAULT_API_URL: `https://vault.${this.domain()}`,
          VAULT_API_SECRET: process.env.VAULT_API_SECRET || "",
          SAFETY_ENGINE_URL: `http://safety.${this.domain()}:3002`,
          SAFETY_ENGINE_SECRET: process.env.SAFETY_ENGINE_SECRET || "",
        },
        secrets: {
          SESSION_DB_PASSWORD: ecs.Secret.fromSecretsManager(sessionDbSecret, "password"),
        },
      },
    );

    this.sessionService = new ecs.FargateService(this, "SessionService", {
      cluster: this.cluster,
      taskDefinition: this.sessionTaskDefinition,
      serviceName: "session-service",
      desiredCount: 2,
      healthCheckGracePeriod: cdk.Duration.seconds(30),
      securityGroups: [vpc.sessionSecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      cloudMapOptions: {
        name: "session-service",
        dnsRecordType: servicediscovery.DnsRecordType.A,
        failureThreshold: 2,
      },
    });

    // ─── Safety Service ─────────────────────────────────────────────────────────

    // Safety service IAM role
    const safetyTaskRole = new iam.Role(this, "SafetyTaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      description: "ECS task role for safety service",
    });

    // Grant safety service access to secrets
    safetyTaskRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [
          safetyDbSecret.secretArn,
        ],
      }),
    );

    this.safetyTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "SafetyTaskDef",
      {
        cpu: 256,
        memoryLimitMiB: 512,
        taskRole: safetyTaskRole,
      },
    );
    // Grant task execution role permission to pull from ECR
    safetyRepo.grantPull(this.safetyTaskDefinition.obtainExecutionRole());

    const safetyContainer = this.safetyTaskDefinition.addContainer(
      "SafetyContainer",
      {
        // Use the ECR repo URI — resolves to the correct registry at deploy time
        image: ecs.ContainerImage.fromEcrRepository(safetyRepo, process.env.IMAGE_TAG || "latest"),
        containerName: "safety-service",
        portMappings: [{ containerPort: 3002 }],
        logging: awsLogDriver("safety-service"),
        healthCheck: {
          command: ["CMD-SHELL", "curl -f http://localhost:3002/health || exit 1"],
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(5),
          retries: 3,
          startPeriod: cdk.Duration.seconds(60),
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV || "production",
          SESSION_DATABASE_URL: `postgresql://sessionadmin@${sessionDbHostname}:5432/hips_session`,
          SAFETY_ENGINE_SECRET: process.env.SAFETY_ENGINE_SECRET || "",
        },
        secrets: {
          SESSION_DB_PASSWORD: ecs.Secret.fromSecretsManager(safetyDbSecret, "password"),
        },
      },
    );

    this.safetyService = new ecs.FargateService(this, "SafetyService", {
      cluster: this.cluster,
      taskDefinition: this.safetyTaskDefinition,
      serviceName: "safety-service",
      desiredCount: 1,
      healthCheckGracePeriod: cdk.Duration.seconds(30),
      securityGroups: [vpc.safetySecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      cloudMapOptions: {
        name: "safety-service",
        dnsRecordType: servicediscovery.DnsRecordType.A,
        failureThreshold: 2,
      },
    });

    // Register ECS services as targets on the ALB target groups
    // Uses cast to 'any' to work around CDK type definition gap — attachToApplicationTargetGroup
    // exists at runtime on BaseService.prototype but is not exposed in FargateService TypeScript types
    (this.vaultService as any).attachToApplicationTargetGroup(vaultTargetGroup);
    (this.sessionService as any).attachToApplicationTargetGroup(sessionTargetGroup);
    (this.safetyService as any).attachToApplicationTargetGroup(safetyTargetGroup);

    // ─── Auto Scaling ──────────────────────────────────────────────────────────

    // Session service scaling
    const sessionScaling = this.sessionService.autoScaleTaskCount({
      maxCapacity: 10,
      minCapacity: 2,
    });
    sessionScaling.scaleOnCpuUtilization("SessionCpuScaling", {
      targetUtilizationPercent: 70,
    });
    sessionScaling.scaleOnMemoryUtilization("SessionMemoryScaling", {
      targetUtilizationPercent: 80,
    });

    // Vault service scaling
    const vaultScaling = this.vaultService.autoScaleTaskCount({
      maxCapacity: 5,
      minCapacity: 2,
    });
    vaultScaling.scaleOnCpuUtilization("VaultCpuScaling", {
      targetUtilizationPercent: 70,
    });

    // Safety service scaling
    const safetyScaling = this.safetyService.autoScaleTaskCount({
      maxCapacity: 5,
      minCapacity: 1,
    });
    safetyScaling.scaleOnCpuUtilization("SafetyCpuScaling", {
      targetUtilizationPercent: 70,
    });
  }

  private domain(): string {
    return process.env.DOMAIN || "hips.internal";
  }
}
