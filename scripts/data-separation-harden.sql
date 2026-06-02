-- =====================================================================
-- HIPS Data Separation: Permission Hardening (peak hardening)
-- =====================================================================
-- Run AFTER `prisma migrate deploy` on each database.
-- Run as a superuser (postgres) the first time. Idempotent on re-run.
--
-- Order: apply per-DB sections in this order: session → vault → safety.
-- (Cross-DB independence aside, the migration-notes.md down-order
-- reverses in the opposite direction — safety → vault → session.)
--
-- Hardening layers:
--   1. Cluster-level:  password hashing, SSL
--   2. Role creation:  bounded, no-inherit, distinct per DB
--   3. Role settings:  timeouts, search_path, row_security per role
--   4. Default privs:  revoke PUBLIC from future tables in public schema
--   5. Per-DB grants:  explicit least-privilege matching service usage
--   6. RLS (off):      defense-in-depth policies, ready to enable
--
-- Roles per database (one set each):
--   <db>_api_user     — service account the NestJS app connects as
--   <db>_audit_user   — read-only, used for cron expiry + human review
--
-- All secrets in this file are placeholders. Inject at deploy time.

-- =====================================================================
-- 1. CLUSTER-LEVEL (run once per cluster)
-- =====================================================================
-- SCRAM-SHA-256 password hashing so secrets never traverse the wire in cleartext.
-- ALTER SYSTEM SET password_encryption = 'scram-sha-256';
-- SELECT pg_reload_conf();
--
-- Require SSL for all connections. Enforce via pg_hba.conf with hostssl rules.
-- ALTER SYSTEM SET ssl = on;
-- SELECT pg_reload_conf();

-- =====================================================================
-- 2. ROLE CREATION (run once per cluster — roles are cluster-wide)
-- =====================================================================
-- Re-runnable: wraps in DO blocks so the script is safe to re-execute.
-- Replace 'REPLACE_AT_DEPLOY' with secrets injected by your deploy pipeline.
--
-- DO $$ BEGIN
--     CREATE ROLE session_api_user   WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 50;
-- EXCEPTION WHEN duplicate_object THEN
--     ALTER  ROLE session_api_user   WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 50;
-- END $$;
-- DO $$ BEGIN
--     CREATE ROLE session_audit_user WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 10;
-- EXCEPTION WHEN duplicate_object THEN
--     ALTER  ROLE session_audit_user WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 10;
-- END $$;
-- DO $$ BEGIN
--     CREATE ROLE vault_api_user     WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 50;
-- EXCEPTION WHEN duplicate_object THEN
--     ALTER  ROLE vault_api_user     WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 50;
-- END $$;
-- DO $$ BEGIN
--     CREATE ROLE vault_audit_user   WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 10;
-- EXCEPTION WHEN duplicate_object THEN
--     ALTER  ROLE vault_audit_user   WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 10;
-- END $$;
-- DO $$ BEGIN
--     CREATE ROLE safety_api_user    WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 50;
-- EXCEPTION WHEN duplicate_object THEN
--     ALTER  ROLE safety_api_user    WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 50;
-- END $$;
-- DO $$ BEGIN
--     CREATE ROLE safety_audit_user  WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 10;
-- EXCEPTION WHEN duplicate_object THEN
--     ALTER  ROLE safety_audit_user  WITH LOGIN PASSWORD 'REPLACE_AT_DEPLOY' CONNECTION LIMIT 10;
-- END $$;

-- =====================================================================
-- 3. ROLE SETTINGS (idempotent — safe to re-run)
-- =====================================================================
-- Prevents DoS via runaway queries, function-search-path hijacks, and
-- forces RLS to be evaluated. Apply to every service role.
--
-- ALTER ROLE session_api_user   SET statement_timeout               = '30s';
-- ALTER ROLE session_api_user   SET idle_in_transaction_session_timeout = '60s';
-- ALTER ROLE session_api_user   SET lock_timeout                   = '10s';
-- ALTER ROLE session_api_user   SET search_path                    = public, pg_catalog;
-- ALTER ROLE session_api_user   SET row_security                   = on;
-- ALTER ROLE session_audit_user SET statement_timeout               = '120s';
-- ALTER ROLE session_audit_user SET idle_in_transaction_session_timeout = '60s';
-- ALTER ROLE session_audit_user SET lock_timeout                   = '10s';
-- ALTER ROLE session_audit_user SET search_path                    = public, pg_catalog;
-- ALTER ROLE session_audit_user SET row_security                   = on;
-- ALTER ROLE vault_api_user     SET statement_timeout               = '30s';
-- ALTER ROLE vault_api_user     SET idle_in_transaction_session_timeout = '60s';
-- ALTER ROLE vault_api_user     SET lock_timeout                   = '10s';
-- ALTER ROLE vault_api_user     SET search_path                    = public, pg_catalog;
-- ALTER ROLE vault_api_user     SET row_security                   = on;
-- ALTER ROLE vault_audit_user   SET statement_timeout               = '120s';
-- ALTER ROLE vault_audit_user   SET idle_in_transaction_session_timeout = '60s';
-- ALTER ROLE vault_audit_user   SET lock_timeout                   = '10s';
-- ALTER ROLE vault_audit_user   SET search_path                    = public, pg_catalog;
-- ALTER ROLE vault_audit_user   SET row_security                   = on;
-- ALTER ROLE safety_api_user    SET statement_timeout               = '30s';
-- ALTER ROLE safety_api_user    SET idle_in_transaction_session_timeout = '60s';
-- ALTER ROLE safety_api_user    SET lock_timeout                   = '10s';
-- ALTER ROLE safety_api_user    SET search_path                    = public, pg_catalog;
-- ALTER ROLE safety_api_user    SET row_security                   = on;
-- ALTER ROLE safety_audit_user  SET statement_timeout               = '120s';
-- ALTER ROLE safety_audit_user  SET idle_in_transaction_session_timeout = '60s';
-- ALTER ROLE safety_audit_user  SET lock_timeout                   = '10s';
-- ALTER ROLE safety_audit_user  SET search_path                    = public, pg_catalog;
-- ALTER ROLE safety_audit_user  SET row_security                   = on;

-- =====================================================================
-- 4. DEFAULT PRIVILEGES (run as the migration role)
-- =====================================================================
-- Without these, any new table created later inherits PUBLIC access and
-- the separation model drifts. Apply inside each DB.
--
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM PUBLIC;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TYPES     FROM PUBLIC;

-- =====================================================================
-- 5. SESSION DATABASE
-- =====================================================================
-- psql SESSION_DATABASE_URL -f scripts/data-separation-harden.sql

-- Default-priv drift guard (re-applied on re-run):
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC;

-- Strip PUBLIC access from existing objects, then grant per role.
REVOKE ALL ON TABLE "AuditEvent"          FROM PUBLIC;
REVOKE ALL ON TABLE "SessionRecord"       FROM PUBLIC;
REVOKE ALL ON TABLE "GroupSessionRecord"  FROM PUBLIC;

-- AuditEvent: tamper-evident. API can read + insert, audit can read.
REVOKE UPDATE, DELETE ON TABLE "AuditEvent" FROM session_api_user;
GRANT SELECT, INSERT ON TABLE "AuditEvent" TO session_api_user;
GRANT SELECT          ON TABLE "AuditEvent" TO session_audit_user;

-- SessionRecord / GroupSessionRecord: API can CRUD (no DELETE for normal flow,
-- but service uses update; keep DELETE available for admin/cleanup paths).
GRANT SELECT, INSERT, UPDATE, DELETE
    ON TABLE "SessionRecord", "GroupSessionRecord"
    TO session_api_user;

-- =====================================================================
-- 6. VAULT DATABASE
-- =====================================================================
-- psql VAULT_DATABASE_URL -f scripts/data-separation-harden.sql

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC;

REVOKE ALL ON TABLE "VaultAccessLog"  FROM PUBLIC;
REVOKE ALL ON TABLE "IdentityRecord"  FROM PUBLIC;

-- VaultAccessLog: tamper-evident. API INSERT-only, audit SELECT.
REVOKE UPDATE, DELETE ON TABLE "VaultAccessLog" FROM vault_api_user;
GRANT INSERT ON TABLE "VaultAccessLog" TO vault_api_user;
GRANT SELECT ON TABLE "VaultAccessLog" TO vault_audit_user;

-- IdentityRecord: full CRUD for API (PII encrypted at the application layer
-- with envelope keys held outside the DB). Audit gets read-only.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "IdentityRecord" TO vault_api_user;
GRANT SELECT                          ON TABLE "IdentityRecord" TO vault_audit_user;

-- =====================================================================
-- 7. SAFETY DATABASE
-- =====================================================================
-- psql SAFETY_DATABASE_URL -f scripts/data-separation-harden.sql

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC;

REVOKE ALL ON TABLE "SafetyAlert"        FROM PUBLIC;
REVOKE ALL ON TABLE "SafetyMitigation"   FROM PUBLIC;
REVOKE ALL ON TABLE "SafetyStrike"       FROM PUBLIC;
REVOKE ALL ON TABLE "SafetyAuditLog"     FROM PUBLIC;
REVOKE ALL ON TABLE "EscalationQueue"    FROM PUBLIC;
REVOKE ALL ON TABLE "KeywordRule"        FROM PUBLIC;

-- SafetyAlert: API reads + creates + updates (resolve). No DELETE.
REVOKE DELETE ON TABLE "SafetyAlert" FROM safety_api_user;
GRANT SELECT, INSERT, UPDATE ON TABLE "SafetyAlert" TO safety_api_user;
GRANT SELECT                  ON TABLE "SafetyAlert" TO safety_audit_user;

-- SafetyMitigation: immutable mitigations. API reads + inserts.
REVOKE UPDATE, DELETE ON TABLE "SafetyMitigation" FROM safety_api_user;
GRANT SELECT, INSERT  ON TABLE "SafetyMitigation" TO safety_api_user;
GRANT SELECT          ON TABLE "SafetyMitigation" TO safety_audit_user;

-- SafetyStrike: API upserts (insert + update on conflict). No DELETE.
REVOKE DELETE ON TABLE "SafetyStrike" FROM safety_api_user;
GRANT SELECT, INSERT, UPDATE ON TABLE "SafetyStrike" TO safety_api_user;
GRANT SELECT                  ON TABLE "SafetyStrike" TO safety_audit_user;

-- SafetyAuditLog: tamper-evident. API can read + insert, audit reads.
REVOKE UPDATE, DELETE ON TABLE "SafetyAuditLog" FROM safety_api_user;
GRANT SELECT, INSERT  ON TABLE "SafetyAuditLog" TO safety_api_user;
GRANT SELECT          ON TABLE "SafetyAuditLog" TO safety_audit_user;

-- EscalationQueue: API reads + creates + updates (acknowledge / resolve).
-- No DELETE — keep audit trail of every queue item.
REVOKE DELETE ON TABLE "EscalationQueue" FROM safety_api_user;
GRANT SELECT, INSERT, UPDATE ON TABLE "EscalationQueue" TO safety_api_user;
GRANT SELECT                  ON TABLE "EscalationQueue" TO safety_audit_user;

-- KeywordRule: API selects + upserts. DELETE stays admin-only (a leaked
-- service token cannot erase a backlist of dangerous terms).
REVOKE DELETE ON TABLE "KeywordRule" FROM safety_api_user;
GRANT SELECT, INSERT, UPDATE ON TABLE "KeywordRule" TO safety_api_user;
GRANT SELECT                  ON TABLE "KeywordRule" TO safety_audit_user;

-- =====================================================================
-- 8. ROW-LEVEL SECURITY (defense in depth — OFF by default)
-- =====================================================================
-- RLS does not apply to table owners, so this only protects you if the
-- API/audit users are NOT the role that runs `prisma migrate deploy`.
-- In this setup the migrator is the owner; service users are not.
-- Uncomment after verifying ownership is held by a separate migrator role.
--
-- -- Session DB
-- ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY audit_event_api_insert ON "AuditEvent"
--     FOR INSERT TO session_api_user WITH CHECK (true);
-- CREATE POLICY audit_event_api_select ON "AuditEvent"
--     FOR SELECT TO session_api_user USING (true);
-- CREATE POLICY audit_event_audit_select ON "AuditEvent"
--     FOR SELECT TO session_audit_user USING (true);
--
-- -- Vault DB
-- ALTER TABLE "VaultAccessLog" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY vault_log_api_insert ON "VaultAccessLog"
--     FOR INSERT TO vault_api_user WITH CHECK (true);
-- CREATE POLICY vault_log_audit_select ON "VaultAccessLog"
--     FOR SELECT TO vault_audit_user USING (true);
--
-- -- Safety DB
-- ALTER TABLE "SafetyAuditLog" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY safety_log_api_insert ON "SafetyAuditLog"
--     FOR INSERT TO safety_api_user WITH CHECK (true);
-- CREATE POLICY safety_log_audit_select ON "SafetyAuditLog"
--     FOR SELECT TO safety_audit_user USING (true);
