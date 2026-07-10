import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { WebhooksController } from './webhooks.controller.js';
import { CommerceService } from '../commerce/commerce.service.js';
import * as stripeUtils from '../stripe.js';
import type { Request } from 'express';

vi.mock('../stripe.js', () => ({
  constructStripeEvent: vi.fn(),
  getStripeClient: vi.fn(),
}));

describe('WebhooksController', () => {
  let controller: WebhooksController;
  let mockCommerceService: Partial<CommerceService>;

  beforeEach(() => {
    mockCommerceService = {
      recordDonation: vi.fn().mockResolvedValue({ id: 'donation-123' }),
      fulfillPackagePurchase: vi.fn().mockResolvedValue({ id: 'package-123' }),
      fulfillSessionPayment: vi.fn().mockResolvedValue({ id: 'session-123' }),
      cancelSessionPayment: vi.fn().mockResolvedValue({ id: 'session-cancelled' }),
      getUserByEmail: vi.fn().mockResolvedValue({ id: 'user-123' }),
    };

    controller = new WebhooksController(mockCommerceService as CommerceService);
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret_32_characters_long_minimum';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 500/error response when rawBody is missing', async () => {
    const req = {
      headers: { 'stripe-signature': 'sig-123' },
    } as unknown as Request;

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ error: 'Server configuration error', status: 500 });
  });

  it('should return 400/error response when stripe-signature is missing', async () => {
    const req = {
      headers: {},
      rawBody: Buffer.from('payload'),
    } as unknown as Request;

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ error: 'Missing signature or webhook secret', status: 400 });
  });

  it('should return 400/error response when signature verification fails', async () => {
    const req = {
      headers: { 'stripe-signature': 'invalid-sig' },
      rawBody: Buffer.from('payload'),
    } as unknown as Request;

    vi.mocked(stripeUtils.constructStripeEvent).mockImplementationOnce(() => {
      throw new Error('Invalid signature');
    });

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ error: 'Webhook Error: Invalid signature', status: 400 });
  });

  it('should handle payment_intent.succeeded with DONATION type', async () => {
    const req = {
      headers: { 'stripe-signature': 'valid-sig' },
      rawBody: Buffer.from('payload'),
    } as unknown as Request;

    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          amount: 5000,
          metadata: {
            type: 'DONATION',
            tier: 'SUPPORTER',
            userId: 'user-123',
          },
        },
      },
    };

    vi.mocked(stripeUtils.constructStripeEvent).mockReturnValueOnce(mockEvent as any);

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ received: true });
    expect(mockCommerceService.recordDonation).toHaveBeenCalledWith(5000, 'SUPPORTER', 'pi_123', 'user-123');
  });

  it('should handle payment_intent.succeeded with PACKAGE_PURCHASE type', async () => {
    const req = {
      headers: { 'stripe-signature': 'valid-sig' },
      rawBody: Buffer.from('payload'),
    } as unknown as Request;

    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_456',
          amount: 22500,
          metadata: {
            type: 'PACKAGE_PURCHASE',
            userId: 'user-123',
            credits: '5',
            packageName: 'Essential Pack',
          },
        },
      },
    };

    vi.mocked(stripeUtils.constructStripeEvent).mockReturnValueOnce(mockEvent as any);

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ received: true });
    expect(mockCommerceService.fulfillPackagePurchase).toHaveBeenCalledWith('user-123', 5, 'Essential Pack', 'pi_456');
  });

  it('should handle payment_intent.succeeded with sessionId', async () => {
    const req = {
      headers: { 'stripe-signature': 'valid-sig' },
      rawBody: Buffer.from('payload'),
    } as unknown as Request;

    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_789',
          metadata: {
            sessionId: 'session-456',
          },
        },
      },
    };

    vi.mocked(stripeUtils.constructStripeEvent).mockReturnValueOnce(mockEvent as any);

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ received: true });
    expect(mockCommerceService.fulfillSessionPayment).toHaveBeenCalledWith('session-456', 'pi_789');
  });

  it('should handle payment_intent.payment_failed with sessionId', async () => {
    const req = {
      headers: { 'stripe-signature': 'valid-sig' },
      rawBody: Buffer.from('payload'),
    } as unknown as Request;

    const mockEvent = {
      type: 'payment_intent.payment_failed',
      data: {
        object: {
          id: 'pi_failed',
          metadata: {
            sessionId: 'session-456',
          },
        },
      },
    };

    vi.mocked(stripeUtils.constructStripeEvent).mockReturnValueOnce(mockEvent as any);

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ received: true });
    expect(mockCommerceService.cancelSessionPayment).toHaveBeenCalledWith('session-456');
  });

  it('should handle checkout.session.completed with DONATION type', async () => {
    const req = {
      headers: { 'stripe-signature': 'valid-sig' },
      rawBody: Buffer.from('payload'),
    } as unknown as Request;

    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_donation',
          payment_intent: 'pi_donation',
          customer_details: { email: 'donor@example.com' },
          metadata: {
            type: 'DONATION',
            amount: '10000',
            tier: 'BUILDER',
            userId: 'user-abc',
          },
        },
      },
    };

    vi.mocked(stripeUtils.constructStripeEvent).mockReturnValueOnce(mockEvent as any);

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ received: true });
    expect(mockCommerceService.recordDonation).toHaveBeenCalledWith(10000, 'BUILDER', 'pi_donation', 'user-abc');
  });

  it('should handle checkout.session.completed with PACKAGE_PURCHASE type', async () => {
    const req = {
      headers: { 'stripe-signature': 'valid-sig' },
      rawBody: Buffer.from('payload'),
    } as unknown as Request;

    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_pkg',
          payment_intent: 'pi_pkg',
          metadata: {
            type: 'PACKAGE_PURCHASE',
            userId: 'user-789',
            credits: '10',
            packageName: 'Sanctuary Pack',
          },
        },
      },
    };

    vi.mocked(stripeUtils.constructStripeEvent).mockReturnValueOnce(mockEvent as any);

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ received: true });
    expect(mockCommerceService.fulfillPackagePurchase).toHaveBeenCalledWith('user-789', 10, 'Sanctuary Pack', 'pi_pkg');
  });

  it('should handle checkout.session.completed with SESSION_PAYMENT type', async () => {
    const req = {
      headers: { 'stripe-signature': 'valid-sig' },
      rawBody: Buffer.from('payload'),
    } as unknown as Request;

    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_session',
          payment_intent: 'pi_session',
          metadata: {
            type: 'SESSION_PAYMENT',
            sessionId: 'session-xyz',
          },
        },
      },
    };

    vi.mocked(stripeUtils.constructStripeEvent).mockReturnValueOnce(mockEvent as any);

    const result = await controller.handleStripeWebhook(req);
    expect(result).toEqual({ received: true });
    expect(mockCommerceService.fulfillSessionPayment).toHaveBeenCalledWith('session-xyz', 'pi_session');
  });
});
