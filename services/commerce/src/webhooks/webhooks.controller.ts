import { Controller, Post, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { CommerceService } from '../commerce/commerce.service.js';
import { constructStripeEvent } from '../stripe.js';
import { Request } from 'express';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly commerceService: CommerceService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(@Req() req: Request) {
    const sig = req.headers['stripe-signature'] as string;
    const payload = req.body?.rawBody?.toString() || JSON.stringify(req.body) || '';

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return { error: 'Missing signature or webhook secret', status: 400 };
    }

    let event;
    try {
      event = constructStripeEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Webhook Error';
      console.error('Stripe webhook signature verification failed:', message);
      return { error: `Webhook Error: ${message}`, status: 400 };
    }

    // Handle events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        const { type, sessionId, userId, tier, credits, packageName } = paymentIntent.metadata;

        if (type === 'DONATION') {
          await this.commerceService.recordDonation(
            paymentIntent.amount,
            tier || 'GENERAL',
            paymentIntent.id,
            userId || null,
          );
          console.log(`[Stripe Webhook] Donation recorded: ${paymentIntent.amount} cents`);
        } else if (type === 'PACKAGE_PURCHASE') {
          if (!userId) {
            console.error('[Stripe Webhook] Missing userId for package purchase');
            break;
          }
          const numCredits = parseInt(credits || '0');
          await this.commerceService.fulfillPackagePurchase(
            userId,
            numCredits,
            packageName || 'Session Pack',
            paymentIntent.id,
          );
          console.log(`[Stripe Webhook] Package purchase fulfilled for ${userId}: ${numCredits} credits`);
        } else if (sessionId) {
          try {
            await this.commerceService.fulfillSessionPayment(sessionId, paymentIntent.id);
            console.log(`[Stripe Webhook] Session payment fulfilled: ${sessionId}`);
          } catch (err) {
            console.error(`[Stripe Webhook] Failed to fulfill session ${sessionId}:`, err);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        const sessionId = paymentIntent.metadata.sessionId;

        if (sessionId) {
          try {
            await this.commerceService.cancelSessionPayment(sessionId);
            console.warn(`[Stripe Webhook] Payment failed, session cancelled: ${sessionId}`);
          } catch (err) {
            console.error(`[Stripe Webhook] Failed to cancel session ${sessionId}:`, err);
          }
        }
        break;
      }

      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as any;
        console.log(`[Stripe Webhook] Checkout session completed: ${checkoutSession.id}`);

        // Route to appropriate fulfillment based on metadata
        const metadata = checkoutSession.metadata || {};
        const { type, userId, tier, amount, credits, packageName, sessionId } = metadata;

        if (type === 'DONATION' && amount) {
          // For donations, record directly (payment_intent.succeeded already handles this
          // but we handle checkout.session.completed as well for completeness)
          const userIdFromSession = checkoutSession.customer_details?.email
            ? (await this.commerceService.getUserByEmail(checkoutSession.customer_details.email))?.id
            : null;
          await this.commerceService.recordDonation(
            parseInt(amount),
            tier || 'GENERAL',
            checkoutSession.payment_intent,
            userId || userIdFromSession || null,
          );
          console.log(`[Stripe Webhook] Donation recorded from checkout: ${amount} cents`);
        } else if (type === 'PACKAGE_PURCHASE' && userId && credits) {
          await this.commerceService.fulfillPackagePurchase(
            userId,
            parseInt(credits),
            packageName || 'Session Pack',
            checkoutSession.payment_intent,
          );
          console.log(`[Stripe Webhook] Package purchase fulfilled from checkout for ${userId}: ${credits} credits`);
        } else if (type === 'SESSION_PAYMENT' && sessionId) {
          try {
            await this.commerceService.fulfillSessionPayment(sessionId, checkoutSession.payment_intent);
            console.log(`[Stripe Webhook] Session payment fulfilled from checkout: ${sessionId}`);
          } catch (err) {
            console.error(`[Stripe Webhook] Failed to fulfill session ${sessionId}:`, err);
          }
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}