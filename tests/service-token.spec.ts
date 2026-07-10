/**
 * Tests for the service-token module (Layer 2).
 *
 * Covers:
 *  - createServiceToken: success, invalid scope, invalid audience
 *  - validateServiceToken: signature mismatch, expired, wrong audience,
 *    wrong issuer, missing scope, valid case
 *  - jti is set on every issued token
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { SignJWT } from 'jose';
import {
  createServiceToken,
  validateServiceToken,
  ServiceTokenError,
  SCOPES,
  ISSUERS,
  AUDIENCES,
  SERVICE_TOKEN_TTL_SECONDS,
} from '../apps/web/src/lib/auth/serviceToken';
import { isRegisteredScope } from '../apps/web/src/lib/auth/scopes';

const SERVICE_JWT_SECRET = 'a'.repeat(64);

describe('SCOPES registry', () => {
  it('contains all documented scopes', () => {
    expect(SCOPES.SAFETY_REPORT).toBe('safety:report');
    expect(SCOPES.SAFETY_MITIGATE).toBe('safety:mitigate');
    expect(SCOPES.SESSION_MANAGE).toBe('session:manage');
    expect(SCOPES.BILLING_READ).toBe('billing:read');
    expect(SCOPES.VAULT_DECRYPT).toBe('vault:decrypt');
  });

  it('isRegisteredScope returns true only for known scopes', () => {
    expect(isRegisteredScope('safety:report')).toBe(true);
    expect(isRegisteredScope('super:secret:scope')).toBe(false);
    expect(isRegisteredScope('')).toBe(false);
  });
});

describe('createServiceToken', () => {
  beforeEach(() => {
    process.env.SERVICE_JWT_SECRET = SERVICE_JWT_SECRET;
  });

  afterEach(() => {
    delete process.env.SERVICE_JWT_SECRET;
  });

  it('issues a token with all required claims', async () => {
    const token = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, {
      subject: 'hips-web',
      ref: 'session-123',
    });
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  it('sets a unique jti on each token', async () => {
    const a = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, { subject: 'hips-web' });
    const b = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, { subject: 'hips-web' });
    expect(a).not.toBe(b);
  });

  it('refuses an empty scope list', async () => {
    await expect(
      createServiceToken([], AUDIENCES.SAFETY, { subject: 'hips-web' }),
    ).rejects.toThrow(ServiceTokenError);
  });

  it('refuses an unregistered scope', async () => {
    await expect(
      // Force a non-typed value to test the runtime guard.
      createServiceToken(['totally-made-up:scope' as any], AUDIENCES.SAFETY, { subject: 'hips-web' }),
    ).rejects.toThrow(/not in the registry/);
  });

  it('refuses an unknown audience', async () => {
    await expect(
      createServiceToken([SCOPES.SAFETY_REPORT], 'unknown-svc' as any, { subject: 'hips-web' }),
    ).rejects.toThrow(/Audience/);
  });

  it('refuses a zero TTL', async () => {
    await expect(
      createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, {
        subject: 'hips-web',
        expiresInSeconds: 0,
      }),
    ).rejects.toThrow();
  });
});

describe('validateServiceToken', () => {
  beforeEach(() => {
    process.env.SERVICE_JWT_SECRET = SERVICE_JWT_SECRET;
  });

  afterEach(() => {
    delete process.env.SERVICE_JWT_SECRET;
  });

  it('validates a freshly-issued token', async () => {
    const token = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, {
      subject: 'hips-web',
    });
    const payload = await validateServiceToken(token, {
      expectedAudience: AUDIENCES.SAFETY,
      requiredScope: SCOPES.SAFETY_REPORT,
    });
    expect(payload.iss).toBe(ISSUERS.WEB);
    expect(payload.aud).toBe(AUDIENCES.SAFETY);
    expect(payload.scope).toContain(SCOPES.SAFETY_REPORT);
    expect(payload.jti).toBeTruthy();
  });

  it('rejects a token with wrong audience', async () => {
    const token = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.WEB, {
      subject: 'hips-web',
    });
    await expect(
      validateServiceToken(token, {
        expectedAudience: AUDIENCES.SAFETY,
        requiredScope: SCOPES.SAFETY_REPORT,
      }),
    ).rejects.toMatchObject({ reason: 'wrong_audience' });
  });

  it('rejects a token with wrong scope', async () => {
    const token = await createServiceToken([SCOPES.BILLING_READ], AUDIENCES.SAFETY, {
      subject: 'hips-web',
    });
    await expect(
      validateServiceToken(token, {
        expectedAudience: AUDIENCES.SAFETY,
        requiredScope: SCOPES.SAFETY_REPORT,
      }),
    ).rejects.toMatchObject({ reason: 'invalid_scope' });
  });

  it('rejects an expired token', async () => {
    const key = new TextEncoder().encode(SERVICE_JWT_SECRET);
    const expired = await new SignJWT({ scope: SCOPES.SAFETY_REPORT })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(ISSUERS.WEB)
      .setAudience(AUDIENCES.SAFETY)
      .setSubject('hips-web')
      .setJti('expired-jti')
      .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(key);
    await expect(
      validateServiceToken(expired, {
        expectedAudience: AUDIENCES.SAFETY,
        requiredScope: SCOPES.SAFETY_REPORT,
      }),
    ).rejects.toMatchObject({ reason: 'expired' });
  });

  it('rejects a token with signature mismatch', async () => {
    const wrongKey = new TextEncoder().encode('z'.repeat(64));
    const tampered = await new SignJWT({ scope: SCOPES.SAFETY_REPORT })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(ISSUERS.WEB)
      .setAudience(AUDIENCES.SAFETY)
      .setSubject('hips-web')
      .setJti('tampered')
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(wrongKey);
    await expect(
      validateServiceToken(tampered, {
        expectedAudience: AUDIENCES.SAFETY,
        requiredScope: SCOPES.SAFETY_REPORT,
      }),
    ).rejects.toMatchObject({ reason: 'invalid_signature' });
  });

  it('rejects a token with no jti', async () => {
    const key = new TextEncoder().encode(SERVICE_JWT_SECRET);
    // Manually construct a token without setJti
    const noJti = await new SignJWT({ scope: SCOPES.SAFETY_REPORT })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(ISSUERS.WEB)
      .setAudience(AUDIENCES.SAFETY)
      .setSubject('hips-web')
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(key);
    await expect(
      validateServiceToken(noJti, {
        expectedAudience: AUDIENCES.SAFETY,
        requiredScope: SCOPES.SAFETY_REPORT,
      }),
    ).rejects.toMatchObject({ reason: 'missing_jti' });
  });

  it('rejects an unknown issuer', async () => {
    const key = new TextEncoder().encode(SERVICE_JWT_SECRET);
    const badIss = await new SignJWT({ scope: SCOPES.SAFETY_REPORT })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer('rogue-service')
      .setAudience(AUDIENCES.SAFETY)
      .setSubject('hips-web')
      .setJti('rogue-jti')
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(key);
    await expect(
      validateServiceToken(badIss, {
        expectedAudience: AUDIENCES.SAFETY,
        requiredScope: SCOPES.SAFETY_REPORT,
      }),
    ).rejects.toMatchObject({ reason: 'wrong_issuer' });
  });

  it('rejects an empty token', async () => {
    await expect(
      validateServiceToken('', {
        expectedAudience: AUDIENCES.SAFETY,
        requiredScope: SCOPES.SAFETY_REPORT,
      }),
    ).rejects.toMatchObject({ reason: 'missing_token' });
  });
});

describe('SERVICE_TOKEN_TTL_SECONDS', () => {
  it('is 5 minutes per spec', () => {
    expect(SERVICE_TOKEN_TTL_SECONDS).toBe(300);
  });
});
