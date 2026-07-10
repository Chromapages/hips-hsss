import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const MAX_ROWS = 5_000;

export async function GET(req: NextRequest) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  try {
    const total = await prisma.user.count({ where: { deletedAt: null } });
    if (total > MAX_ROWS) {
      return NextResponse.json(
        { error: 'Export too large for synchronous download', total, max: MAX_ROWS },
        { status: 413 }
      );
    }

    const rows = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: MAX_ROWS,
    });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'EXPORT_USERS',
      targetType: 'USER',
      targetId: 'bulk',
      after: { count: rows.length },
      result: 'SUCCESS',
      ip,
    });

    const headers = ['id', 'firebaseUid', 'email', 'role', 'suspendedAt', 'createdAt', 'updatedAt'];
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
          if (h === 'createdAt' || h === 'updatedAt' || h === 'suspendedAt') {
            return escapeCsv((r as any)[h]?.toISOString?.() ?? (r as any)[h]);
          }
          return escapeCsv((r as any)[h]);
        }).join(',')
      );
    }
    const csv = lines.join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="users-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[ExportUsers] error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
