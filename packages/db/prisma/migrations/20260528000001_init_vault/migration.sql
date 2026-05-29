-- CreateEnum
CREATE TYPE "VaultAccessPurpose" AS ENUM ('RECORD_CREATE', 'RECORD_READ', 'CRISIS_DISCLOSURE', 'AUDIT_REVIEW');

-- CreateTable
CREATE TABLE "IdentityRecord" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subjectRef" TEXT NOT NULL,
    "encryptedRealName" BYTEA NOT NULL,
    "encryptedEmergencyContact" BYTEA NOT NULL,
    "encryptedRegion" BYTEA NOT NULL,
    "encryptedDisclosure" BYTEA,
    "encryptedIpAddress" BYTEA,
    "encryptedDeviceFingerprint" BYTEA,
    "ipExpiresAt" TIMESTAMP(3),
    "deviceFingerprintExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdentityRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaultAccessLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subjectRef" TEXT NOT NULL,
    "purpose" "VaultAccessPurpose" NOT NULL,
    "actorRef" TEXT NOT NULL,
    "action" TEXT,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VaultAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdentityRecord_subjectRef_key" ON "IdentityRecord"("subjectRef");

-- CreateIndex
CREATE INDEX "IdentityRecord_subjectRef_idx" ON "IdentityRecord"("subjectRef");

-- CreateIndex
CREATE INDEX "IdentityRecord_ipExpiresAt_idx" ON "IdentityRecord"("ipExpiresAt");

-- CreateIndex
CREATE INDEX "IdentityRecord_deviceFingerprintExpiresAt_idx" ON "IdentityRecord"("deviceFingerprintExpiresAt");

-- CreateIndex
CREATE INDEX "VaultAccessLog_subjectRef_idx" ON "VaultAccessLog"("subjectRef");

-- CreateIndex
CREATE INDEX "VaultAccessLog_purpose_idx" ON "VaultAccessLog"("purpose");

-- CreateIndex
CREATE INDEX "VaultAccessLog_createdAt_idx" ON "VaultAccessLog"("createdAt");
