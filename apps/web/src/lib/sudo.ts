/**
 * Sudo mode — Layer 4 (MFA re-auth for destructive actions).
 *
 * Sudo is a 15-minute window of elevated trust, established by re-verifying
 * MFA. It's required for destructive admin actions:
 *  - User deletion
 *  - Bulk operations
 *  - Role promotion to admin (super-admin only)
 *  - System config changes
 *  - Maintenance mode toggle
 *
 * The sudo token is a signed JWT cookie (`sudo_token`) with a short TTL.
 * The token proves the caller recently passed MFA, but does NOT itself
 * grant any additional authority — the caller's role check (in
 * requireRole) still has to pass.
 */

import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { requireSecret } from '@/lib/secrets';

const SUDO_COOKIE = 'sudo_token';
const SUDO_TTL_SECONDS = 15 * 60;

function getSudoSecret(): Uint8Array {
  const secret = requireSecret('SUDO_TOKEN_SECRET', {
    minLength: 32,
    description: 'Used to sign sudo tokens (elevated MFA trust)',
  });
  return new TextEncoder().encode(secret);
}

export type SudoClaims = {
  userId: string;
  role: string;
  iat: number;
  exp: number;
};

/**
 * Issue a new sudo token and set it as an HttpOnly cookie. Caller is
 * responsible for having just verified MFA (e.g. via /api/auth/mfa/challenge).
 */
export async function issueSudoToken(opts: { userId: string; role: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + SUDO_TTL_SECONDS;
  const token = await new SignJWT({ role: opts.role })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(opts.userId)
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(getSudoSecret());

  // Set the cookie on the response. The caller is expected to be in a
  // route handler that returns NextResponse, so we use cookies() from
  // next/headers for the App Router.
  try {
    const store = await cookies();
    store.set({
      name: SUDO_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SUDO_TTL_SECONDS,
    });
  } catch {
    // cookies() is only available in route handlers / server components.
    // If we're in a context without it, the caller must set the cookie
    // itself on its response.
  }

  return token;
}

export async function clearSudoToken(): Promise<void> {
  try {
    const store = await cookies();
    store.set({
      name: SUDO_COOKIE,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  } catch {
    // No-op if cookies() is unavailable.
  }
}

/**
 * Verify a sudo token from a request. Returns the claims on success,
 * null on any failure (expired, missing, invalid signature).
 */
export async function verifySudoToken(req: NextRequest): Promise<SudoClaims | null> {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SUDO_COOKIE}=([^;]+)`));
  const token = match ? decodeURIComponent(match[1]!) : null;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSudoSecret(), { clockTolerance: 5 });
    return {
      userId: payload.sub ?? '',
      role: (payload as { role?: string }).role ?? '',
      iat: payload.iat ?? 0,
      exp: payload.exp ?? 0,
    };
  } catch {
    return null;
  }
}

/**
 * Standard 403 response for actions that require sudo mode.
 * The client should prompt the user to re-verify MFA, then retry.
 */
export function sudoRequiredResponse(): NextResponse {
  return NextResponse.json(
    { error: 'sudo_required', detail: 'Re-verify MFA to perform this action.' },
    { status: 403 },
  );
}
