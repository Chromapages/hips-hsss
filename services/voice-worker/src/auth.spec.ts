import { SignJWT } from 'jose';
import { describe, expect, it } from 'vitest';
import {
  VOICE_WORKER_STREAM_SCOPE,
  authorizeVoiceWorkerUrl,
} from './auth';

const secret = 'voice-worker-jwt-secret-with-enough-entropy-for-tests';

describe('voice worker auth', () => {
  it('allows open mode when no auth is configured', async () => {
    await expect(authorizeVoiceWorkerUrl('/v1/stream', {
      jwtSecret: '',
      sharedSecret: '',
      browserToken: '',
    })).resolves.toEqual({ ok: true, mode: 'open' });
  });

  it('accepts a valid stream JWT for the requested session and participant', async () => {
    const token = await signToken({
      scope: VOICE_WORKER_STREAM_SCOPE,
      sessionId: 'session-1',
      participantIdentity: 'anon-1',
    });

    await expect(authorizeVoiceWorkerUrl(`/v1/stream?token=${token}&sessionId=session-1&participantIdentity=anon-1`, {
      jwtSecret: secret,
      sharedSecret: '',
      browserToken: '',
    })).resolves.toMatchObject({
      ok: true,
      mode: 'jwt',
      sessionId: 'session-1',
      participantIdentity: 'anon-1',
    });
  });

  it('rejects a valid JWT used for another session', async () => {
    const token = await signToken({
      scope: VOICE_WORKER_STREAM_SCOPE,
      sessionId: 'session-1',
      participantIdentity: 'anon-1',
    });

    await expect(authorizeVoiceWorkerUrl(`/v1/stream?token=${token}&sessionId=session-2&participantIdentity=anon-1`, {
      jwtSecret: secret,
      sharedSecret: '',
      browserToken: '',
    })).resolves.toEqual({ ok: false, reason: 'wrong_session' });
  });

  it('rejects a JWT missing the voice stream scope', async () => {
    const token = await signToken({
      scope: 'other:scope',
      sessionId: 'session-1',
      participantIdentity: 'anon-1',
    });

    await expect(authorizeVoiceWorkerUrl(`/v1/stream?token=${token}&sessionId=session-1&participantIdentity=anon-1`, {
      jwtSecret: secret,
      sharedSecret: '',
      browserToken: '',
    })).resolves.toEqual({ ok: false, reason: 'wrong_scope' });
  });

  it('keeps legacy token auth as fallback when JWT auth is not configured', async () => {
    await expect(authorizeVoiceWorkerUrl('/v1/stream?token=legacy-browser-token', {
      jwtSecret: '',
      sharedSecret: 'server-secret',
      browserToken: 'legacy-browser-token',
    })).resolves.toEqual({ ok: true, mode: 'legacy-token' });
  });
});

async function signToken(claims: {
  scope: string;
  sessionId: string;
  participantIdentity: string;
}) {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer('hips-web')
    .setAudience('voice-worker')
    .setSubject(claims.participantIdentity)
    .setJti(`test-${claims.sessionId}-${claims.participantIdentity}-${claims.scope}`)
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(new TextEncoder().encode(secret));
}
