-- Migration: 002_add_vault_access_request
-- Description: Adds VaultAccessRequest table for Phase 6.7 Vault Access Request Flow
-- Phase: 6.7 - Vault Access Request Flow
-- Depends: 001_initial_schema
--
-- Flow: Participant submits justification → Vault authenticates internal secret →
--       KMS decrypts emergency contact → VaultAccessLog entry (INSERT only, immutable)

CREATE TABLE vault.vault_access_request (
    id               VARCHAR(27) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    subject_ref      VARCHAR(255) NOT NULL,
    requester_ref    VARCHAR(255) NOT NULL,
    justification   TEXT         NOT NULL,
    status           VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    accessed_at      TIMESTAMPTZ,
    metadata         JSONB       NOT NULL DEFAULT '{}',
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- Enforce valid status values
    CONSTRAINT vault_access_request_status_check
        CHECK (status IN ('PENDING', 'APPROVED', 'DENIED'))
);

-- Indexes for access request lookups
CREATE INDEX idx_vault_access_request_subject_ref
    ON vault.vault_access_request(subject_ref);
CREATE INDEX idx_vault_access_request_requester_ref
    ON vault.vault_access_request(requester_ref);
CREATE INDEX idx_vault_access_request_status
    ON vault.vault_access_request(status);
CREATE INDEX idx_vault_access_request_created_at
    ON vault.vault_access_request(created_at);

-- Security: vault_api_role can INSERT and SELECT on vault_access_request
-- UPDATE is intended for marking status (APPROVED/DENIED) by admin process
-- DELETE is not needed or allowed for this table
GRANT INSERT, SELECT, UPDATE ON vault.vault_access_request TO vault_api_role;

-- Note: VaultAccessLog INSERT-only enforcement (from 001_initial_schema)
-- continues to be enforced — all emergency contact access events are logged
-- as INSERT-only records in vault_access_log with action='EMERGENCY_CONTACT_ACCESS'
