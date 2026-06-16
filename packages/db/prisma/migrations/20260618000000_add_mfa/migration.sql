-- Migration: Add MFA fields, MfaBackupCode, and MfaPendingToken (Layer 4)
--
-- This migration is additive — it adds new columns with defaults and new
-- tables. It does not modify any existing data. Existing users will have
-- mfaEnabled=false and null TOTP material, which is the correct pre-MFA
-- state. Admins and facilitators can self-enroll via /api/auth/mfa/setup.

-- 1. Add MFA fields to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mfaEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mfaSecretEnc" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mfaSecretIv" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mfaSecretTag" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mfaEnrolledAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastMfaVerifiedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "User_mfaEnabled_idx" ON "User"("mfaEnabled");

-- 2. Create MfaBackupCode
CREATE TABLE IF NOT EXISTS "MfaBackupCode" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "codeHash" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MfaBackupCode_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "MfaBackupCode_userId_idx" ON "MfaBackupCode"("userId");
CREATE INDEX IF NOT EXISTS "MfaBackupCode_usedAt_idx" ON "MfaBackupCode"("usedAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'MfaBackupCode_userId_fkey'
    ) THEN
        ALTER TABLE "MfaBackupCode"
            ADD CONSTRAINT "MfaBackupCode_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- 3. Create MfaPendingToken
CREATE TABLE IF NOT EXISTS "MfaPendingToken" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "destination" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MfaPendingToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "MfaPendingToken_tokenHash_key" ON "MfaPendingToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "MfaPendingToken_userId_idx" ON "MfaPendingToken"("userId");
CREATE INDEX IF NOT EXISTS "MfaPendingToken_expiresAt_idx" ON "MfaPendingToken"("expiresAt");
CREATE INDEX IF NOT EXISTS "MfaPendingToken_tokenHash_idx" ON "MfaPendingToken"("tokenHash");
