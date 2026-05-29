-- CreateEnum
CREATE TYPE "SafetySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SafetyCategory" AS ENUM ('HARM', 'SELF_HARM', 'HARASSMENT', 'DISCLOSURE');

-- CreateEnum
CREATE TYPE "MitigationAction" AS ENUM ('WARNING', 'MUTE', 'KICK', 'ESCALATE');

-- CreateEnum
CREATE TYPE "EscalationLevel" AS ENUM ('WATCH', 'URGENT', 'CRISIS');

-- CreateEnum
CREATE TYPE "EscalationSource" AS ENUM ('KEYWORD', 'MANUAL');

-- CreateEnum
CREATE TYPE "EscalationStatus" AS ENUM ('OPEN', 'REVIEWING', 'RESOLVED');

-- CreateTable
CREATE TABLE "SafetyAlert" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" TEXT NOT NULL,
    "severity" "SafetySeverity" NOT NULL,
    "category" "SafetyCategory" NOT NULL,
    "anonymizedReason" TEXT NOT NULL,
    "transcriptChunk" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyMitigation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "alertId" UUID NOT NULL,
    "action" "MitigationAction" NOT NULL,
    "success" BOOLEAN NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyMitigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyStrike" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "lastStrikeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyStrike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyAuditLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscalationQueue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionRef" TEXT NOT NULL,
    "level" "EscalationLevel" NOT NULL,
    "source" "EscalationSource" NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "EscalationStatus" NOT NULL DEFAULT 'OPEN',
    "reviewerHandle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "alertId" UUID,

    CONSTRAINT "EscalationQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyword_rule" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "term" TEXT NOT NULL,
    "severity" "SafetySeverity" NOT NULL,
    "category" "SafetyCategory" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keyword_rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SafetyAlert_sessionId_idx" ON "SafetyAlert"("sessionId");

-- CreateIndex
CREATE INDEX "SafetyAlert_severity_idx" ON "SafetyAlert"("severity");

-- CreateIndex
CREATE INDEX "SafetyAlert_category_idx" ON "SafetyAlert"("category");

-- CreateIndex
CREATE INDEX "SafetyMitigation_alertId_idx" ON "SafetyMitigation"("alertId");

-- CreateIndex
CREATE UNIQUE INDEX "SafetyStrike_sessionId_participantId_key" ON "SafetyStrike"("sessionId", "participantId");

-- CreateIndex
CREATE INDEX "SafetyAuditLog_createdAt_idx" ON "SafetyAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "EscalationQueue_status_idx" ON "EscalationQueue"("status");

-- CreateIndex
CREATE INDEX "EscalationQueue_sessionRef_idx" ON "EscalationQueue"("sessionRef");

-- CreateIndex
CREATE INDEX "EscalationQueue_level_idx" ON "EscalationQueue"("level");

-- CreateIndex
CREATE INDEX "keyword_rule_term_idx" ON "keyword_rule"("term");

-- CreateIndex
CREATE INDEX "keyword_rule_enabled_idx" ON "keyword_rule"("enabled");

-- AddForeignKey
ALTER TABLE "SafetyMitigation" ADD CONSTRAINT "SafetyMitigation_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "SafetyAlert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalationQueue" ADD CONSTRAINT "EscalationQueue_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "SafetyAlert"("id") ON DELETE SET NULL ON UPDATE CASCADE;
