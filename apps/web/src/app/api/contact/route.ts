import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

const VALID_INQUIRY_TYPES = ['GENERAL', 'SUPPORT', 'PARTNERSHIP', 'PRESS', 'SECURITY', 'BILLING'] as const;
const VALID_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;

const contactSchema = z.object({
  submitterName: z.string().min(2).max(120),
  submitterEmail: z.string().email().max(200),
  inquiryType: z.enum(VALID_INQUIRY_TYPES).default('GENERAL'),
  priority: z.enum(VALID_PRIORITIES).default('NORMAL'),
  subject: z.string().min(3).max(200),
  body: z.string().min(10).max(5000),
  consent: z.literal(true),
});

/**
 * Default SLA windows (in hours) per priority.
 * Anything past `slaDueAt` is flagged as overdue in the admin queue.
 */
const SLA_HOURS: Record<(typeof VALID_PRIORITIES)[number], number> = {
  URGENT: 4,
  HIGH: 24,
  NORMAL: 72,
  LOW: 168,
};

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 submissions per 10 minutes per IP (basic abuse guard)
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
    const rateLimit = checkRateLimit(`contact:${ip}`, 5, 10 * 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please slow down and try again later.' },
        { status: 429, headers: getRateLimitHeaders(rateLimit.resetAt, 0, 5) }
      );
    }

    const json = await req.json().catch(() => null);
    const result = contactSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Inquiries are temporarily unavailable. Please email info@hips-support.org directly.' },
        { status: 503 }
      );
    }

    const now = new Date();
    const slaHours = SLA_HOURS[result.data.priority];
    const slaDueAt = new Date(now.getTime() + slaHours * 60 * 60_000);

    const docRef = await db.collection('contact_inquiries').add({
      submitterName: result.data.submitterName,
      submitterEmail: result.data.submitterEmail,
      inquiryType: result.data.inquiryType,
      priority: result.data.priority,
      subject: result.data.subject,
      body: result.data.body,
      status: 'NEW',
      assigneeId: null,
      resolvedAt: null,
      resolvedById: null,
      slaDueAt: slaDueAt.toISOString(),
      slaHours,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      source: 'web-contact-form',
    });

    // Best-effort notification: log to the audit channel so admins can pick up
    // the inquiry quickly. Real-time notifications (email/Slack) would be
    // wired up through an alerting service in production.
    try {
      await db.collection('admin_notifications').add({
        kind: 'CONTACT_INQUIRY_NEW',
        inquiryId: docRef.id,
        priority: result.data.priority,
        inquiryType: result.data.inquiryType,
        slaDueAt: slaDueAt.toISOString(),
        createdAt: now.toISOString(),
        readBy: [],
      });
    } catch {
      // Non-fatal: notification failure must not break the submission path.
    }

    return NextResponse.json({
      success: true,
      inquiryId: docRef.id,
      slaDueAt: slaDueAt.toISOString(),
      message: 'Your inquiry has been received. A team member will follow up within the priority SLA.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[ContactForm] Error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
