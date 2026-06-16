import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const resolveSchema = z.object({
  resolutionNote: z.string().min(3).max(2000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const db = getDb();
  if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  try {
    const { id } = await params;
    const json = await req.json().catch(() => ({}));
    const result = resolveSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const ref = db.collection('contact_inquiries').doc(id);
    const current = await ref.get();
    if (!current.exists) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    const before = current.data() ?? {};

    const now = new Date().toISOString();
    await ref.update({
      status: 'RESOLVED',
      resolvedAt: now,
      resolvedById: admin.uid,
      resolutionNote: result.data.resolutionNote ?? null,
      updatedAt: now,
    });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'CONTACT_INQUIRY_RESOLVE',
      targetType: 'CONTACT_INQUIRY',
      targetId: id,
      before: { status: before.status },
      after: { status: 'RESOLVED', resolvedAt: now },
      ...(result.data.resolutionNote ? { justification: result.data.resolutionNote } : {}),
      result: 'SUCCESS',
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[ResolveInquiry] error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
