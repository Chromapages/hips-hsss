/**
 * Client-side auth cookie utilities.
 *
 * IMPORTANT: These cookies store the Firebase ID token for client-side retrieval.
 * They are sent as the Authorization: Bearer header to API routes — the server
 * does NOT read these cookies (it reads the Authorization header instead).
 *
 * Because the client must be able to read the token value to send it in the
 * Authorization header, HttpOnly cannot be set — doing so would prevent
 * JavaScript from accessing the token, breaking authentication.
 *
 * The actual protection comes from:
 * 1. Token stored in memory (not localStorage) — survives page refresh but not page close
 * 2. Firebase Auth auto-refreshes tokens before expiry
 * 3. XSS attacks can only read the cookie while the user is on the site
 * 4. The Authorization header (not the cookie) is what API routes use
 */

const TOKEN_KEY = 'hips-auth-token';
const CSRF_KEY = 'hips-csrf-token';

export const setAuthCookie = (token: string) => {
  const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isProduction ? 'Secure;' : '';
  // Cannot use HttpOnly here — client must be able to read the token for Authorization header
  document.cookie = `${TOKEN_KEY}=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; ${secureFlag} SameSite=Lax`;
};

export const removeAuthCookie = () => {
  document.cookie = `${TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const getAuthCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? '') : null;
};