import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const assignSchema = z.object({
  assigneeId: z.string().min(1),
  assigneeEmail: z.string().email().optional(),
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
    const body = await req.json();
    const result = assignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const { assigneeId, assigneeEmail } = result.data;

    const ref = db.collection('contact_inquiries').doc(id);
    const current = await ref.get();
    if (!current.exists) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    const before = current.data() ?? {};

    await ref.update({
      assigneeId,
      assigneeEmail: assigneeEmail ?? null,
      // Move into IN_PROGRESS so it appears in the assignee's active queue.
      status: before.status === 'NEW' ? 'IN_PROGRESS' : before.status,
      updatedAt: new Date().toISOString(),
    });

    // Drop a notification for the assignee.
    try {
      await db.collection('user_notifications').add({
        kind: 'INQUIRY_ASSIGNED',
        inquiryId: id,
        assigneeId,
        fromEmail: admin.email ?? null,
        createdAt: new Date().toISOString(),
        readBy: [],
      });
    } catch {
      // Non-fatal.
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'CONTACT_INQUIRY_ASSIGN',
      targetType: 'CONTACT_INQUIRY',
      targetId: id,
      before: { assigneeId: before.assigneeId ?? null },
      after: { assigneeId, assigneeEmail: assigneeEmail ?? null },
      result: 'SUCCESS',
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[AssignInquiry] error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
