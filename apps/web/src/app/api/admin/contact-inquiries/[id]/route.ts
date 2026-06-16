import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'IN_PROGRESS', 'RESOLVED'] as const;
const VALID_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;

const updateSchema = z.object({
  status: z.enum(VALID_STATUSES).optional(),
  priority: z.enum(VALID_PRIORITIES).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const db = getDb();
  if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  try {
    const { id } = await params;
    const doc = await db.collection('contact_inquiries').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    const [notesSnap, responsesSnap] = await Promise.all([
      db.collection('contact_inquiries').doc(id).collection('notes').orderBy('createdAt', 'desc').get(),
      db.collection('contact_inquiries').doc(id).collection('responses').orderBy('createdAt', 'desc').get(),
    ]);
    const notes = notesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const responses = responsesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const data = doc.data() ?? {};
    const isOverdue = data.slaDueAt
      ? new Date(data.slaDueAt as string).getTime() < Date.now() && !['RESOLVED', 'CLOSED'].includes(String(data.status))
      : false;
    return NextResponse.json({
      inquiry: { id: doc.id, ...data, isOverdue, notes, responses },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[AdminContactInquiry] GET error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
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
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const ref = db.collection('contact_inquiries').doc(id);
    const current = await ref.get();
    if (!current.exists) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    const before = current.data() ?? {};

    const updateData: Record<string, unknown> = {
      ...result.data,
      updatedAt: new Date().toISOString(),
    };
    await ref.update(updateData);

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'CONTACT_INQUIRY_UPDATE',
      targetType: 'CONTACT_INQUIRY',
      targetId: id,
      before: { status: before.status, priority: before.priority },
      after: updateData,
      result: 'SUCCESS',
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[AdminContactInquiry] PATCH error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
