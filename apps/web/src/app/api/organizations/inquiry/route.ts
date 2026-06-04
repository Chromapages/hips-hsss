import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Commerce } from '@hips/db';
import { prisma } from '@/lib/prisma';

const inquirySchema = z
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
    }

    const inquiry = await prisma.orgInquiry.create({
      data: {
        orgName: result.data.orgName,
        contactName: result.data.contactName,
        email: result.data.email,
        isNonprofit: result.data.isNonprofit,
        ein: result.data.ein ?? null,
        eventType: result.data.eventType,
        headcount: result.data.headcount,
        preferredStart: result.data.preferredStart,
        preferredEnd: result.data.preferredEnd,
        message: result.data.message ?? null,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
    });
  } catch (error: unknown) {
    if (error instanceof Commerce.Prisma.PrismaClientKnownRequestError) {
      console.error('Org Inquiry Prisma Error:', error.code, error.message);
    } else {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      console.error('Org Inquiry Error:', message);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
