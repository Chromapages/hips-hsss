import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripeServerClient } from '@/lib/stripe';
import { getDb, isFirebaseAdminReady } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const intentSchema = z.object({
  sessionId: z.string(), // Firestore IDs are strings
});

export async function POST(req: NextRequest) {
  // Initialize Firestore lazily — return 503 if not configured
  const db = getDb();
  if (!db) {
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again later.',
    }, { status: 503 });
  }

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
    const result = intentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { sessionId } = result.data;

    // 3. Fetch Session and Service price from Firestore
    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const session = sessionDoc.data();

    // Security: Ensure session belongs to the user
    if (session?.userId !== firebaseUid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch the service to get the price
    const serviceRef = db.collection('services').doc(session?.serviceId);
    const serviceDoc = await serviceRef.get();
    const service = serviceDoc.data();

    if (!service) {
      return NextResponse.json({ error: 'Service details not found' }, { status: 404 });
    }

    // Verify user owns or has access to the service
    if (service.userId !== undefined && service.userId !== firebaseUid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Create Payment Intent
    const stripe = getStripeServerClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: service.priceCents || 5000, // Fallback to $50 if not set
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        sessionId: sessionId,
        userId: firebaseUid,
        serviceId: session?.serviceId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error('Stripe Intent Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
