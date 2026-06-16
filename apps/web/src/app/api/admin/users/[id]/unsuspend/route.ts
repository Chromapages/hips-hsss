import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';
import { sendEmail } from '@/lib/email';

const unsuspendSchema = z.object({
  reason: z.string().min(3, 'Please provide a reason (3+ chars)').max(1000),
  notifyUser: z.boolean().default(true),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const { id: firebaseUid } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const parsed = unsuspendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.format() },
      { status: 400 }
    );
  }
  const { reason, notifyUser } = parsed.data;

  const prisma = getPrisma();
  const target = await prisma.user.findFirst({
    where: { firebaseUid, deletedAt: null },
    select: { id: true, email: true, suspendedAt: true },
  });
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  if (!target.suspendedAt) {
    return NextResponse.json({ error: 'User is not suspended' }, { status: 409 });
  }

  try {
    await prisma.user.update({
      where: { id: target.id },
      data: {
        suspendedAt: null,
        suspendedBy: null,
        suspensionReason: null,
      },
    });

    let emailStatus: 'sent' | 'skipped' | 'failed' = 'skipped';
    if (notifyUser) {
      try {
        const result = await sendEmail({
          to: target.email,
          subject: 'Your H.I.P.S. account has been reactivated',
          html: `
            <h1>Welcome back</h1>
            <p>Hello,</p>
            <p>Your H.I.P.S. account has been reactivated by an administrator.</p>
            <p><strong>Reason:</strong> ${escapeHtml(reason)}</p>
            <p>You can sign in again immediately.</p>
            <p>— H.I.P.S. Team</p>
          `,
        });
        emailStatus = result?.id ? 'sent' : 'failed';
      } catch (err) {
        console.error('Unsuspend email failed:', err);
        emailStatus = 'failed';
      }
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'USER_UNSUSPEND',
      targetType: 'USER',
      targetId: firebaseUid,
      before: { suspendedAt: target.suspendedAt.toISOString() },
      after: { suspendedAt: null },
      justification: reason,
      result: 'SUCCESS',
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, emailStatus });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('Unsuspend user error:', message);
    return NextResponse.json({ error: 'Failed to unsuspend user' }, { status: 500 });
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
