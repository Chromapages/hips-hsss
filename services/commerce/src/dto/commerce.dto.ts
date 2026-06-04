import { z } from 'zod';

export const createDonationSchema = z.object({
  tier: z.enum(['SUPPORTER', 'BUILDER', 'SUSTAINER', 'CATALYST']),
  amountCents: z.number().int().positive(),
});

export type CreateDonationDto = z.infer<typeof createDonationSchema>;

export const createOrgInquirySchema = z
  .object({
    orgName: z.string().min(2).max(100),
    contactName: z.string().min(2).max(100),
    email: z.string().email(),
    isNonprofit: z.boolean().default(false),
    ein: z
      .string()
      .regex(/^\d{2}-\d{7}$/, 'EIN must follow format XX-XXXXXXX')
      .optional(),
    eventType: z.enum(['WORKSHOP', 'RECURRING', 'CONSULTANCY']),
    headcount: z.coerce.number().int().min(1).max(500),
    preferredStart: z.coerce.date(),
    preferredEnd: z.coerce.date(),
    message: z.string().max(2000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isNonprofit && !data.ein) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ein'],
        message: 'EIN is required for nonprofits',
      });
    }
    if (data.preferredEnd < data.preferredStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['preferredEnd'],
        message: 'End date must be on or after the start date',
      });
    }
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