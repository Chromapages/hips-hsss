import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { commerceDb } from '@/lib/commerce-db'
import { rateLimit, rateLimitKey, RATE_LIMITS } from '@/lib/middleware/rate-limit'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  provider: z.enum(['email', 'google']).default('email'),
  website: z.string().optional(), // Honeypot field - bots may fill this
})

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let firebaseUid: string
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice(7))
    firebaseUid = decoded.uid
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Honeypot check - silent bot rejection
  if (parsed.data.website) {
    return NextResponse.json({ success: true, uid: firebaseUid }, { status: 201 })
  }

  // Rate limiting
  const rl = await rateLimit(rateLimitKey(req, 'register'), RATE_LIMITS.register)
  if (rl !== 'ok') {
    return rl
  }

  try {
    await commerceDb.user.upsert({
      where: { firebaseUid },
      update: {},
      create: {
        firebaseUid,
      },
    })
  } catch (err) {
    console.error('[users/register] Commerce DB error:', err)
    return NextResponse.json({ error: 'Failed to provision user record' }, { status: 500 })
  }

  return NextResponse.json({ success: true, uid: firebaseUid }, { status: 201 })
}
