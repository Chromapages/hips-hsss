import 'server-only';

import crypto from 'node:crypto';
import { SignJWT } from 'jose';

export const VOICE_WORKER_TOKEN_AUDIENCE = 'voice-worker';
export const VOICE_WORKER_TOKEN_ISSUER = 'hips-web';
export const VOICE_WORKER_STREAM_SCOPE = 'voice-worker:stream';
export const VOICE_WORKER_TOKEN_TTL_SECONDS = 5 * 60;

export type VoiceWorkerTokenClaims = {
  scope: typeof VOICE_WORKER_STREAM_SCOPE;
  sessionId: string;
  participantIdentity: string;
};

export function isVoiceWorkerJwtConfigured(): boolean {
  return Boolean(getVoiceWorkerJwtSecret());
}

export async function createVoiceWorkerStreamToken(options: {
  sessionId: string;
  participantIdentity: string;
  expiresInSeconds?: number;
  jti?: string;
}): Promise<{ token: string; expiresAt: string; jti: string }> {
  const secret = getVoiceWorkerJwtSecret();
  if (!secret) {
    throw new Error('Voice worker JWT signing secret is not configured.');
  }

  const sessionId = sanitizeTokenClaim(options.sessionId, 'sessionId');
  const participantIdentity = sanitizeTokenClaim(options.participantIdentity, 'participantIdentity');
  const ttl = Math.min(
    Math.max(1, options.expiresInSeconds ?? VOICE_WORKER_TOKEN_TTL_SECONDS),
    VOICE_WORKER_TOKEN_TTL_SECONDS,
  );
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + ttl;
  const jti = options.jti ?? crypto.randomUUID();

  const token = await new SignJWT({
    scope: VOICE_WORKER_STREAM_SCOPE,
    sessionId,
    participantIdentity,
  } satisfies VoiceWorkerTokenClaims)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(VOICE_WORKER_TOKEN_ISSUER)
    .setAudience(VOICE_WORKER_TOKEN_AUDIENCE)
    .setSubject(participantIdentity)
    .setJti(jti)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .sign(new TextEncoder().encode(secret));

  return {
    token,
    expiresAt: new Date(expiresAt * 1000).toISOString(),
    jti,
  };
}

function getVoiceWorkerJwtSecret(): string | null {
  return (
    process.env.VOICE_WORKER_JWT_SECRET?.trim() ||
    process.env.SERVICE_JWT_SECRET?.trim() ||
    process.env.VOICE_WORKER_SHARED_SECRET?.trim() ||
    null
  );
}

function sanitizeTokenClaim(value: string, name: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 160) {
    throw new Error(`${name} must be between 1 and 160 characters.`);
  }
  return trimmed;
}
