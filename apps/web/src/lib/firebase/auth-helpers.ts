export function getFirebaseAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/cancelled-popup-request': 'Only one sign-in request allowed at a time.',
    'auth/credential-already-in-use': 'This credential is already linked to another account.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/invalid-phone-number': 'Please enter a valid phone number.',
    'auth/session-expired': 'Your session has expired. Please sign in again.',
  }
  return messages[code] ?? 'Something went wrong. Please try again.'
}