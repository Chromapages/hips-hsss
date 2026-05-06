import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth/get-auth-user'
import { z } from 'zod'

const registerSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  provider: z.enum(['email', 'google']).default('email'),
})

export async function POST(req: NextRequest) {
  const authResult = await getAuthUser(req)
  if (authResult instanceof Response) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { uid, email, displayName, provider } = parsed.data

  // Provision Commerce User record
  try {
    // @ts-ignore — Prisma client injected via global
    const { prisma } = await import('@/lib/prisma')
    await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: { displayName, provider },
      create: {
        firebaseUid: uid,
        displayName,
        provider,
        // email intentionally excluded — PII lives in Firebase Auth only
      },
    })
  } catch (err) {
    console.error('[users/register] Commerce DB error:', err)
    return NextResponse.json({ error: 'Failed to provision user record' }, { status: 500 })
  }

  return NextResponse.json({ success: true, uid }, { status: 201 })
}