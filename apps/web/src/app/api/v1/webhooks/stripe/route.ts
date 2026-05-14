import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@hips/billing'
import { commerceDb as prisma } from '@/lib/commerce-db'
import { sendEmail } from '@hips/email'
import {
  bookingConfirmationEmail,
  packagePurchaseEmail,
  donationReceiptEmail,
} from '@hips/email/templates'
import Stripe from 'stripe'

const EIN = process.env.HIPS_EIN ?? '83-0000000'
const ORG_NAME = 'Hiding in Plain Sight Foundation'
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? ''

function getHeader(req: NextRequest, key: string): string | null {
  return req.headers.get(key)
}

export async function POST(req: NextRequest) {
  const signature = getHeader(req, 'stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe-Signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = constructWebhookEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const existing = await prisma.stripeEvent.findUnique({
      where: { stripeEventId: event.id },
    })

    if (existing?.processed) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    if (!existing) {
      await prisma.stripeEvent.create({
        data: {
          stripeEventId: event.id,
          eventType: event.type,
          payload: JSON.parse(rawBody),
          processed: false,
        },
      })
    }

    try {
      await handleEvent(event)
      await prisma.stripeEvent.update({
        where: { stripeEventId: event.id },
        data: { processed: true, processedAt: new Date() },
      })
    } catch (err) {
      // Log but don't mark as processed — allows retry
      console.error('Webhook handling failed:', err)
      throw err // Re-throw to return 500
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
      break
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break
    case 'invoice.paid':
      await handleInvoicePaid(event.data.object as Stripe.Invoice)
      break
  }
}

async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent): Promise<void> {
  const metadata = pi.metadata
  const type = metadata.type

  if (type === 'SERVICE_PURCHASE') {
    const sessionId = metadata.sessionId
    if (!sessionId) return

    const existing = await prisma.session.findUnique({ where: { stripePaymentId: pi.id } })
    if (existing) return // Idempotency guard

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'CONFIRMED',
        stripePaymentId: pi.id,
        pricePaid: pi.amount / 100,
        confirmationEmailSent: true,
      },
      include: { service: true },
    })

    if (session && pi.receipt_email) {
      const email = bookingConfirmationEmail({
        participantName: 'Participant',
        serviceName: session.service.name,
        scheduledAt: session.scheduledAt.toISOString(),
        facilitatorName: 'Your Facilitator',
        sessionLink: session.service.category === 'CARE_SESSION' || session.service.category === 'COACHING'
          ? `${NEXT_PUBLIC_APP_URL}/session/${session.id}`
          : undefined,
      })
      await sendEmail({
        to: pi.receipt_email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }).catch((err: unknown) => console.error('Failed to send booking confirmation:', err))
    }
  } else if (type === 'PACKAGE_PURCHASE') {
    const existing = await prisma.package.findUnique({ where: { stripePaymentId: pi.id } })
    if (existing) return

    const serviceId = metadata.serviceId
    const userId = metadata.userId
    if (!serviceId || !userId) return
    const totalSessions = metadata.totalSessions === '8' ? 8 : 4
    const pricePaid = pi.amount / 100
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 90)

    const pkg = await prisma.package.create({
      data: {
        userId,
        serviceId,
        totalSessions,
        expiresAt,
        pricePaid,
        stripePaymentId: pi.id,
        isScholarship: metadata.isScholarship === 'true',
        discountCode: metadata.discountCode ?? null,
      },
      include: { service: true },
    })

    if (metadata.discountCode) {
      await prisma.scholarship.updateMany({
        where: {
          discountCode: metadata.discountCode,
          userId,
          serviceId,
          status: 'APPROVED',
        },
        data: { status: 'EXPIRED' },
      })
    }

    if (pkg.service && pi.receipt_email) {
      const email = packagePurchaseEmail({
        participantName: 'Participant',
        serviceName: pkg.service.name,
        totalSessions,
        pricePaid,
        expiresAt: expiresAt.toISOString(),
      })
      await sendEmail({
        to: pi.receipt_email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }).catch((err: unknown) => console.error('Failed to send package email:', err))
    }
  } else if (type === 'DONATION') {
    const existing = await prisma.donation.findUnique({ where: { stripePaymentId: pi.id } })
    if (existing) return

    const tier = metadata.tier ?? 'CUSTOM'
    const userId = metadata.userId ?? null
    const emailAddr = pi.receipt_email ?? metadata.email ?? ''

    const donation = await prisma.donation.create({
      data: {
        userId,
        amount: pi.amount / 100,
        tier: tier as 'SPONSOR_SESSION' | 'RESTORE_SESSION' | 'RESTORE_LEADER' | 'CUSTOM',
        stripePaymentId: pi.id,
        receiptSent: false,
      },
    })

    const receiptEmail = donationReceiptEmail({
      donorEmail: emailAddr,
      amount: pi.amount,
      tier,
      donationDate: new Date().toISOString(),
      ein: EIN,
      orgName: ORG_NAME,
    })
    await sendEmail({
      to: emailAddr,
      subject: receiptEmail.subject,
      html: receiptEmail.html,
      text: receiptEmail.text,
    }).catch((err: unknown) => console.error('Failed to send donation receipt:', err))

    await prisma.donation.update({
      where: { id: donation.id },
      data: { receiptSent: true },
    }).catch((err: unknown) => console.error('Failed to update receiptSent flag:', err))
  } else if (type === 'ORG_DEPOSIT') {
    const inquiryId = metadata.inquiryId
    if (!inquiryId) return

    await prisma.orgInquiry.update({
      where: { id: inquiryId },
      data: {
        status: 'DEPOSIT_PAID',
      },
    }).catch((err: unknown) => console.error('Failed to update org inquiry status:', err))
  }
}

async function handlePaymentIntentFailed(pi: Stripe.PaymentIntent): Promise<void> {
  const metadata = pi.metadata
  if (metadata.type === 'SERVICE_PURCHASE') {
    const sessionId = metadata.sessionId
    const user = await prisma.user.findUnique({
      where: { firebaseUid: metadata.userId },
    }).catch(() => null)
    if (!user || !pi.receipt_email) return

    await sendEmail({
      to: pi.receipt_email,
      subject: 'Payment Failed — H.I.P.S. Session',
      html: `<p>Your payment for session ${sessionId} failed. Please try again or contact support.`,
      text: `Your H.I.P.S. session payment failed. Session ID: ${sessionId}. Please retry.`,
    }).catch((err: unknown) => console.error('Failed to send payment failure email:', err))
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string
  console.log(`Subscription deleted for customer ${customerId}: ${subscription.id}`)
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string
  console.log(`Invoice paid for customer ${customerId}: ${invoice.id}`)
}
