# H.I.P.S. Platform — AWS Infrastructure as Code (CDK)

This directory contains AWS CDK stacks for the HIPAA-compliant infrastructure.

## Stacks

| Stack | Description |
|-------|-------------|
| `lib/vpc-stack.ts` | VPC, subnets, security groups, NAT gateway |
| `lib/database-stack.ts` | RDS instances (session-db, vault-db) |
| `lib/vault-stack.ts` | KMS key, Vault ECS task, IAM role |
| `lib/session-stack.ts` | Session + Safety ECS tasks |
| `lib/monitoring-stack.ts` | CloudWatch alarms, SNS, PagerDuty |

## Setup

```bash
cd infra
pnpm install
pnpm cdk bootstrap
pnpm cdk deploy --all
```

## Prerequisites

- AWS CLI configured with appropriate credentials
- CDK v2
- Node.js 20+
