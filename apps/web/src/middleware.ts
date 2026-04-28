import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected commerce routes (e.g. /shop/checkout, /admin)
  if (pathname.startsWith('/shop/checkout') || pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Note: We can't use firebase-admin in Edge Middleware easily.
    // For local dev/MVP, we'll assume validation happens in the API route or Server Component
    // but in production, we'd use a lightweight JWT verification or Firebase Edge SDK.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/shop/checkout/:path*', '/admin/:path*'],
};
