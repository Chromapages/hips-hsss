const SAFE_REDIRECT_PATTERN = /^\/(?!\/)[^\s]*$/;

/**
 * Validates that a redirect URL is a safe, internal path.
 * Must start with a single slash, not have a protocol, and not start with double slashes.
 */
export const isSafeInternalRedirect = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return SAFE_REDIRECT_PATTERN.test(url) && !url.startsWith('//') && !url.includes(':');
};

/**
 * Returns the provided redirect URL if it is a safe internal path,
 * otherwise returns the fallback path.
 */
export const getSafeRedirect = (from: string | null | undefined, fallback: string): string => {
  if (from && isSafeInternalRedirect(from)) return from;
  return fallback;
};
