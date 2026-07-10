import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';
import { writeAuditEvent } from '@/lib/admin-audit';

const updateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'DENIED']),
  approvedCents: z.number().int().nonnegative().optional(),
  decisionNote: z.string().min(3, 'A decision note is required').max(2000),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  try {
    const body = await req.json();
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const { id } = await params;
    const { status, approvedCents, decisionNote } = result.data;

    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 });
    }

    // Disallow re-deciding an already-finalized application unless the
    // admin explicitly resets it to PENDING (under-review). Approving a
    // previously-denied application is treated as a fresh decision.
    if (scholarship.status === 'APPROVED' || scholarship.status === 'DENIED') {
      if (status !== 'PENDING') {
        return NextResponse.json(
          { error: 'Scholarship has already been processed. Reset to PENDING to re-decide.' },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.scholarship.update({
      where: { id },
      data: {
        status,
        approvedCents: status === 'APPROVED' ? approvedCents ?? null : null,
        // Persist the decision note + actor into the existing `note` field
        // for visibility. We append rather than overwrite the original
        // application content.
        note: scholarship.note
          ? `${scholarship.note}\n\n--- DECISION ---\nActor: ${admin.email || admin.uid}\nAt: ${new Date().toISOString()}\nNew status: ${status}\nNote: ${decisionNote}`
          : `--- DECISION ---\nActor: ${admin.email || admin.uid}\nAt: ${new Date().toISOString()}\nNew status: ${status}\nNote: ${decisionNote}`,
      },
      include: { user: true },
    });

    // Build decision email body
    const subjectByStatus: Record<string, string> = {
      APPROVED: 'Scholarship approved',
      DENIED: 'Scholarship application decision',
      PENDING: 'Your scholarship application is under review',
    };
    const subject = subjectByStatus[status] ?? 'Scholarship application update';

    const amountLine = status === 'APPROVED'
      ? `<p>We are pleased to inform you that your scholarship for <strong>$${((approvedCents ?? 0) / 100).toFixed(2)}</strong> has been approved. This credit has been applied to your account and is ready to use towards your support sessions.</p>`
      : status === 'DENIED'
        ? `<p>After review, we are unable to approve a scholarship at this time.</p><p><strong>Reviewer note:</strong> ${escapeHtml(decisionNote)}</p><p>You are welcome to apply again in the future if your circumstances change.</p>`
        : `<p>Your application is now under review. We will follow up with a final decision within 48 hours.</p>`;

    sendEmail({
      to: updated.user.email,
      subject,
      html: `
        <h1>Your scholarship application has been ${status.toLowerCase()}.</h1>
        <p>Hello,</p>
        ${amountLine}
        <p>Application ID: <code>${updated.id}</code></p>
        <p>— H.I.P.S. Team</p>
      `,
    }).catch((err) => {
      console.error('Scholarship decision email failed:', err);
    });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'SCHOLARSHIP_DECISION',
      targetType: 'SCHOLARSHIP',
      targetId: id,
      before: { status: scholarship.status, approvedCents: scholarship.approvedCents },
      after: { status: updated.status, approvedCents: updated.approvedCents },
      justification: decisionNote,
      result: 'SUCCESS',
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, scholarship: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Admin Scholarship Update Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const { id } = await params;
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, role: true, createdAt: true },
        },
      },
    });
    if (!scholarship) {
      return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 });
    }
    return NextResponse.json({ scholarship });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Admin Scholarship Detail Error:', message);
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
