import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@/lib/prisma';
import { getAdminAuth } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';
import { sendEmail } from '@/lib/email';

const suspendSchema = z.object({
  reason: z.string().min(5, 'Please provide a suspension reason (5+ characters)').max(1000),
  notifyUser: z.boolean().default(true),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: 'Firebase Admin SDK unavailable' }, { status: 503 });
  }

  const { id: firebaseUid } = await params;
  if (admin.uid === firebaseUid) {
    return NextResponse.json({ error: 'Cannot suspend your own account' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const parsed = suspendSchema.safeParse(body);
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
    select: { id: true, email: true, role: true, suspendedAt: true },
  });
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  if (target.suspendedAt) {
    return NextResponse.json({ error: 'User is already suspended' }, { status: 409 });
  }
  if (target.role === 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Cannot suspend a SUPER_ADMIN' }, { status: 403 });
  }

  try {
    await prisma.user.update({
      where: { id: target.id },
      data: {
        suspendedAt: new Date(),
        suspendedBy: admin.uid,
        suspensionReason: reason,
      },
    });

    // Revoke all Firebase refresh tokens so the user is logged out
    try {
      await auth.revokeRefreshTokens(firebaseUid);
    } catch (err) {
      console.error('Failed to revoke refresh tokens during suspend:', err);
    }

    // Send notification email (best-effort)
    let emailStatus: 'sent' | 'skipped' | 'failed' = 'skipped';
    if (notifyUser) {
      try {
        const result = await sendEmail({
          to: target.email,
          subject: 'Your H.I.P.S. account has been suspended',
          html: `
            <h1>Account suspended</h1>
            <p>Hello,</p>
            <p>Your H.I.P.S. account has been suspended by an administrator.</p>
            <p><strong>Reason:</strong> ${escapeHtml(reason)}</p>
            <p>You will not be able to sign in until the suspension is lifted. If you believe this is a mistake, please contact support@hips-support.org.</p>
            <p>— H.I.P.S. Team</p>
          `,
        });
        emailStatus = result?.id ? 'sent' : 'failed';
      } catch (err) {
        console.error('Suspend email failed:', err);
        emailStatus = 'failed';
      }
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'USER_SUSPEND',
      targetType: 'USER',
      targetId: firebaseUid,
      after: { suspendedAt: new Date().toISOString(), reason },
      justification: reason,
      result: 'SUCCESS',
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, emailStatus });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('Suspend user error:', message);
    return NextResponse.json({ error: 'Failed to suspend user' }, { status: 500 });
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
