import { NextRequest, NextResponse } from 'next/server';
import { safetyPrisma, prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decodedToken = await verifyFirebaseIdToken(token);
  if (!decodedToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const firebaseUid = typeof decodedToken.sub === 'string' ? decodedToken.sub : null;

  if (!firebaseUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const alerts = await safetyPrisma.safetyAlert.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(alerts);
}
