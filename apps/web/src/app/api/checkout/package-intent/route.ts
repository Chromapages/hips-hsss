import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripeServerClient } from '@/lib/stripe';
import { verifyFirebaseIdToken } from '@/lib/firebase-auth';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

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

    // 2. Per-user rate limit. Caps intentional retries at 5 per minute
    // without blocking legitimate users (Stripe checkout flow can retry
    // a few times during card entry). See H8 in the audit report.
    const rateLimitResult = checkRateLimit(`pkg:${firebaseUid}`, 5, 60_000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many package-intent requests. Please slow down.' },
        { status: 429, headers: getRateLimitHeaders(rateLimitResult.resetAt, 0, 5) }
      );
    }

    // 3. Validate Input
    const body = await req.json();
    const result = packageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid package selection' }, { status: 400 });
    }

    const { packageId } = result.data;
    const pkg = PACKAGES[packageId];

    // 4. Create Payment Intent or Bypass if Demo Mode
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    if (isDemoMode) {
      const mockSecret = `demo_package_${packageId}`;
      console.log(`[Demo Mode] Bypassed Stripe package intent creation for ${firebaseUid}: ${packageId}`);
      return NextResponse.json({
        clientSecret: mockSecret,
        packageName: pkg.name,
        amount: pkg.priceCents / 100,
      });
    }

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
    }, {
      idempotencyKey: `package:${firebaseUid}:${packageId}`,
    });

    console.log(`[Stripe Intent] Created package intent for ${firebaseUid}: ${packageId}`);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      packageName: pkg.name,
      amount: pkg.priceCents / 100,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Stripe Package Intent Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
