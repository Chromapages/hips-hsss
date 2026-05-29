import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { getStripeClient } from '../stripe.js';
import { Resend } from 'resend';
import {
  CreateDonationDto,
  CreateOrgInquiryDto,
  CreateSessionIntentDto,
  CreatePackageIntentDto,
  PurchasePackageDto,
} from '../dto/commerce.dto.js';

// Resend email client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hips-support.org';
const FROM_EMAIL = 'H.I.P.S. <notifications@hips-support.org>';

// Package definitions (mirrored from Next.js)
const PACKAGES = {
  SINGLE: { priceCents: 5000, credits: 1, name: 'Single Session' },
  ESSENTIAL: { priceCents: 22500, credits: 5, name: 'Essential Pack (5)' },
  SANCTUARY: { priceCents: 40000, credits: 10, name: 'Sanctuary Pack (10)' },
};

// DonationTier enum values
const DONATION_TIER_VALUES = ['SUPPORTER', 'BUILDER', 'SUSTAINER', 'CATALYST'] as const;

@Injectable()
export class CommerceService {
  constructor(private readonly prisma: PrismaService) {}

  // ========== DONATIONS ==========

  async createDonationIntent(userId: string | null, dto: CreateDonationDto) {
    const stripe = getStripeClient();
    const { tier, amountCents } = dto;

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

    return { clientSecret: paymentIntent.client_secret };
  }

  // ========== SESSION PAYMENT ==========

  async createSessionPaymentIntent(dto: CreateSessionIntentDto, firebaseUid: string) {
    const stripe = getStripeClient();
    const { sessionId } = dto;

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { service: true, user: true },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.user.firebaseUid !== firebaseUid) {
      throw new Error('Forbidden');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: session.service.priceCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        type: 'SESSION_PAYMENT',
        sessionId,
        userId: firebaseUid,
        serviceId: session.serviceId,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  // ========== PACKAGE PURCHASE ==========

  async createPackageIntent(firebaseUid: string, dto: CreatePackageIntentDto) {
    const stripe = getStripeClient();
    const { packageId } = dto;
    const pkg = PACKAGES[packageId as keyof typeof PACKAGES];

    if (!pkg) {
      throw new Error('Invalid package selection');
    }

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

    return {
      clientSecret: paymentIntent.client_secret,
      packageName: pkg.name,
      amount: pkg.priceCents / 100,
    };
  }

  async purchasePackage(firebaseUid: string, dto: PurchasePackageDto) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      throw new Error('User profile not found');
    }

    const pkg = await this.prisma.package.create({
      data: {
        userId: user.id,
        serviceId: dto.serviceId,
        totalSessions: dto.totalSessions,
        usedSessions: 0,
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
      },
      include: { service: true },
    });

    return {
      id: pkg.id,
      service: pkg.service.name,
      totalSessions: pkg.totalSessions,
      usedSessions: pkg.usedSessions,
      expiresAt: pkg.expiresAt,
    };
  }

  // ========== DONATION RECORDING (from webhook) ==========

  async recordDonation(
    amountCents: number,
    tier: string,
    stripePaymentId: string,
    userId: string | null,
  ) {
    const validTier = DONATION_TIER_VALUES.includes(tier as typeof DONATION_TIER_VALUES[number])
      ? tier as typeof DONATION_TIER_VALUES[number]
      : 'SUPPORTER';

    return this.prisma.donation.create({
      data: {
        amountCents,
        tier: validTier,
        stripePaymentId,
        userId: userId || null,
      },
    });
  }

  // ========== PACKAGE FULFILLMENT (from webhook) ==========

  private async getOrCreateGenericPackageService(): Promise<string> {
    const SERVICE_SLUG = 'generic-session-package';

    // Try to find existing service
    let service = await this.prisma.service.findUnique({
      where: { slug: SERVICE_SLUG },
    });

    if (!service) {
      // Create a generic session package service
      service = await this.prisma.service.create({
        data: {
          slug: SERVICE_SLUG,
          name: 'Generic Session Package',
          category: 'INDIVIDUAL_SUPPORT',
          priceCents: 0, // No direct price - sold via packages
          scholarshipMinCents: 0,
          scholarshipMaxCents: 0,
          active: true,
        },
      });
      console.log(`[Commerce] Created generic package service: ${service.id}`);
    }

    return service.id;
  }

  async fulfillPackagePurchase(
    userId: string,
    credits: number,
    packageName: string,
    stripePaymentId: string,
  ) {
    // Resolve the service ID for package fulfillment
    const serviceId = await this.getOrCreateGenericPackageService();

    // Create a generic package entry for the user
    // In a real system, this would be more sophisticated based on service
    return this.prisma.package.create({
      data: {
        userId,
        serviceId,
        totalSessions: credits,
        usedSessions: 0,
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // ========== SESSION PAYMENT FULFILLMENT (from webhook) ==========

  async fulfillSessionPayment(sessionId: string, stripePaymentId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        stripePaymentId,
        status: 'SCHEDULED',
      },
    });
  }

  async cancelSessionPayment(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  // ========== ORG INQUIRIES ==========

  async createOrgInquiry(dto: CreateOrgInquiryDto) {
    const inquiry = await this.prisma.orgInquiry.create({
      data: {
        orgName: dto.orgName,
        contactName: dto.contactName,
        email: dto.email,
        message: dto.message ?? null,
        status: 'NEW',
      },
    });

    // Send admin notification email
    try {
      if (resend) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `New Org Inquiry: ${dto.orgName}`,
          html: `
            <h2>New Organization Inquiry</h2>
            <p><strong>Organization:</strong> ${dto.orgName}</p>
            <p><strong>Contact:</strong> ${dto.contactName}</p>
            <p><strong>Email:</strong> <a href="mailto:${dto.email}">${dto.email}</a></p>
            <p><strong>Message:</strong></p>
            <p>${dto.message || 'No message provided'}</p>
            <hr>
            <p><em>This inquiry was submitted via the HIPS platform.</em></p>
          `,
        });
        console.log(`[Commerce] Admin notification sent for org inquiry ${inquiry.id}`);
      } else {
        console.log(`[Commerce] Would send admin email for org inquiry ${inquiry.id}: ${dto.orgName} - ${dto.email}`);
      }
    } catch (emailErr) {
      console.error(`[Commerce] Failed to send admin notification for org inquiry ${inquiry.id}:`, emailErr);
      // Don't fail the inquiry creation if email fails
      return { success: true, inquiryId: inquiry.id, emailSent: false };
    }

    return { success: true, inquiryId: inquiry.id, emailSent: true };
  }

  // ========== USER LOOKUPS ==========

  async getUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  // ========== READ OPERATIONS ==========

  async getDonationsByUser(userId: string) {
    return this.prisma.donation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPackagesByUser(userId: string) {
    return this.prisma.package.findMany({
      where: { userId },
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrgInquiries(status?: string) {
    const where = status ? { status: status as any } : {};
    return this.prisma.orgInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}