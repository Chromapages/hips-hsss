import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const noteSchema = z.object({
  body: z.string().min(1).max(4000),
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
    const result = noteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Note body is required' }, { status: 400 });
    }
    const ref = db.collection('contact_inquiries').doc(id);
    const current = await ref.get();
    if (!current.exists) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    const noteRef = await ref.collection('notes').add({
      authorId: admin.uid,
      authorEmail: admin.email ?? 'unknown',
      body: result.data.body,
      createdAt: new Date().toISOString(),
    });

    await ref.update({ updatedAt: new Date().toISOString() });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'CONTACT_INQUIRY_NOTE',
      targetType: 'CONTACT_INQUIRY',
      targetId: id,
      after: { noteId: noteRef.id },
      result: 'SUCCESS',
      ip,
    });

    return NextResponse.json({ success: true, noteId: noteRef.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[AddInquiryNote] error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
