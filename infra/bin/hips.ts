import * as cdk from "aws-cdk-lib";
import { VpcStack } from "../lib/vpc-stack";
import { DatabaseStack } from "../lib/database-stack";
import { VaultStack } from "../lib/vault-stack";
import { EcsStack } from "../lib/ecs-stack";
import { MonitoringStack } from "../lib/monitoring-stack";

const app = new cdk.App();

// Read environment from CDK context (--context environment=staging)
const environment = app.node.tryGetContext("environment") || "staging";

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || "us-east-1",
};

// Build order: VPC → Vault (for KMS key) → Database → ECS → Monitoring
const vpcStack = new VpcStack(app, `HipsVpcStack-${environment}`, { env });

const vaultStack = new VaultStack(app, `HipsVaultStack-${environment}`, {
  vpcStack,
  env,
});

const databaseStack = new DatabaseStack(app, `HipsDatabaseStack-${environment}`, {
  vpcStack,
  vaultStack,
  env,
});

const ecsStack = new EcsStack(app, `HipsEcsStack-${environment}`, {
  vpcStack,
  vaultStack,
  databaseStack,
  env,
});

const monitoringStack = new MonitoringStack(app, `HipsMonitoringStack-${environment}`, {
  env,
  ecsCluster: ecsStack.cluster,
  sessionKmsKey: databaseStack.sessionKmsKey,
});
monitoringStack.addDependency(ecsStack);

// Tag all resources
cdk.Tags.of(app).add("Project", "HIPS");
cdk.Tags.of(app).add("Environment", environment);
cdk.Tags.of(app).add("HIPAA", "true");
