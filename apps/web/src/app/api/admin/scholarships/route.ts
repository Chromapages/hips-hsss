import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const listQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).optional().default(50),
  skip: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(['ALL', 'PENDING', 'APPROVED', 'DENIED']).optional().default('ALL'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const parsed = listQuerySchema.safeParse({
    take: searchParams.get('take') ?? undefined,
    skip: searchParams.get('skip') ?? undefined,
    status: searchParams.get('status') ?? 'ALL',
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.format() },
      { status: 400 }
    );
  }
  const { take, skip, status, startDate, endDate } = parsed.data;

  const where: any = {};
  if (status !== 'ALL') {
    where.status = status;
  }
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  try {
    const [scholarships, total] = await Promise.all([
      prisma.scholarship.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.scholarship.count({ where }),
    ]);
    return NextResponse.json({ data: scholarships, total, take, skip, filters: { status, startDate, endDate } });
  } catch (error) {
    console.error('Admin Scholarship List Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
