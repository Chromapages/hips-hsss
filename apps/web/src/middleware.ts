import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'

export const runtime = 'nodejs'

const publicPaths = [
  '/api/v1/auth/',
  '/api/v1/checkout/donation',
  '/api/v1/organizations',
  '/api/v1/public/',
  '/api/v1/services',
  '/api/v1/webhooks/',
  '/_next/',
  '/favicon.ico',
  '/health',
]

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((p) => pathname.startsWith(p))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const idToken = authHeader.slice(7)

  try {
    const decoded = await adminAuth.verifyIdToken(idToken)

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-firebase-uid', decoded.uid)
    requestHeaders.set('x-firebase-email', decoded.email ?? '')

    return NextResponse.next({ request: { headers: requestHeaders } })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

export const config = {
  matcher: ['/api/v1/:path*'],
}
