import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/firebase-auth';
import { sendEmail } from '@/lib/email';

const employmentStatusEnum = z.enum(['employed', 'unemployed', 'student', 'disabled']);
const serviceTypeEnum = z.enum(['peer-support', 'group-coaching', 'care-navigation']);

const submissionSchema = z.object({
  requestedCents: z.number().int().positive().max(1_000_000),
  employmentStatus: employmentStatusEnum,
  incomeRange: z.string().min(1).max(50),
  serviceType: serviceTypeEnum,
  personalStatement: z.string().min(50).max(500),
  referralSource: z.string().min(1).max(200),
  consentAcknowledged: z.literal(true),
});

const draftSchema = z.object({
  draft: z.literal(true),
  employmentStatus: employmentStatusEnum.optional(),
  incomeRange: z.string().max(50).optional(),
  serviceType: serviceTypeEnum.optional(),
  personalStatement: z.string().max(500).optional(),
  referralSource: z.string().max(200).optional(),
});

const applySchema = z.union([submissionSchema, draftSchema]);

const SCHOLARSHIP_DEADLINE = process.env.SCHOLARSHIP_DEADLINE_ISO
  ? new Date(process.env.SCHOLARSHIP_DEADLINE_ISO)
  : null;

function isPastDeadline(now: Date = new Date()): boolean {
  return SCHOLARSHIP_DEADLINE !== null && now > SCHOLARSHIP_DEADLINE;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyFirebaseIdToken(token);
    const firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;
    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = applySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { firebaseUid } });
    if (!user) {
      return NextResponse.json({ error: 'User profile not synchronized' }, { status: 404 });
    }

    // Draft path: persist a PENDING application with the partial fields so the
    // applicant can resume. We use a separate "draft" sentinel stored in the
    // `note` field for the in-place Prisma model; richer drafts are out of
    // scope for the current schema.
    if ('draft' in result.data && result.data.draft) {
      const draftSnapshot = JSON.stringify({
        employmentStatus: result.data.employmentStatus ?? null,
        incomeRange: result.data.incomeRange ?? null,
        serviceType: result.data.serviceType ?? null,
        personalStatement: result.data.personalStatement ?? null,
        referralSource: result.data.referralSource ?? null,
        savedAt: new Date().toISOString(),
      });
      const scholarship = await prisma.scholarship.create({
        data: {
          userId: user.id,
          requestedCents: 0,
          note: `__DRAFT__:${draftSnapshot}`,
          status: 'PENDING',
        },
      });
      return NextResponse.json({
        success: true,
        scholarship: { id: scholarship.id, status: 'DRAFT' },
      });
    }

    if (isPastDeadline()) {
      return NextResponse.json(
        {
          error: 'Applications are closed',
          code: 'DEADLINE_PASSED',
          deadline: SCHOLARSHIP_DEADLINE?.toISOString(),
        },
        { status: 410 }
      );
    }

    // Prevent duplicate submissions: a single user may have at most one
    // active (non-denied) scholarship. Approved/denied applications do not
    // block resubmission.
    const existingActive = await prisma.scholarship.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING',
        NOT: { note: { startsWith: '__DRAFT__:' } },
      },
      select: { id: true, status: true, createdAt: true },
    });
    if (existingActive) {
      return NextResponse.json(
        {
          error: 'You already have an active scholarship application',
          code: 'DUPLICATE_APPLICATION',
          existingId: existingActive.id,
        },
        { status: 409 }
      );
    }

    const data = result.data as z.infer<typeof submissionSchema>;
    const serviceLabel = {
      'peer-support': '1:1 Peer Support',
      'group-coaching': 'Group Coaching',
      'care-navigation': 'Care Navigation',
    }[data.serviceType];

    const compositeNote = [
      `[Employment: ${data.employmentStatus}]`,
      `[Income: ${data.incomeRange}]`,
      `[Service: ${serviceLabel}]`,
      `[Referral: ${data.referralSource}]`,
      `[Consent: ${data.consentAcknowledged ? 'YES' : 'NO'}]`,
      ``,
      `Statement:`,
      data.personalStatement,
    ].join('\n');

    const scholarship = await prisma.scholarship.create({
      data: {
        userId: user.id,
        requestedCents: data.requestedCents,
        note: compositeNote,
        status: 'PENDING',
      },
    });

    // Fire-and-forget confirmation email
    sendEmail({
      to: user.email,
      subject: 'We received your scholarship application',
      html: `
        <h1>Application received</h1>
        <p>Hello,</p>
        <p>Thank you for applying for access support. Your application has been received and is pending review. You will receive a decision within 48 hours via your secure dashboard.</p>
        <p>Requested amount: <strong>$${(data.requestedCents / 100).toFixed(2)}</strong></p>
        <p>Service: <strong>${serviceLabel}</strong></p>
        <p>Application ID: <code>${scholarship.id}</code></p>
        <p>— H.I.P.S. Team</p>
      `,
    }).catch((err) => {
      console.error('Scholarship confirmation email failed:', err);
    });

    return NextResponse.json({
      success: true,
      scholarship: {
        id: scholarship.id,
        status: scholarship.status,
        requestedCents: scholarship.requestedCents,
        submittedAt: scholarship.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error('Scholarship application failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Public: returns the current application deadline so the client can
    // show a clear "Applications closed" state without a silent failure.
    if (isPastDeadline()) {
      return NextResponse.json({
        accepting: false,
        deadline: SCHOLARSHIP_DEADLINE?.toISOString() ?? null,
        message: 'Applications are currently closed. Please check back next cycle.',
      });
    }
    return NextResponse.json({
      accepting: true,
      deadline: SCHOLARSHIP_DEADLINE?.toISOString() ?? null,
    });
  } catch (error: unknown) {
    console.error('Scholarship status check failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ accepting: true, deadline: null });
  }
}
