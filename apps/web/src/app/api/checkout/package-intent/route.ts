import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripeServerClient } from '@/lib/stripe';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const packageSchema = z.object({
  packageId: z.enum(['SINGLE', 'ESSENTIAL', 'SANCTUARY']),
});

const PACKAGES = {
  SINGLE: { priceCents: 5000, credits: 1, name: 'Single Session' },
  ESSENTIAL: { priceCents: 22500, credits: 5, name: 'Essential Pack (5)' },
  SANCTUARY: { priceCents: 40000, credits: 10, name: 'Sanctuary Pack (10)' },
};

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
    const result = packageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid package selection' }, { status: 400 });
    }

    const { packageId } = result.data;
    const pkg = PACKAGES[packageId];

    // 3. Create Payment Intent with Package Metadata
    const stripe = getStripeServerClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pkg.priceCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'PACKAGE_PURCHASE',
        packageId,
        userId: firebaseUid,
        credits: pkg.credits.toString(),
        packageName: pkg.name,
      },
    });

    console.log(`[Stripe Intent] Created package intent for ${firebaseUid}: ${packageId}`);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      packageName: pkg.name,
      amount: pkg.priceCents / 100,
    });
  } catch (error: any) {
    console.error('Stripe Package Intent Error:', error.message || error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
