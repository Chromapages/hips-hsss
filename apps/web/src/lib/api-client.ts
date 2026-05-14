/**
 * Authenticated fetch wrapper — automatically attaches Firebase ID token
 * as a Bearer token for all /api/v1/* requests.
 *
 * Usage:
 *   import { authFetch } from '@/lib/api-client'
 *   const data = await authFetch('/api/v1/sessions/book', { method: 'POST', body: ... })
 */

import { getAuth } from '@/lib/firebase/client'
import { onAuthStateChanged } from 'firebase/auth'

/**
 * Safely gets a valid ID token, waiting for Firebase auth to initialize
 * if currentUser is not yet available.
 */
export async function getValidIdToken(): Promise<string | null> {
  const auth = getAuth()
  if (auth.currentUser) {
    return auth.currentUser.getIdToken()
  }
  // Wait for auth state to be determined
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe()
      resolve(user ? await user.getIdToken() : null)
    })
  })
}

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getValidIdToken()

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
  const auth = getAuth()
  if (auth.currentUser) {
    await auth.currentUser.getIdToken(true) // force refresh
  }
  return authFetch(input, init)
}