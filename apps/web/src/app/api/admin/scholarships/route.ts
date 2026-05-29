import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

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

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const take = Math.min(parseInt(searchParams.get('take') ?? '50', 10), 100);
  const skip = parseInt(searchParams.get('skip') ?? '0', 10);

  try {
    const [scholarships, total] = await Promise.all([
      prisma.scholarship.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.scholarship.count(),
    ]);
    return NextResponse.json({ data: scholarships, total, take, skip });
  } catch (error) {
    console.error('Admin Scholarship List Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
