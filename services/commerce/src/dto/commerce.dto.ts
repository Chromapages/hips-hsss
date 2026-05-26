import { z } from 'zod';

export const createDonationSchema = z.object({
  tier: z.enum(['SUPPORTER', 'BUILDER', 'SUSTAINER', 'CATALYST']),
  amountCents: z.number().int().positive(),
});

export type CreateDonationDto = z.infer<typeof createDonationSchema>;

export const createOrgInquirySchema = z.object({
  orgName: z.string().min(2).max(100),
  contactName: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().max(2000).optional(),
});

export type CreateOrgInquiryDto = z.infer<typeof createOrgInquirySchema>;

export const createSessionIntentSchema = z.object({
  sessionId: z.string().uuid(),
});

export type CreateSessionIntentDto = z.infer<typeof createSessionIntentSchema>;

export const createPackageIntentSchema = z.object({
  packageId: z.enum(['SINGLE', 'ESSENTIAL', 'SANCTUARY']),
});

export type CreatePackageIntentDto = z.infer<typeof createPackageIntentSchema>;

export const purchasePackageSchema = z.object({
  serviceId: z.string().uuid(),
  totalSessions: z.number().int().min(1).max(20),
});

export type PurchasePackageDto = z.infer<typeof purchasePackageSchema>;