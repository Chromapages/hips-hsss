-- Data Separation Permission Hardening — ALL THREE DATABASES
-- Run AFTER prisma migrate deploy on each database
-- Order: session → vault → safety (or any order, they're independent)
--
-- Prerequisite: postgres superuser or equivalent to create roles and grant permissions
--
-- ⚠️  These scripts assume role names as shown. Update if your role names differ.

-- ============================================================
-- SESSION DATABASE (session.prisma)
-- ============================================================
-- Run as: psql SESSION_DATABASE_URL -f scripts/data-separation-harden.sql

-- Create role for session API (the user NestJS connects as)
-- CREATE ROLE session_api_user WITH LOGIN PASSWORD 'your_secure_password';
-- CREATE ROLE session_audit_user WITH LOGIN PASSWORD 'your_secure_password';

-- AuditEvent must be INSERT-ONLY — session API can only INSERT, audit user can SELECT
REVOKE UPDATE, DELETE ON TABLE "AuditEvent" FROM session_api_user;
GRANT SELECT ON TABLE "AuditEvent" TO session_api_user;   -- if not already granted
GRANT INSERT ON TABLE "AuditEvent" TO session_api_user; -- if not already granted
GRANT SELECT ON TABLE "AuditEvent" TO session_audit_user;

-- SessionRecord and GroupSessionRecord: full access for session API
-- GRANT SELECT, INSERT, UPDATE ON TABLE "SessionRecord" TO session_api_user;
-- GRANT SELECT, INSERT, UPDATE ON TABLE "GroupSessionRecord" TO session_api_user;

-- ============================================================
-- VAULT DATABASE (vault.prisma)
-- ============================================================
-- Run as: psql VAULT_DATABASE_URL -f scripts/data-separation-harden.sql

-- Create role for vault API
-- CREATE ROLE vault_api_user WITH LOGIN PASSWORD 'your_secure_password';
-- CREATE ROLE vault_audit_user WITH LOGIN PASSWORD 'your_secure_password';

-- VaultAccessLog: INSERT-only for vault_api_user (write access is system-only via audit_user)
REVOKE UPDATE, DELETE ON TABLE "VaultAccessLog" FROM vault_api_user;
GRANT INSERT ON TABLE "VaultAccessLog" TO vault_api_user;
GRANT SELECT ON TABLE "VaultAccessLog" TO vault_audit_user;

-- IdentityRecord: full CRUD for vault_api_user (all PII already encrypted at application level)
-- GRANT ALL ON TABLE "IdentityRecord" TO vault_api_user;

-- ============================================================
-- SAFETY DATABASE (safety.prisma)
-- ============================================================
-- Run as: psql SAFETY_DATABASE_URL -f scripts/data-separation-harden.sql

-- SafetyAlert, SafetyMitigation, SafetyStrike, SafetyAuditLog, EscalationQueue
-- All access to safety_api_user for normal service operations
-- Safety audit user (vault_audit_user in production) should have SELECT on EscalationQueue

-- GRANT ALL ON TABLE "SafetyAlert" TO safety_api_user;
-- GRANT ALL ON TABLE "SafetyMitigation" TO safety_api_user;
-- GRANT ALL ON TABLE "SafetyStrike" TO safety_api_user;
-- GRANT ALL ON TABLE "SafetyAuditLog" TO safety_api_user;
-- GRANT ALL ON TABLE "EscalationQueue" TO safety_api_user;
-- GRANT SELECT ON TABLE "EscalationQueue" TO vault_audit_user;
