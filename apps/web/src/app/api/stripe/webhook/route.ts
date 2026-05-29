import { NextRequest, NextResponse } from 'next/server';
import { getStripeServerClient } from '@/lib/stripe';
import { getDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeServerClient();
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('Webhook signature verification failed.', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { type, sessionId, userId, tier, credits, packageName } = paymentIntent.metadata;

      if (type === 'DONATION') {
        // Idempotency: skip if donation with this stripePaymentId already exists
        const existingDonation = await db.collection('donations')
          .where('stripePaymentId', '==', paymentIntent.id)
          .limit(1)
          .get();
        if (!existingDonation.empty) {
          console.log(`[Stripe Webhook] Donation already recorded for payment ${paymentIntent.id}, skipping`);
        } else {
          await db.collection('donations').add({
            amountCents: paymentIntent.amount,
            tier: tier || 'GENERAL',
            stripePaymentId: paymentIntent.id,
            userId: userId || null,
            createdAt: new Date().toISOString(),
          });
          console.log(`[Stripe Webhook] Donation recorded in Firestore: ${paymentIntent.amount} cents`);
        }
      } else if (type === 'PACKAGE_PURCHASE') {
        // Handle Session Package Purchase
        try {
          if (!userId) {
            return NextResponse.json({ error: 'Missing package purchaser' }, { status: 400 });
          }

          const numCredits = parseInt(credits || '0');

          // Create a new package entry for the user
          // For simplicity, each purchase adds a new "Package" document
          await db.collection('packages').add({
            userId,
            serviceName: packageName || 'Session Pack',
            totalSessions: numCredits,
            usedSessions: 0,
            stripePaymentId: paymentIntent.id,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          console.log(`[Stripe Webhook] Package purchase fulfilled for ${userId}: ${numCredits} credits`);

          // Send confirmation email
          const userRef = db.collection('users').doc(userId);
          const userDoc = await userRef.get();
          const user = userDoc.data();

          if (user?.email) {
            await sendEmail({
              to: user.email,
              subject: `Purchase Confirmed: ${packageName}`,
              html: `
                <h1>Thank you for your purchase!</h1>
                <p>Hello,</p>
                <p>Your purchase of the <strong>${packageName}</strong> has been confirmed.</p>
                <p><strong>Credits Added:</strong> ${numCredits} sessions</p>
                <p>You can now use these credits to book support sessions from your dashboard.</p>
                <p>Stay safe, <br/>The H.I.P.S. Team</p>
              `,
            });
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Internal Server Error';
          console.error(`[Stripe Webhook] Failed to fulfill package purchase for ${userId}:`, message);
          return NextResponse.json({ error: 'Package fulfillment failed' }, { status: 500 });
        }
      } else if (sessionId) {
        // Update session in Firestore
        try {
          const sessionRef = db.collection('sessions').doc(sessionId);
          const sessionDoc = await sessionRef.get();

          if (!sessionDoc.exists) {
            console.error(`[Stripe Webhook] Session ${sessionId} not found`);
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
          }

          const session = sessionDoc.data();

          await sessionRef.update({
            stripePaymentId: paymentIntent.id,
            status: 'SCHEDULED',
            updatedAt: new Date().toISOString(),
          });

          console.log(`[Stripe Webhook] Payment succeeded for session ${sessionId}`);

          // Send confirmation email
          const userRef = db.collection('users').doc(session?.userId);
          const userDoc = await userRef.get();
          const user = userDoc.data();

          if (user?.email) {
            await sendEmail({
              to: user.email,
              subject: `Session Confirmed: ${session?.serviceName}`,
              html: `
                <h1>Your session is confirmed!</h1>
                <p>Hello,</p>
                <p>Your booking for <strong>${session?.serviceName}</strong> has been successfully paid and scheduled.</p>
                <p><strong>Starts At:</strong> ${new Date(session?.startsAt).toLocaleString()}</p>
                <p>You can join your anonymous session room from your dashboard at the scheduled time.</p>
                <p>Thank you for using H.I.P.S.</p>
              `,
            });
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Internal Server Error';
          console.error(`[Stripe Webhook] Failed to update session or send email for ${sessionId}:`, message);
          return NextResponse.json({ error: 'Post-payment processing failed' }, { status: 500 });
        }
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const sessionId = paymentIntent.metadata.sessionId;

      if (sessionId) {
        await db.collection('sessions').doc(sessionId).update({
          status: 'CANCELLED',
          updatedAt: new Date().toISOString(),
        });
        console.warn(`[Stripe Webhook] Payment failed for session ${sessionId}`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
