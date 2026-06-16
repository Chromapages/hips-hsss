import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';
import { writeAuditEvent } from '@/lib/admin-audit';

const responseSchema = z.object({
  body: z.string().min(1).max(10000),
  sendEmailToSubmitter: z.boolean().default(true),
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
    const json = await req.json();
    const result = responseSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const { body, sendEmailToSubmitter } = result.data;

    const ref = db.collection('contact_inquiries').doc(id);
    const current = await ref.get();
    if (!current.exists) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    const inquiry = current.data() ?? {};
    const submitterEmail = String(inquiry.submitterEmail ?? '');
    if (!submitterEmail) {
      return NextResponse.json({ error: 'Submitter has no email on file' }, { status: 400 });
    }

    const responseRef = await ref.collection('responses').add({
      authorId: admin.uid,
      authorEmail: admin.email ?? 'unknown',
      body,
      deliveredTo: sendEmailToSubmitter ? submitterEmail : null,
      createdAt: new Date().toISOString(),
    });

    // Update status to CONTACTED on first response (idempotent if already past that)
    const nextStatus = inquiry.status === 'NEW' ? 'CONTACTED' : inquiry.status;
    await ref.update({
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    });

    let emailStatus: 'sent' | 'skipped' | 'failed' = 'skipped';
    if (sendEmailToSubmitter) {
      try {
        const subject = `Re: ${String(inquiry.subject ?? 'Your inquiry')}`;
        const html = `
          <p>Hello ${escapeHtml(String(inquiry.submitterName ?? 'there'))},</p>
          <p>${escapeHtml(body).replace(/\n/g, '<br/>')}</p>
          <p>— H.I.P.S. Team</p>
          <p style="color:#666;font-size:12px">Reference: ${id}</p>
        `;
        const result = await sendEmail({ to: submitterEmail, subject, html });
        emailStatus = result?.id ? 'sent' : 'failed';
      } catch (err) {
        console.error('[InquiryResponse] email send failed:', err);
        emailStatus = 'failed';
      }
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'CONTACT_INQUIRY_RESPOND',
      targetType: 'CONTACT_INQUIRY',
      targetId: id,
      after: { responseId: responseRef.id, emailStatus },
      result: emailStatus === 'failed' ? 'FAILURE' : 'SUCCESS',
      ip,
    });

    return NextResponse.json({ success: true, emailStatus, responseId: responseRef.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[AddInquiryResponse] error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
