import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const inquiryUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  try {
    const body = await req.json();
    const result = inquiryUpdateSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const { id } = await params;
    const { status } = result.data;

    const currentInquiry = await prisma.orgInquiry.findUnique({ where: { id } });
    if (!currentInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    const inquiry = await prisma.orgInquiry.update({
      where: { id },
      data: { status },
    });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'INQUIRY_STATUS_CHANGE',
      targetType: 'INQUIRY',
      targetId: id,
      before: { status: currentInquiry.status },
      after: { status: inquiry.status },
      result: 'SUCCESS',
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Admin Inquiry Update Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
