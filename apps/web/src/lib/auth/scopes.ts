/**
 * Service-token scope registry — Layer 2 (Scoped JWTs).
 *
 * Every service-to-service JWT issued by the platform must carry a scope from
 * this registry. The receiving service validates the scope against its
 * declared requirements. No service should ever receive a token with a
 * scope it does not need — least privilege.
 *
 * Naming convention: `<service>:<action>`.
 */

export const SCOPES = {
  // Safety service scopes
  SAFETY_REPORT: 'safety:report',
  SAFETY_MITIGATE: 'safety:mitigate',
  SAFETY_CRITERIA_READ: 'safety:criteria:read',

  // Session service scopes
  SESSION_MANAGE: 'session:manage',
  SESSION_PARTICIPANT_READ: 'session:participant:read',

  // Commerce service scopes
  BILLING_READ: 'billing:read',
  BILLING_WRITE: 'billing:write',
  PAYMENT_PROCESS: 'payment:process',
  PACKAGE_GRANT: 'package:grant',

  // Internal admin / cross-cutting
  INTERNAL_ADMIN: 'admin:internal',
  AUDIT_READ: 'audit:read',

  // Vault
  VAULT_ENCRYPT: 'vault:encrypt',
  VAULT_DECRYPT: 'vault:decrypt',
} as const;

export type Scope = (typeof SCOPES)[keyof typeof SCOPES];

/** Human-readable description for logs and audit trails. */
export const SCOPE_DESCRIPTIONS: Record<Scope, string> = {
  'safety:report': 'Report a safety event to the safety service',
  'safety:mitigate': 'Apply a mitigation action (kick, mute, escalate)',
  'safety:criteria:read': 'Read safety monitoring criteria',
  'session:manage': 'Create, update, or end a session',
  'session:participant:read': 'Read session participant records',
  'billing:read': 'Read billing and subscription state',
  'billing:write': 'Update billing and subscription state',
  'payment:process': 'Process a payment',
  'package:grant': 'Grant a session package to a user',
  'admin:internal': 'Cross-service admin operation',
  'audit:read': 'Read audit log entries',
  'vault:encrypt': 'Encrypt data via the vault service',
  'vault:decrypt': 'Decrypt data via the vault service',
};

/**
 * Check whether a given string is a known registered scope. Used to
 * reject tokens that carry arbitrary/malformed scope strings.
 */
export function isRegisteredScope(value: string): value is Scope {
  return (Object.values(SCOPES) as string[]).includes(value);
}

/**
 * Issuer names — fixed set of services that may issue scoped JWTs.
 * Receiving services must reject tokens from unknown issuers.
 */
export const ISSUERS = {
  WEB: 'hips-web',
  SESSION: 'hips-session',
  COMMERCE: 'hips-commerce',
  SAFETY: 'hips-safety',
  VAULT: 'hips-vault',
} as const;

export type Issuer = (typeof ISSUERS)[keyof typeof ISSUERS];

/** Audience names — services that may receive scoped JWTs. */
export const AUDIENCES = {
  WEB: 'hips-web',
  SESSION: 'hips-session',
  COMMERCE: 'hips-commerce',
  SAFETY: 'hips-safety',
  VAULT: 'hips-vault',
} as const;

export type Audience = (typeof AUDIENCES)[keyof typeof AUDIENCES];

/** Default token TTL for service tokens: 5 minutes (spec requirement). */
export const SERVICE_TOKEN_TTL_SECONDS = 5 * 60;
