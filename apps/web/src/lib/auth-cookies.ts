/**
 * Client-side auth cookie utilities.
 * Communicates with the server to set/remove HttpOnly session cookies.
 */

export const setAuthCookie = async (token: string): Promise<void> => {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    console.error('Failed to set secure auth cookie:', err);
  }
};

export const removeAuthCookie = async (): Promise<void> => {
  try {
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
  } catch (err) {
    console.error('Failed to remove secure auth cookie:', err);
  }
};