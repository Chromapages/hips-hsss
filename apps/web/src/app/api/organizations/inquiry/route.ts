import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const inquirySchema = z.object({
  orgName: z.string().min(2).max(100),
  contactName: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
    }

    const { orgName, contactName, email, message } = result.data;

    const inquiry = await prisma.orgInquiry.create({
      data: {
        orgName,
        contactName,
        email,
        message: message ?? null,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Org Inquiry Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
