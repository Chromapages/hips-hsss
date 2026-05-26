import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { addMonths } from 'date-fns';

const purchaseSchema = z.object({
  serviceId: z.string().uuid(),
  totalSessions: z.number().int().min(1).max(20),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyFirebaseIdToken(token);
    const firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate Input
    const body = await req.json();
    const result = purchaseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
    }

    const { serviceId, totalSessions } = result.data;

    // 3. Find User
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json({ error: 'User profile not synchronized' }, { status: 404 });
    }

    // 4. Create Package
    // Note: In production, this would be tied to a Stripe checkout session/webhook.
    const pkg = await prisma.package.create({
      data: {
        userId: user.id,
        serviceId,
        totalSessions,
        usedSessions: 0,
        expiresAt: addMonths(new Date(), 6), // 6 month default expiration
      },
      include: {
        service: true,
      }
    });

    return NextResponse.json({
      success: true,
      package: {
        id: pkg.id,
        service: pkg.service.name,
        totalSessions: pkg.totalSessions,
        usedSessions: pkg.usedSessions,
        expiresAt: pkg.expiresAt,
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Package purchase failed:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
