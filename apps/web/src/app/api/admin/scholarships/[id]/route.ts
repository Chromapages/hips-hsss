import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { sendEmail } from '@/lib/email';

const updateSchema = z.object({
  status: z.enum(['APPROVED', 'DENIED']),
  approvedCents: z.number().int().nonnegative().optional(),
});

async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return null;

  try {
    const payload = await verifyFirebaseIdToken(token);
    const firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;
    if (!firebaseUid) return null;

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (user?.role !== 'ADMIN') return null;
    return user;
  } catch {
    return null;
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const result = updateSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });

    const { id } = await params;
    const { status, approvedCents } = result.data;

    const scholarship = await prisma.scholarship.update({
      where: { id },
      data: {
        status,
        approvedCents: status === 'APPROVED' ? approvedCents ?? null : null,
      },
      include: { user: true },
    });

    // Send notification email
    await sendEmail({
      to: scholarship.user.email,
      subject: `Scholarship Application: ${status}`,
      html: `
        <h1>Your scholarship application has been ${status.toLowerCase()}.</h1>
        <p>Hello,</p>
        ${status === 'APPROVED' 
          ? `<p>We are pleased to inform you that your scholarship for <strong>$${(approvedCents || 0) / 100}</strong> has been approved. You can now use this credit towards your support sessions.</p>`
          : `<p>We regret to inform you that your scholarship application has been denied at this time. You are welcome to apply again in the future if your circumstances change.</p>`
        }
        <p>Thank you,</p>
        <p>H.I.P.S. Team</p>
      `,
    });

    return NextResponse.json({ success: true, scholarship });
  } catch (error) {
    console.error('Admin Scholarship Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
