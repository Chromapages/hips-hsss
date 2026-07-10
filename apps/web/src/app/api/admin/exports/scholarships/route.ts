import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';
import { z } from 'zod';

const querySchema = z.object({
  format: z.enum(['csv', 'json']).default('csv'),
  status: z.enum(['ALL', 'PENDING', 'APPROVED', 'DENIED']).default('ALL'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const MAX_ROWS = 5_000;

export async function GET(req: NextRequest) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    format: searchParams.get('format') ?? 'csv',
    status: searchParams.get('status') ?? 'ALL',
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }
  const { format, status, startDate, endDate } = parsed.data;

  const where: any = {};
  if (status !== 'ALL') where.status = status;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  try {
    const total = await prisma.scholarship.count({ where });
    if (total > MAX_ROWS) {
      return NextResponse.json(
        { error: 'Export too large for synchronous download', total, max: MAX_ROWS },
        { status: 413 }
      );
    }

    const rows = await prisma.scholarship.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } },
      take: MAX_ROWS,
    });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'EXPORT_SCHOLARSHIPS',
      targetType: 'SCHOLARSHIP',
      targetId: 'bulk',
      after: { count: rows.length, format, filters: { status, startDate, endDate } },
      result: 'SUCCESS',
      ip,
    });

    if (format === 'json') {
      return NextResponse.json({ data: rows, count: rows.length, total });
    }

    const headers = [
      'id', 'applicantEmail', 'status', 'requestedCents', 'approvedCents',
      'createdAt', 'updatedAt',
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
      lines.push(
        headers.map((h) => {
          if (h === 'applicantEmail') return escapeCsv(r.user.email);
          if (h === 'createdAt' || h === 'updatedAt') return escapeCsv((r as any)[h]?.toISOString?.() ?? (r as any)[h]);
          return escapeCsv((r as any)[h]);
        }).join(',')
      );
    }
    const csv = lines.join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="scholarships-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[ExportScholarships] error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
