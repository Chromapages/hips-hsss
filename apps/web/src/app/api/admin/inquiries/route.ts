import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const take = Math.min(parseInt(searchParams.get('take') ?? '50', 10), 100);
  const skip = parseInt(searchParams.get('skip') ?? '0', 10);

  try {
    const [inquiries, total] = await Promise.all([
      prisma.orgInquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.orgInquiry.count(),
    ]);
    return NextResponse.json({ data: inquiries, total, take, skip });
  } catch (error) {
    console.error('Admin Inquiry List Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
