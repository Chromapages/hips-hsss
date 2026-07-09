import { jwtVerify, errors as joseErrors } from 'jose';

export const VOICE_WORKER_TOKEN_AUDIENCE = 'voice-worker';
export const VOICE_WORKER_TOKEN_ISSUER = 'hips-web';
export const VOICE_WORKER_STREAM_SCOPE = 'voice-worker:stream';

export type VoiceWorkerAuthResult =
  | {
      ok: true;
      mode: 'jwt' | 'legacy-token' | 'open';
      sessionId?: string;
      participantIdentity?: string;
      jti?: string;
    }
  | {
      ok: false;
      reason:
        | 'missing_token'
        | 'invalid'
        | 'expired'
        | 'wrong_scope'
        | 'wrong_session'
        | 'wrong_participant';
    };

export type VoiceWorkerAuthConfig = {
  jwtSecret: string;
  sharedSecret: string;
  browserToken: string;
};

type RawClaims = {
  scope?: unknown;
  sessionId?: unknown;
  participantIdentity?: unknown;
  jti?: unknown;
};

export async function authorizeVoiceWorkerUrl(
  url: string | undefined,
  config: VoiceWorkerAuthConfig,
): Promise<VoiceWorkerAuthResult> {
  if (!config.jwtSecret && !config.sharedSecret && !config.browserToken) {
    return { ok: true, mode: 'open' };
  }
  if (!url) return { ok: false, reason: 'missing_token' };

  let token: string | null = null;
  let sessionId: string | null = null;
  let participantIdentity: string | null = null;

  try {
    const parsed = new URL(url, 'ws://localhost');
    token = parsed.searchParams.get('token');
    sessionId = parsed.searchParams.get('sessionId');
    participantIdentity = parsed.searchParams.get('participantIdentity');
  } catch {
    return { ok: false, reason: 'invalid' };
  }

  if (!token) return { ok: false, reason: 'missing_token' };

  if (config.jwtSecret) {
    return verifyJwtToken(token, config.jwtSecret, { sessionId, participantIdentity });
  }

  if (token === config.sharedSecret || token === config.browserToken) {
    return { ok: true, mode: 'legacy-token' };
  }

  return { ok: false, reason: 'invalid' };
}

async function verifyJwtToken(
  token: string,
  secret: string,
  expected: { sessionId: string | null; participantIdentity: string | null },
): Promise<VoiceWorkerAuthResult> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: VOICE_WORKER_TOKEN_ISSUER,
      audience: VOICE_WORKER_TOKEN_AUDIENCE,
      clockTolerance: 5,
    });
    const raw = payload as RawClaims;
    const scopes = typeof raw.scope === 'string' ? raw.scope.split(' ').filter(Boolean) : [];
    const sessionId = typeof raw.sessionId === 'string' ? raw.sessionId : '';
    const participantIdentity = typeof raw.participantIdentity === 'string' ? raw.participantIdentity : '';

    if (!scopes.includes(VOICE_WORKER_STREAM_SCOPE)) {
      return { ok: false, reason: 'wrong_scope' };
    }
    if (expected.sessionId && sessionId !== expected.sessionId) {
      return { ok: false, reason: 'wrong_session' };
    }
    if (expected.participantIdentity && participantIdentity !== expected.participantIdentity) {
      return { ok: false, reason: 'wrong_participant' };
    }

    return {
      ok: true,
      mode: 'jwt',
      sessionId,
      participantIdentity,
      ...(typeof raw.jti === 'string' ? { jti: raw.jti } : {}),
    };
  } catch (error) {
    if (error instanceof joseErrors.JWTExpired) {
      return { ok: false, reason: 'expired' };
    }
    return { ok: false, reason: 'invalid' };
  }
}
