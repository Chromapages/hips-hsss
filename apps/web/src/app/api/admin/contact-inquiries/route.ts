import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'IN_PROGRESS', 'RESOLVED'] as const;
const VALID_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;
const VALID_TYPES = ['GENERAL', 'SUPPORT', 'PARTNERSHIP', 'PRESS', 'SECURITY', 'BILLING'] as const;

const listQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).optional().default(50),
  skip: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(['ALL', ...VALID_STATUSES] as const).optional().default('ALL'),
  priority: z.enum(['ALL', ...VALID_PRIORITIES] as const).optional().default('ALL'),
  inquiryType: z.enum(['ALL', ...VALID_TYPES] as const).optional().default('ALL'),
  assigneeId: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'priority', 'sla']).optional().default('newest'),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const parsed = listQuerySchema.safeParse({
    take: searchParams.get('take') ?? undefined,
    skip: searchParams.get('skip') ?? undefined,
    status: searchParams.get('status') ?? 'ALL',
    priority: searchParams.get('priority') ?? 'ALL',
    inquiryType: searchParams.get('inquiryType') ?? 'ALL',
    assigneeId: searchParams.get('assigneeId') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    sort: searchParams.get('sort') ?? 'newest',
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.format() },
      { status: 400 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }

  const { take, skip, status, priority, inquiryType, assigneeId, search, sort } = parsed.data;

  const filters: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: unknown }> = [];
  if (status !== 'ALL') filters.push({ field: 'status', op: '==', value: status });
  if (priority !== 'ALL') filters.push({ field: 'priority', op: '==', value: priority });
  if (inquiryType !== 'ALL') filters.push({ field: 'inquiryType', op: '==', value: inquiryType });
  if (assigneeId) filters.push({ field: 'assigneeId', op: '==', value: assigneeId });

  try {
    let query: FirebaseFirestore.Query = db.collection('contact_inquiries');
    for (const f of filters) {
      query = query.where(f.field, f.op, f.value as any);
    }

    if (sort === 'newest' || sort === 'sla') {
      query = query.orderBy('createdAt', 'desc');
    } else if (sort === 'oldest') {
      query = query.orderBy('createdAt', 'asc');
    } else if (sort === 'priority') {
      query = query.orderBy('priority', 'desc').orderBy('createdAt', 'desc');
    }

    const snapshot = await query.limit(take + skip).get();
    let docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    docs = docs.slice(skip);

    if (search && search.trim()) {
      const needle = search.trim().toLowerCase();
      docs = docs.filter((d: any) =>
        (d.subject || '').toLowerCase().includes(needle) ||
        (d.submitterName || '').toLowerCase().includes(needle) ||
        (d.submitterEmail || '').toLowerCase().includes(needle) ||
        (d.body || '').toLowerCase().includes(needle)
      );
    }

    // Compute overdue flag
    const now = Date.now();
    const enriched = docs.map((d: any) => ({
      ...d,
      isOverdue: d.slaDueAt ? new Date(d.slaDueAt).getTime() < now && !['RESOLVED', 'CLOSED'].includes(d.status) : false,
    }));

    return NextResponse.json({
      data: enriched,
      total: enriched.length,
      take,
      skip,
      filters: { status, priority, inquiryType, assigneeId, search, sort },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[AdminContactInquiries] Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
