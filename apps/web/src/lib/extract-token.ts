/**
 * Extracts a bearer token from an Authorization header.
 *
 * @param authHeader - The Authorization header value (e.g., "Bearer <token>")
 * @returns The token string, or null if not present or malformed
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1] ?? null;
}