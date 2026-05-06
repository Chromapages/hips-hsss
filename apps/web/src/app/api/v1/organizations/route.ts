import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import { OrgInquirySchema, makeResponse, makeError, ErrorCodes } from '@hips/types'
import { rateLimit, rateLimitKey, RATE_LIMITS } from '@/lib/middleware/rate-limit'
import { sendEmail } from '@hips/email'
import { orgInquiryReceivedEmail } from '@hips/email/templates'

export async function POST(req: NextRequest) {
  const requestId = uuidv4()

  const rl = rateLimit(rateLimitKey(req, 'orgInquiry'), RATE_LIMITS.orgInquiry)
  if (rl !== 'ok') return rl

  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid JSON body', requestId), { status: 400 })
    }

    const parsed = OrgInquirySchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.issues[0]
        ? `${parsed.error.issues[0].path.join('.')}: ${parsed.error.issues[0].message}`
        : 'Validation failed'
      return NextResponse.json(makeError(ErrorCodes.VALIDATION_ERROR, msg, requestId), { status: 400 })
    }

    const { orgName, contactEmail, ein, isNonprofit, eventType, preferredDate, headcount, notes } =
      parsed.data

    const inquiry = await commerceDb.orgInquiry.create({
      data: {
        orgName,
        contactEmail,
        ein: isNonprofit && ein ? ein : null,
        isNonprofit,
        eventType,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        headcount: headcount ?? null,
        notes: notes ?? null,
        status: 'NEW',
      },
    })

    const emailData = orgInquiryReceivedEmail({
      contactName: contactEmail.split('@')[0],
      orgName,
      eventType,
      inquiryId: inquiry.id,
    })

    await sendEmail({
      to: contactEmail,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    }).catch((err) => {
      console.error('[org/inquiry] failed to send confirmation email:', err)
    })

    return NextResponse.json(
      makeResponse({ inquiryId: inquiry.id, status: inquiry.status, submittedAt: inquiry.createdAt.toISOString() }, requestId),
      { status: 201 }
    )
  } catch (err) {
    console.error('[org/inquiry]', err)
    return NextResponse.json(makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId), { status: 500 })
  }
}
