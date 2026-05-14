import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { commerceDb } from '@/lib/commerce-db'

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

const adminPaths = ['/admin']
const sessionCookieName = '__session'

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((p) => pathname.startsWith(p))
}

function isAdminPath(pathname: string): boolean {
  return adminPaths.some((p) => pathname.startsWith(p))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Admin routes need server-side auth check
  if (isAdminPath(pathname)) {
    const sessionCookie = request.cookies.get(sessionCookieName)?.value
    if (!sessionCookie) {
      return new NextResponse(null, { status: 404 })
    }

    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)

      // Check if user has ADMIN role in database
      const dbUser = await commerceDb.user.findUnique({
        where: { firebaseUid: decoded.uid },
        select: { role: true },
      })

      if (!dbUser || dbUser.role !== 'ADMIN') {
        return new NextResponse(null, { status: 404 })
      }

      // User is admin - set headers and continue
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-firebase-uid', decoded.uid)
      requestHeaders.set('x-firebase-email', decoded.email ?? '')
      requestHeaders.set('x-user-role', dbUser.role)

      return NextResponse.next({ request: { headers: requestHeaders } })
    } catch {
      return new NextResponse(null, { status: 404 })
    }
  }

  // API routes - require auth token
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
  matcher: ['/admin/:path*', '/api/v1/:path*'],
}
