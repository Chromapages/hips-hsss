import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';
import { getPrisma } from '@/lib/prisma';
import { ADMIN_ROLES, type Role } from '@/lib/roles';

/**
 * POST /api/auth/session
 * Accepts a Firebase ID token and sets it as a secure, HttpOnly cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const isMock = typeof token === 'string' && token.startsWith('mock-token-');
    if (isMock) {
      return NextResponse.json({ error: 'Mock tokens cannot create privileged sessions' }, { status: 401 });
    }

    const auth = getAdminAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 503 });
    }
    let identity;
    try {
      identity = await auth.verifyIdToken(token, true);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let userRole: string | null = null;
    try {
      const dbUser = await getPrisma().user.findFirst({
        where: { firebaseUid: identity.uid, deletedAt: null },
        select: { role: true },
      });
      if (dbUser) {
        userRole = dbUser.role;
      }
    } catch (dbError) {
      const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
      const demoRoles: Record<string, string> = {
        'participant@hips.foundation': 'PARTICIPANT',
        'facilitator@hips.foundation': 'FACILITATOR',
        'admin@hips.foundation': 'ADMIN',
        'superadmin@hips.foundation': 'SUPER_ADMIN',
      };
      const emailKey = identity.email || '';
      if (isDemoMode) {
        userRole = demoRoles[emailKey] || 'PARTICIPANT';
      } else {
        throw dbError;
      }
    }

    if (!userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = (ADMIN_ROLES as readonly Role[]).includes(userRole as Role);
    const maxAge = isAdmin ? 60 * 60 * 4 : 60 * 60 * 24 * 7;
    const response = NextResponse.json({ success: true });

    response.cookies.set('__Host-hips-auth-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Clears the secure, HttpOnly hips-auth-token cookie.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('__Host-hips-auth-token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
