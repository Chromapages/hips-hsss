/**
 * Standardized API error response helper
 * Ensures consistent error structure across all API endpoints
 */
export function apiError(message: string, code?: string, details?: unknown) {
  return {
    error: message,
    ...(code && { code }),
    ...(typeof details === 'object' && details !== null ? { details } : {})
  };
}