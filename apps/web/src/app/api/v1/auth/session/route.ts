import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'

const SESSION_COOKIE_NAME = '__session'
const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sessionCookie = await adminAuth.createSessionCookie(authHeader.slice(7), {
      expiresIn: SESSION_MAX_AGE_MS,
    })
    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_MS / 1000,
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
