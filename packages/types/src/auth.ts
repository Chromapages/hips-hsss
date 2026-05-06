// Re-export UserRole from index (defined once to avoid conflicts)
export { UserRole } from './index'

import { UserRole } from './index'

/**
 * Firebase user enriched with custom claims.
 * role defaults to PARTICIPANT if no custom claim is set.
 */
export interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: UserRole
  emailVerified: boolean
}

export interface AuthState {
  user: FirebaseUser | null
  loading: boolean
  error: string | null
}

export type SignInFn = (email: string, password: string) => Promise<FirebaseUser>
export type SignUpFn = (email: string, password: string) => Promise<FirebaseUser>
export type SignOutFn = () => Promise<void>
