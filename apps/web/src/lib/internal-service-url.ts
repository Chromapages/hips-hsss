import 'server-only';

export function getInternalServiceUrl(name: string, fallbackUrl: string) {
  const value = process.env[name];
  if (value) return value;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} environment variable is required in production`);
  }

  return fallbackUrl;
}
