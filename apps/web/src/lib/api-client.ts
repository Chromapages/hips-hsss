/**
 * Authenticated fetch wrapper — automatically attaches Firebase ID token
 * as a Bearer token for all /api/v1/* requests.
 *
 * Usage:
 *   import { authFetch } from '@/lib/api-client'
 *   const data = await authFetch('/api/v1/sessions/book', { method: 'POST', body: ... })
 */

import { getAuth } from '@/lib/firebase/client'

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const user = getAuth().currentUser
  const token = user ? await user.getIdToken() : null

  const headers = new Headers(init.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  // Always set Content-Type for JSON APIs
  if (input.toString().startsWith('/api/') && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(input, { ...init, headers })
}

// ─── Per-request token refresh ─────────────────────────────────────────────────

/**
 * Like authFetch but refreshes the token first, ensuring a valid session
 * even for requests made shortly after sign-in.
 */
export async function authFetchWithRefresh(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const user = getAuth().currentUser
  if (user) {
    await user.getIdToken(true) // force refresh
  }
  return authFetch(input, init)
}