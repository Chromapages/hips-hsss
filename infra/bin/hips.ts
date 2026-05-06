import "aws-cdk-lib/cloudfront-origins";
import * as cdk from "aws-cdk-lib";
import { VpcStack } from "./lib/vpc-stack";
import { DatabaseStack } from "./lib/database-stack";
import { VaultStack } from "./lib/vault-stack";
import { MonitoringStack } from "./lib/monitoring-stack";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || "us-east-1",
};

// Build order: VPC → Database → Vault → Monitoring
const vpcStack = new VpcStack(app, "HipsVpcStack", { env });

const databaseStack = new DatabaseStack(app, "HipsDatabaseStack", {
  vpcStack,
  env,
});

const vaultStack = new VaultStack(app, "HipsVaultStack", {
  vpcStack,
  env,
});

new MonitoringStack(app, "HipsMonitoringStack", { env });

// Tag all resources
cdk.Tags.of(app).add("Project", "HIPS");
cdk.Tags.of(app).add("Environment", process.env.NODE_ENV || "development");
cdk.Tags.of(app).add("HIPAA", "true");
