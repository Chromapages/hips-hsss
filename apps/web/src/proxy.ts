import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyFirebaseIdToken } from './lib/auth-edge';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = 
    pathname.startsWith('/checkout') || 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/facilitator') ||
    pathname.startsWith('/session');

  if (isProtectedRoute) {
    // 1. Check Header (for API calls)
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // 2. Check Cookie (for Page Navigations)
    if (!token) {
      token = request.cookies.get('hips-auth-token')?.value || null;
    }

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    try {
      const payload = await verifyFirebaseIdToken(token);
      const role = (payload.role as string) || 'PARTICIPANT';

      // Role-based Guards
      if (pathname.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (pathname.startsWith('/facilitator') && !['ADMIN', 'FACILITATOR'].includes(role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware Auth Error:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      // Clear invalid cookie
      const response = NextResponse.redirect(url);
      response.cookies.delete('hips-auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    '/facilitator/:path*',
    '/session/:path*',
  ],
};
