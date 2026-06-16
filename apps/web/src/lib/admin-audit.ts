import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export type AdminAuditEvent = {
  correlationId?: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetType?: string;
  targetId?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  justification?: string;
  result: "SUCCESS" | "FAILURE";
  ip?: string | undefined;
  userAgent?: string | undefined;
};

/**
 * Writes an administrative audit event to the database.
 * If writing to the database fails, it prints a critical alert to stderr but
 * does NOT throw an error, preventing audit failures from blocking primary operations.
 */
export async function writeAuditEvent(event: AdminAuditEvent): Promise<boolean> {
  try {
    const correlationId = event.correlationId || crypto.randomUUID();
    await prisma.adminAuditLog.create({
      data: {
        correlationId,
        actorId: event.actorId,
        actorEmail: event.actorEmail,
        action: event.action,
        targetType: event.targetType || null,
        targetId: event.targetId || null,
        before: event.before !== undefined ? (event.before as any) : null,
        after: event.after !== undefined ? (event.after as any) : null,
        justification: event.justification || null,
        result: event.result,
        ip: event.ip || null,
        userAgent: event.userAgent || null,
      },
    });
    return true;
  } catch (err) {
    // Print loudly to stderr
    console.error(
      `[CRITICAL AUDIT FAILURE] Failed to write admin audit log. ` +
      `Event: ${JSON.stringify(event)}. Error:`,
      err
    );
    return false;
  }
}
