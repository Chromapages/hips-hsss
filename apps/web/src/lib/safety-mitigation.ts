/**
 * Safety mitigation caller — Layer 2 wire-up.
 *
 * Replaces the prior pattern of `Authorization: Bearer ${SESSION_SERVICE_SECRET}`
 * (raw shared secret) with a properly scoped service JWT.
 *
 * The receiver (safety service) MUST validate the JWT using its own
 * ServiceAuthGuard (see services/safety/src/safety/service-auth.guard.ts).
 * The legacy raw-secret check in /api/safety/mitigate/route.ts has been
 * removed — it was inconsistent with the rest of the platform and made
 * the secret eligible for use as a generic API key.
 */

import 'server-only';
import { createServiceToken, SCOPES, AUDIENCES } from '@/lib/auth/serviceToken';

export type SafetyMitigationPayload = {
  alertId?: string | undefined;
  action: 'SIGNAL_ONLY' | 'KICK' | 'MUTE' | 'ESCALATE';
  success: boolean;
  metadata?: Record<string, unknown> | undefined;
};

const SAFETY_SERVICE_URL = process.env.SAFETY_SERVICE_URL || 'http://localhost:3003';

/**
 * Issue a scoped JWT and POST a mitigation record to the safety service.
 * Throws on any non-2xx response; the caller (route handler) catches and
 * logs the failure.
 */
export async function sendSafetyMitigation(
  ref: string,
  payload: SafetyMitigationPayload,
): Promise<unknown> {
  const token = await createServiceToken([SCOPES.SAFETY_MITIGATE], AUDIENCES.SAFETY, {
    subject: 'hips-web',
    ref,
  });

  const response = await fetch(`${SAFETY_SERVICE_URL}/safety/mitigations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Safety service mitigation error: ${response.status}`);
  }

  return response.json();
}
