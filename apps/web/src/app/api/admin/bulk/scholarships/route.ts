import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const bulkSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
  status: z.enum(['PENDING', 'APPROVED', 'DENIED']),
  approvedCents: z.number().int().nonnegative().optional(),
  reason: z.string().max(500).optional(),
});

export async function PATCH(req: NextRequest) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const parsed = bulkSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.format() },
      { status: 400 }
    );
  }
  const { ids, status, approvedCents, reason } = parsed.data;

  const results: { id: string; success: boolean; error?: string }[] = [];
  try {
    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          const before = await tx.scholarship.findUnique({ where: { id } });
          if (!before) {
            results.push({ id, success: false, error: 'not_found' });
            continue;
          }
          await tx.scholarship.update({
            where: { id },
            data: {
              status,
              approvedCents: status === 'APPROVED' ? approvedCents ?? null : null,
            },
          });
          results.push({ id, success: true });
        } catch (err) {
          results.push({ id, success: false, error: err instanceof Error ? err.message : 'unknown' });
        }
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Transaction failed';
    console.error('[BulkScholarships] Transaction error:', message);
    return NextResponse.json({ error: 'Bulk update failed; no changes applied.' }, { status: 500 });
  }

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.length - successCount;

  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
  await writeAuditEvent({
    actorId: admin.uid,
    actorEmail: admin.email || 'unknown',
    action: 'BULK_SCHOLARSHIP_STATUS_UPDATE',
    targetType: 'SCHOLARSHIP',
    targetId: ids.join(','),
    after: { status, successCount, failureCount },
    ...(reason ? { justification: reason } : {}),
    result: failureCount > 0 ? 'FAILURE' : 'SUCCESS',
    ip,
  });

  return NextResponse.json({ success: failureCount === 0, successCount, failureCount, results });
}
