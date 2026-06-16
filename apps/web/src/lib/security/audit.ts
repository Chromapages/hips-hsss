/**
 * Security audit log — Layer 7.
 *
 * This is a minimal stub. The full implementation lands in Batch 5 and
 * includes:
 *  - SecurityEventLog Prisma table (migration)
 *  - Real-time Slack alerting for high-severity events
 *  - Full coverage of the event types listed in the plan
 *
 * For now, this module provides the function signatures referenced by
 * request-auth.ts and admin-auth.ts so the imports succeed and the
 * security-event writes can be wired in incrementally. The current
 * implementation logs to stderr and returns success.
 */

import 'server-only';
import { logger, safeError } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export type SecurityEventType =
  // Login events
  | 'ADMIN_LOGIN_SUCCESS'
  | 'ADMIN_LOGIN_FAILURE'
  | 'FACILITATOR_LOGIN_SUCCESS'
  | 'FACILITATOR_LOGIN_FAILURE'
  // MFA
  | 'MFA_CHALLENGE_SUCCESS'
  | 'MFA_CHALLENGE_FAILURE'
  | 'MFA_BACKUP_CODE_USED'
  | 'MFA_ENROLLED'
  | 'MFA_DEENROLLED'
  | 'SUDO_MODE_ENTERED'
  | 'SUDO_MODE_FAILED'
  // Service tokens
  | 'SERVICE_TOKEN_ISSUED'
  | 'SERVICE_TOKEN_VALIDATION_FAILED'
  // Revocation
  | 'TOKEN_REVOKED'
  | 'TOKENS_REVOKED_FOR_USER'
  // Role changes
  | 'ROLE_CHANGED'
  // Webhooks
  | 'WEBHOOK_SIGNATURE_FAILED'
  // Privileged route probes
  | 'PRIVILEGED_ROUTE_FORBIDDEN';

export type SecurityEventInput = {
  eventType: SecurityEventType;
  outcome: 'SUCCESS' | 'FAILURE';
  correlationId?: string | undefined;
  actorId?: string | undefined;
  actorRole?: string | undefined;
  targetType?: string | undefined;
  targetId?: string | undefined;
  failureReason?: string | undefined;
  ip?: string | undefined;
  userAgent?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
};

/**
 * Full implementation — writes to stdout/stderr and persisting to the SecurityEventLog Prisma table.
 */
export async function logSecurityEvent(event: SecurityEventInput): Promise<void> {
  try {
    logger.info(`[security] ${event.eventType}`, {
      outcome: event.outcome,
      actorId: event.actorId,
      actorRole: event.actorRole,
      targetType: event.targetType,
      targetId: event.targetId,
      failureReason: event.failureReason,
      ip: event.ip,
      userAgent: event.userAgent,
      metadata: event.metadata,
      correlationId: event.correlationId,
    });

    await prisma.securityEventLog.create({
      data: {
        eventType: event.eventType,
        outcome: event.outcome,
        correlationId: event.correlationId || null,
        actorId: event.actorId || null,
        actorRole: event.actorRole || null,
        targetType: event.targetType || null,
        targetId: event.targetId || null,
        failureReason: event.failureReason || null,
        ip: event.ip || null,
        userAgent: event.userAgent || null,
        metadata: (event.metadata || {}) as any,
      },
    });
  } catch (err) {
    // Never throw from the audit log. A failed audit must not block the
    // primary operation.
    logger.error('Security audit write failed', { error: safeError(err) });
  }
}
