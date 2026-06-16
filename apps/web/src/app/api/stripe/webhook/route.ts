import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';
import { sendEmail } from '@/lib/email';
import { verifyWebhookSignature } from '@/lib/webhooks/verify';
import { registerEventId } from '@/lib/webhooks/idempotency';
import { logSecurityEvent } from '@/lib/security/audit';
import { logger, safeError } from '@/lib/logger';

/**
 * Stripe webhook handler — Layer 5.
 *
 * Pipeline (every step is required):
 *  1. Read the raw body. The Stripe SDK requires exact bytes for the
 *     signature check; JSON.parse → JSON.stringify would invalidate it.
 *  2. verifyWebhookSignature({ provider: 'stripe' }) — covers signature
 *     and the ±5-min timestamp window.
 *  3. registerEventId(event.id) — Redis-backed dedup with 24h TTL.
 *     Duplicate deliveries (Stripe retries) are acknowledged with 200
 *     and not re-processed.
 *  4. Hand the event to a fire-and-forget processor. The route returns
 *     200 immediately so Stripe doesn't retry; transient failures inside
 *     the processor are logged but do not affect the response.
 *  5. Signature failures are logged to the security audit log.
 */

const ENDPOINT = '/api/stripe/webhook';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  // 1+2: Verify signature and timestamp window.
  const verification = verifyWebhookSignature({
    provider: 'stripe',
    body: payload,
    signature: sig,
    endpoint: ENDPOINT,
  });

  if (!verification.ok) {
    // 5: Audit log the failure.
    await logSecurityEvent({
      eventType: 'WEBHOOK_SIGNATURE_FAILED',
      outcome: 'FAILURE',
      targetType: 'webhook',
      targetId: ENDPOINT,
      failureReason: verification.reason,
      metadata: { provider: 'stripe', detail: verification.detail },
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
      userAgent: req.headers.get('user-agent') ?? undefined,
    });

    const status = verification.reason === 'misconfigured' ? 500 : 400;
    return NextResponse.json(
      { error: `Webhook verification failed: ${verification.reason}` },
      { status },
    );
  }

  const event = verification.event as Stripe.Event;

  // 3: Idempotency — claim the event id. If we've seen it, return 200
  // without re-processing. This is the protection against Stripe's
  // automatic retry on a 5xx we previously returned.
  const { firstSeen } = await registerEventId(`stripe:${event.id}`);
  if (!firstSeen) {
    return NextResponse.json({ received: true, replay: true });
  }

  // 4: Hand off to background processing. The route returns 200 fast;
  // processing errors are logged but do not change the response. The
  // processor is in-process for now (setImmediate). When a real queue
  // is added (BullMQ/Inngest/etc), swap this single call out.
  setImmediate(() => {
    processStripeEvent(event).catch((err) => {
      logger.error('Stripe webhook processing failed', {
        eventId: event.id,
        eventType: event.type,
        error: safeError(err),
      });
    });
  });

  return NextResponse.json({ received: true });
}

// ─── Background processor ──────────────────────────────────────────────────

async function processStripeEvent(event: Stripe.Event): Promise<void> {
  const db = getDb();
  if (!db) {
    logger.warn('Stripe webhook: Firebase Admin not initialized; cannot process event', {
      eventId: event.id,
    });
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { type, sessionId, userId, tier, credits, packageName } = paymentIntent.metadata;

      if (type === 'DONATION') {
        try {
          await db.collection('donations').add({
            amountCents: paymentIntent.amount,
            tier: tier || 'GENERAL',
            stripePaymentId: paymentIntent.id,
            userId: userId || null,
            createdAt: new Date().toISOString(),
          });
        } catch (err) {
          logger.error('Stripe webhook: failed to record donation', { error: safeError(err) });
        }
      } else if (type === 'PACKAGE_PURCHASE') {
        if (!userId) {
          logger.error('Stripe webhook: PACKAGE_PURCHASE missing userId', { paymentIntentId: paymentIntent.id });
          return;
        }
        const numCredits = parseInt(credits || '0', 10);
        try {
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
        } catch (err) {
          logger.error('Stripe webhook: failed to record package purchase', { error: safeError(err) });
          return;
        }
        // Send confirmation email (best-effort)
        try {
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
        } catch (err) {
          logger.warn('Stripe webhook: confirmation email failed', { error: safeError(err) });
        }
      } else if (sessionId) {
        try {
          const sessionRef = db.collection('sessions').doc(sessionId);
          const sessionDoc = await sessionRef.get();
          if (!sessionDoc.exists) {
            logger.error('Stripe webhook: session not found', { sessionId });
            return;
          }
          const session = sessionDoc.data();
          await sessionRef.update({
            stripePaymentId: paymentIntent.id,
            status: 'SCHEDULED',
            updatedAt: new Date().toISOString(),
          });

          // Confirmation email (best-effort)
          try {
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
          } catch (err) {
            logger.warn('Stripe webhook: session confirmation email failed', { error: safeError(err) });
          }
        } catch (err) {
          logger.error('Stripe webhook: failed to update session', { error: safeError(err), sessionId });
        }
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const sessionId = paymentIntent.metadata.sessionId;
      if (sessionId) {
        try {
          await db.collection('sessions').doc(sessionId).update({
            status: 'CANCELLED',
            updatedAt: new Date().toISOString(),
          });
        } catch (err) {
          logger.error('Stripe webhook: failed to cancel session on payment failure', { error: safeError(err) });
        }
      }
      break;
    }
    default:
      logger.info('Stripe webhook: unhandled event type', { eventType: event.type, eventId: event.id });
  }
}
