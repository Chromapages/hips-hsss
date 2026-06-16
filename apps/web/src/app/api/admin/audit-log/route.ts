import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const take = Math.min(parseInt(searchParams.get("take") ?? "50", 10), 100);
    const skip = parseInt(searchParams.get("skip") ?? "0", 10);
    const actorId = searchParams.get("actorId") || undefined;
    const action = searchParams.get("action") || undefined;

    const where: any = {};
    if (actorId) where.actorId = actorId;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.adminAuditLog.count({ where }),
    ]);

    // Format the response DTO to exclude raw before/after JSON for list views
    const formattedLogs = logs.map((log) => ({
      id: log.id,
      correlationId: log.correlationId,
      actorId: log.actorId,
      actorEmail: log.actorEmail,
      action: log.action,
      targetType: log.targetType,
      targetId: log.targetId,
      justification: log.justification,
      result: log.result,
      ip: log.ip,
      userAgent: log.userAgent,
      createdAt: log.createdAt.toISOString(),
    }));

    return NextResponse.json({ data: formattedLogs, total, take, skip });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Audit log fetch error:", message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
