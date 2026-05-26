-- Migration: 001_initial_schema
-- Description: Creates IdentityRecord and VaultAccessLog tables with INSERT-only enforcement on VaultAccessLog
-- Phase: 1C - Identity Vault API

-- Create the schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS vault;

-- IdentityRecord table: stores encrypted PII using envelope encryption
CREATE TABLE vault.identity_record (
    id                  VARCHAR(27)    PRIMARY KEY DEFAULT gen_random_uuid()::text,
    subject_ref         VARCHAR(255)  NOT NULL UNIQUE,
    encrypted_real_name BYTEA         NOT NULL,
    encrypted_emergency_contact BYTEA NOT NULL,
    encrypted_region    BYTEA         NOT NULL,
    encrypted_disclosure BYTEA,
    encrypted_ip_address BYTEA,
    ip_expires_at       TIMESTAMPTZ,
    encrypted_device_fingerprint BYTEA,
    device_fingerprint_expires_at TIMESTAMPTZ,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- VaultAccessLog table: INSERT-only audit log for all vault access
CREATE TABLE vault.vault_access_log (
    id          VARCHAR(27) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    subject_ref VARCHAR(255) NOT NULL,
    actor_ref    VARCHAR(255) NOT NULL,
    purpose     VARCHAR(255) NOT NULL,
    action      VARCHAR(100),
    metadata    JSONB        NOT NULL DEFAULT '{}',
    timestamp   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Indexes for common access patterns
CREATE INDEX idx_identity_record_subject_ref ON vault.identity_record(subject_ref);
CREATE INDEX idx_vault_access_log_subject_ref ON vault.vault_access_log(subject_ref);
CREATE INDEX idx_vault_access_log_actor_ref ON vault.vault_access_log(actor_ref);
CREATE INDEX idx_vault_access_log_timestamp ON vault.vault_access_log(timestamp);

-- ============================================================
-- SECURITY: INSERT-only enforcement on VaultAccessLog
-- ============================================================

-- Create a limited-access role for the vault API service account
-- This role has INSERT privileges only — no UPDATE or DELETE
-- Adjust role_name to match your deployment's service user

DO $$
DECLARE
    vault_role_name TEXT := 'vault_api_role';
    db_role_name    TEXT := 'vault_db_user';
BEGIN
    -- Create the role if it doesn't exist (PostgreSQL 15+)
    CREATE ROLE vault_api_role NOLOGIN;

    -- Revoke all table privileges first (clean slate)
    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA vault FROM vault_api_role;
    REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA vault FROM vault_api_role;

    -- Grant INSERT and SELECT ONLY on vault_access_log (insert-only at DB level)
    -- SELECT needed for potential audit-read by separate admin process
    GRANT USAGE ON SCHEMA vault TO vault_api_role;
    GRANT INSERT, SELECT ON vault.vault_access_log TO vault_api_role;

    -- IdentityRecord: INSERT and UPDATE allowed (for upsert), and SELECT for record retrieval
    -- Read operations happen through the vault API which decrypts on the service side
    GRANT INSERT, UPDATE, SELECT ON vault.identity_record TO vault_api_role;

    -- Revoke UPDATE and DELETE on vault_access_log — enforces immutability
    -- This is the security-critical line for INSERT-only audit log
    REVOKE UPDATE, DELETE ON vault.vault_access_log FROM vault_api_role;

    -- Optional: apply same restriction to the DB user if it's different from the role
    EXECUTE format('REVOKE UPDATE, DELETE ON vault.vault_access_log FROM %I', db_role_name)
        ON CURRENT_SCHEMA WHERE db_role_name <> 'public';

    RAISE NOTICE 'INSERT-only enforcement applied on vault.vault_access_log';
END $$;

-- Grant usage to the schema so the role can access tables
GRANT USAGE ON SCHEMA vault TO vault_api_role;
