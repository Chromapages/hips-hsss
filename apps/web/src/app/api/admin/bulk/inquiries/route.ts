import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

/**
 * Bulk status update for org inquiries.
 *
 * Transactional: either all updates commit or none do. The UI must surface
 * the per-row outcome and the overall success count.
 */
const bulkInquirySchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED']),
  reason: z.string().max(500).optional(),
});

export async function PATCH(req: NextRequest) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const parsed = bulkInquirySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.format() },
      { status: 400 }
    );
  }
  const { ids, status, reason } = parsed.data;

  const results: { id: string; success: boolean; error?: string }[] = [];
  try {
    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          const before = await tx.orgInquiry.findUnique({ where: { id }, select: { status: true } });
          if (!before) {
            results.push({ id, success: false, error: 'not_found' });
            continue;
          }
          await tx.orgInquiry.update({ where: { id }, data: { status } });
          results.push({ id, success: true });
        } catch (err) {
          results.push({ id, success: false, error: err instanceof Error ? err.message : 'unknown' });
        }
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Transaction failed';
    console.error('[BulkInquiries] Transaction error:', message);
    return NextResponse.json({ error: 'Bulk update failed; no changes applied.' }, { status: 500 });
  }

  const successCount = results.filter((r) => r.success).length;
  const failureCount = results.length - successCount;

  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;
  await writeAuditEvent({
    actorId: admin.uid,
    actorEmail: admin.email || 'unknown',
    action: 'BULK_INQUIRY_STATUS_UPDATE',
    targetType: 'INQUIRY',
    targetId: ids.join(','),
    before: null,
    after: { status, successCount, failureCount, reason: reason ?? null },
    ...(reason ? { justification: reason } : {}),
    result: failureCount > 0 ? 'FAILURE' : 'SUCCESS',
    ip,
    userAgent,
  });

  return NextResponse.json({
    success: failureCount === 0,
    successCount,
    failureCount,
    results,
  });
}
