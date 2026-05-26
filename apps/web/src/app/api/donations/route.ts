import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripeServerClient } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const donationSchema = z.object({
  tier: z.enum(['SUPPORTER', 'BUILDER', 'SUSTAINER', 'CATALYST']),
  amountCents: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Optional Authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    let userId: string | undefined;

    if (token) {
      try {
        const payload = await verifyFirebaseIdToken(token);
        const firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;
        if (firebaseUid) {
          const user = await prisma.user.findUnique({ where: { firebaseUid } });
          userId = user?.id;
        }
      } catch {
        console.warn('Invalid donation token, proceeding as guest');
      }
    }

    // 2. Validate Input
    const body = await req.json();
    const result = donationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { tier, amountCents } = result.data;

    // 3. Create Payment Intent
    const stripe = getStripeServerClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'DONATION',
        tier,
        userId: userId || '',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Donation Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
