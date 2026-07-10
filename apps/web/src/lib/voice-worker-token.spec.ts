import { jwtVerify } from 'jose';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  VOICE_WORKER_STREAM_SCOPE,
  createVoiceWorkerStreamToken,
  isVoiceWorkerJwtConfigured,
} from './voice-worker-token';

const originalEnv: Record<string, string | undefined> = {};
const envKeys = ['VOICE_WORKER_JWT_SECRET', 'SERVICE_JWT_SECRET', 'VOICE_WORKER_SHARED_SECRET'] as const;

beforeEach(() => {
  for (const key of envKeys) {
    originalEnv[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of envKeys) {
    const value = originalEnv[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  vi.restoreAllMocks();
});

describe('voice worker stream token', () => {
  it('reports whether JWT signing is configured', () => {
    expect(isVoiceWorkerJwtConfigured()).toBe(false);
    vi.stubEnv('VOICE_WORKER_JWT_SECRET', 'voice-worker-jwt-secret');
    expect(isVoiceWorkerJwtConfigured()).toBe(true);
  });

  it('mints a short-lived scoped token for the voice worker', async () => {
    vi.stubEnv('VOICE_WORKER_JWT_SECRET', 'voice-worker-jwt-secret-with-enough-entropy');

    const issued = await createVoiceWorkerStreamToken({
      sessionId: 'session-1',
      participantIdentity: 'anon-1',
      jti: 'test-jti',
    });

    const { payload } = await jwtVerify(
      issued.token,
      new TextEncoder().encode('voice-worker-jwt-secret-with-enough-entropy'),
      {
        issuer: 'hips-web',
        audience: 'voice-worker',
      },
    );

    expect(payload).toMatchObject({
      sub: 'anon-1',
      jti: 'test-jti',
      scope: VOICE_WORKER_STREAM_SCOPE,
      sessionId: 'session-1',
      participantIdentity: 'anon-1',
    });
    expect(typeof issued.expiresAt).toBe('string');
  });

  it('falls back to SERVICE_JWT_SECRET when no dedicated worker secret exists', async () => {
    vi.stubEnv('SERVICE_JWT_SECRET', 'service-jwt-secret-with-enough-entropy');

    const issued = await createVoiceWorkerStreamToken({
      sessionId: 'session-1',
      participantIdentity: 'anon-1',
      jti: 'service-jti',
    });

    await expect(jwtVerify(
      issued.token,
      new TextEncoder().encode('service-jwt-secret-with-enough-entropy'),
      {
        issuer: 'hips-web',
        audience: 'voice-worker',
      },
    )).resolves.toBeTruthy();
  });
});
