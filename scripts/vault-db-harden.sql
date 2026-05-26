-- Vault DB Permission Hardening
-- Per Phase 1C.5 and migration-notes.md
-- Execute AFTER prisma migrate deploy against vault database

-- Ensure vault_api_user exists (adjust role name as needed for your deployment)
-- CREATE ROLE IF NOT EXISTS vault_api_user;
-- CREATE ROLE IF NOT EXISTS vault_audit_user;

-- Revoke UPDATE and DELETE on VaultAccessLog from vault_api_user (read-only on access log)
REVOKE UPDATE, DELETE ON TABLE "VaultAccessLog" FROM vault_api_user;

-- Grant INSERT on VaultAccessLog to vault_audit_user (for expiry cron jobs running as system actor)
GRANT INSERT ON TABLE "VaultAccessLog" TO vault_audit_user;

-- IdentityRecord: read/write for vault_api_user (normal service operations)
-- No additional restrictions on IdentityRecord — all PII is encrypted at rest
