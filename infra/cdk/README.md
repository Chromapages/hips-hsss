# H.I.P.S. Infrastructure Placeholder

Part 1 requires AWS VPC, isolated vault subnets, encrypted RDS, and a KMS key.
Those resources need account-specific configuration, so this folder records the
target boundary until CDK code is added with real account and region inputs.

Required stacks:

- `CommerceStack`: Railway/Vercel integration references only.
- `SessionStack`: private RDS and service network for anonymous room records.
- `VaultStack`: isolated subnet group, encrypted RDS, KMS key rotation, and
  allowlisted internal API ingress.

Security invariant: no stack may create a route from commerce data stores to the
session database or identity vault database.
