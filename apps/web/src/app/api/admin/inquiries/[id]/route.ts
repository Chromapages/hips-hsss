import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const inquiryUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED']),
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
    const result = inquiryUpdateSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const { id } = await params;
    const { status } = result.data;

    const inquiry = await prisma.orgInquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Admin Inquiry Update Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
