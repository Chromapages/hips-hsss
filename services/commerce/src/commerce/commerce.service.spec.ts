import { describe, it, expect, beforeAll, vi } from 'vitest';
import { CommerceService } from './commerce.service.js';

// Mock PrismaService
const mockPrisma = {
  session: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
  package: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  donation: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  orgInquiry: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
} as any;

// Mock Stripe client
const mockPaymentIntent = {
  id: 'pi_test123',
  amount: 5000,
  client_secret: 'pi_test123_secret',
  metadata: {
    type: 'DONATION',
    tier: 'SUPPORTER',
    userId: 'user123',
  },
};

vi.mock('../stripe.js', () => ({
  getStripeClient: () => ({
    paymentIntents: {
      create: vi.fn().mockResolvedValue(mockPaymentIntent),
    },
  }),
}));

describe('CommerceService', () => {
  let service: CommerceService;

  beforeAll(() => {
    service = new CommerceService(mockPrisma);
  });

  describe('createDonationIntent', () => {
    it('should create a donation payment intent', async () => {
      const result = await service.createDonationIntent('user123', {
        tier: 'SUPPORTER',
        amountCents: 5000,
      });

      expect(result).toHaveProperty('clientSecret');
      expect(result.clientSecret).toBe('pi_test123_secret');
    });
  });

  describe('recordDonation', () => {
    it('should record a donation to the database', async () => {
      mockPrisma.donation.create.mockResolvedValue({
        id: 'donation123',
        amountCents: 5000,
        tier: 'SUPPORTER',
        stripePaymentId: 'pi_test123',
        userId: 'user123',
      });

      const result = await service.recordDonation(5000, 'SUPPORTER', 'pi_test123', 'user123');

      expect(mockPrisma.donation.create).toHaveBeenCalledWith({
        data: {
          amountCents: 5000,
          tier: 'SUPPORTER',
          stripePaymentId: 'pi_test123',
          userId: 'user123',
        },
      });
      expect(result.id).toBe('donation123');
    });
  });

  describe('createOrgInquiry', () => {
    it('should create an organization inquiry', async () => {
      mockPrisma.orgInquiry.create.mockResolvedValue({
        id: 'inquiry123',
        orgName: 'Test Org',
        contactName: 'John Doe',
        email: 'john@test.org',
        status: 'NEW',
      });

      const result = await service.createOrgInquiry({
        orgName: 'Test Org',
        contactName: 'John Doe',
        email: 'john@test.org',
        message: 'Interested in training',
      });

      expect(result).toHaveProperty('inquiryId');
      expect(result.inquiryId).toBe('inquiry123');
    });
  });

  describe('fulfillSessionPayment', () => {
    it('should update session status to SCHEDULED on payment success', async () => {
      mockPrisma.session.update.mockResolvedValue({
        id: 'session123',
        status: 'SCHEDULED',
        stripePaymentId: 'pi_test123',
      });

      const result = await service.fulfillSessionPayment('session123', 'pi_test123');

      expect(mockPrisma.session.update).toHaveBeenCalledWith({
        where: { id: 'session123' },
        data: { stripePaymentId: 'pi_test123', status: 'SCHEDULED' },
      });
      expect(result.status).toBe('SCHEDULED');
    });
  });

  describe('cancelSessionPayment', () => {
    it('should update session status to CANCELLED on payment failure', async () => {
      mockPrisma.session.update.mockResolvedValue({
        id: 'session123',
        status: 'CANCELLED',
      });

      const result = await service.cancelSessionPayment('session123');

      expect(mockPrisma.session.update).toHaveBeenCalledWith({
        where: { id: 'session123' },
        data: { status: 'CANCELLED' },
      });
      expect(result.status).toBe('CANCELLED');
    });
  });
});