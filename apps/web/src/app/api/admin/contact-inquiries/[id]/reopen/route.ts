import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

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
    const ref = db.collection('contact_inquiries').doc(id);
    const current = await ref.get();
    if (!current.exists) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    const before = current.data() ?? {};
    if (before.status !== 'RESOLVED' && before.status !== 'CLOSED') {
      return NextResponse.json(
        { error: 'Only resolved or closed inquiries can be re-opened' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    await ref.update({
      status: 'IN_PROGRESS',
      resolvedAt: null,
      resolvedById: null,
      resolutionNote: null,
      updatedAt: now,
    });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'CONTACT_INQUIRY_REOPEN',
      targetType: 'CONTACT_INQUIRY',
      targetId: id,
      before: { status: before.status },
      after: { status: 'IN_PROGRESS' },
      result: 'SUCCESS',
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[ReopenInquiry] error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
