import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';
import { z } from 'zod';

const querySchema = z.object({
  format: z.enum(['csv', 'json']).default('csv'),
  status: z.enum(['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED']).default('ALL'),
});

/**
 * Synchronous export with a hard cap (5,000 rows). For larger exports,
 * the caller should batch or move to a background job. Anything over the
 * cap is rejected so the request doesn't time out in HTTP.
 */
const MAX_ROWS = 5_000;

export async function GET(req: NextRequest) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    format: searchParams.get('format') ?? 'csv',
    status: searchParams.get('status') ?? 'ALL',
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }
  const { format, status } = parsed.data;

  try {
    const where: any = {};
    if (status !== 'ALL') where.status = status;

    const total = await prisma.orgInquiry.count({ where });
    if (total > MAX_ROWS) {
      return NextResponse.json(
        {
          error: 'Export too large for synchronous download',
          total,
          max: MAX_ROWS,
          guidance: 'Use a background-job export pipeline for >5,000 rows.',
        },
        { status: 413 }
      );
    }

    const rows = await prisma.orgInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: MAX_ROWS,
    });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'EXPORT_INQUIRIES',
      targetType: 'INQUIRY',
      targetId: 'bulk',
      after: { count: rows.length, format, filters: { status } },
      result: 'SUCCESS',
      ip,
    });

    if (format === 'json') {
      return NextResponse.json({ data: rows, count: rows.length, total });
    }

    // CSV
    const headers = [
      'id', 'orgName', 'contactName', 'email', 'isNonprofit', 'ein',
      'eventType', 'headcount', 'preferredStart', 'preferredEnd', 'status',
      'message', 'createdAt', 'updatedAt',
    ];
    const escapeCsv = (v: unknown) => {
      if (v == null) return '';
      const s = String(v);
      if (s.includes('"') || s.includes(',') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const lines = [headers.join(',')];
    for (const r of rows) {
      lines.push(headers.map((h) => escapeCsv((r as any)[h])).join(','));
    }
    const csv = lines.join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[ExportInquiries] error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
