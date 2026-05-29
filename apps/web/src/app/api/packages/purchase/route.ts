import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { addMonths } from 'date-fns';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  typescript: true,
});

const purchaseSchema = z.object({
  checkoutSessionId: z.string().min(1),
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

    // 4. Verify Stripe checkout session is valid, completed, and belongs to this user
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Payment service unavailable' }, { status: 503 });
    }

    let checkoutSession: Stripe.Checkout.Session;
    try {
      checkoutSession = await stripe.checkout.sessions.retrieve(result.data.checkoutSessionId);
    } catch {
      return NextResponse.json({ error: 'Invalid checkout session' }, { status: 400 });
    }

    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }

    if (checkoutSession.metadata?.userId !== firebaseUid) {
      return NextResponse.json({ error: 'Checkout session does not belong to this user' }, { status: 403 });
    }

    // 5. Create Package (idempotent — skip if already fulfilled via webhook)
    const existingPackage = await prisma.package.findFirst({
      where: {
        userId: user.id,
        serviceId,
        status: 'ACTIVE',
      },
    });

    if (existingPackage) {
      return NextResponse.json({
        success: true,
        package: {
          id: existingPackage.id,
          service: existingPackage.serviceId,
          totalSessions: existingPackage.totalSessions,
          usedSessions: existingPackage.usedSessions,
          expiresAt: existingPackage.expiresAt,
        },
      });
    }

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
