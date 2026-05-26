import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { SessionTokenController } from './session-token.controller.js';
import { SessionTokenService } from './session-token.service.js';
import { SessionTokenStore } from '../session-token-store.js';

const { mockVerifyIdToken } = vi.hoisted(() => ({ mockVerifyIdToken: vi.fn() }));
vi.mock('../firebase-init.js', () => ({
  getAdminAuth: () => ({ verifyIdToken: mockVerifyIdToken }),
}));

const FAKE_UID = 'firebase-user-uid-123';
const FAKE_SESSION_ID = 'sess_abc123ref';

const mockSession = {
  id: 'uuid-session-1',
  sessionTokenRef: FAKE_SESSION_ID,
  userId: FAKE_UID,
  startsAt: new Date('2026-05-26T12:00:00Z'),
  endsAt: new Date('2026-05-26T13:00:00Z'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

// SessionTokenService is synchronous-logic-only, tested directly without NestJS DI
function buildService(findUnique: ReturnType<typeof vi.fn>) {
  const tokenStore = new SessionTokenStore();
  const prismaService = { session: { findUnique } };
  return { service: new SessionTokenService(tokenStore, prismaService as any), tokenStore };
}

function currentTimeInWindow() {
  return new Date('2026-05-26T12:05:00Z'); // inside window 11:50–13:10
}

describe('SessionTokenService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('issues a raw 64-char hex token when caller owns session and is in time window', async () => {
    const findUnique = vi.fn().mockResolvedValue(mockSession);
    const { service } = buildService(findUnique);

    const result = await service.issueToken({
      sessionId: FAKE_SESSION_ID,
      firebaseUid: FAKE_UID,
      now: currentTimeInWindow(),
    });

    expect(result).toHaveProperty('token');
    expect(result.token).toMatch(/^[0-9a-f]{64}$/);
    expect(result.token).not.toContain(FAKE_UID);
  });

  it('throws error when session not found', async () => {
    const findUnique = vi.fn().mockResolvedValue(null);
    const { service } = buildService(findUnique);

    await expect(
      service.issueToken({ sessionId: 'nonexistent', firebaseUid: FAKE_UID, now: currentTimeInWindow() }),
    ).rejects.toThrow('Session not found');
  });

  it('throws error when caller does not own the session', async () => {
    const findUnique = vi.fn().mockResolvedValue(mockSession);
    const { service } = buildService(findUnique);

    await expect(
      service.issueToken({ sessionId: FAKE_SESSION_ID, firebaseUid: 'wrong-uid', now: currentTimeInWindow() }),
    ).rejects.toThrow('Caller does not own this session');
  });

  it('throws error when called too early (before 10min-before-start window)', async () => {
    const findUnique = vi.fn().mockResolvedValue(mockSession);
    const { service } = buildService(findUnique);

    await expect(
      service.issueToken({ sessionId: FAKE_SESSION_ID, firebaseUid: FAKE_UID, now: new Date('2026-05-26T11:49:00Z') }),
    ).rejects.toThrow('only allowed');
  });

  it('throws error when called too late (after end+10min window)', async () => {
    const findUnique = vi.fn().mockResolvedValue(mockSession);
    const { service } = buildService(findUnique);

    await expect(
      service.issueToken({ sessionId: FAKE_SESSION_ID, firebaseUid: FAKE_UID, now: new Date('2026-05-26T13:11:00Z') }),
    ).rejects.toThrow('only allowed');
  });

  it('allows requests at exactly the window boundaries', async () => {
    const findUnique = vi.fn().mockResolvedValue(mockSession);
    const { service } = buildService(findUnique);

    await expect(
      service.issueToken({ sessionId: FAKE_SESSION_ID, firebaseUid: FAKE_UID, now: new Date('2026-05-26T11:50:00Z') }),
    ).resolves.toHaveProperty('token');

    await expect(
      service.issueToken({ sessionId: FAKE_SESSION_ID, firebaseUid: FAKE_UID, now: new Date('2026-05-26T13:10:00Z') }),
    ).resolves.toHaveProperty('token');
  });

  it('stores issued token with firebase UID as anonymousParticipantId', async () => {
    const findUnique = vi.fn().mockResolvedValue(mockSession);
    const { service, tokenStore } = buildService(findUnique);

    const result = await service.issueToken({
      sessionId: FAKE_SESSION_ID,
      firebaseUid: FAKE_UID,
      now: currentTimeInWindow(),
    });

    const consumed = tokenStore.consume(result.token, currentTimeInWindow());
    expect(consumed).not.toBeNull();
    expect(consumed).toMatchObject({ sessionId: mockSession.id, anonymousParticipantId: FAKE_UID });
  });

  it('issued token cannot be used twice', async () => {
    const findUnique = vi.fn().mockResolvedValue(mockSession);
    const { service, tokenStore } = buildService(findUnique);

    const result = await service.issueToken({
      sessionId: FAKE_SESSION_ID,
      firebaseUid: FAKE_UID,
      now: currentTimeInWindow(),
    });

    const first = tokenStore.consume(result.token, currentTimeInWindow());
    const second = tokenStore.consume(result.token, currentTimeInWindow());

    expect(first).not.toBeNull();
    expect(second).toBeNull();
  });

  it('issued token does not contain the Firebase UID', async () => {
    const findUnique = vi.fn().mockResolvedValue(mockSession);
    const { service } = buildService(findUnique);

    const result = await service.issueToken({
      sessionId: FAKE_SESSION_ID,
      firebaseUid: FAKE_UID,
      now: currentTimeInWindow(),
    });

    expect(result.token).not.toContain(FAKE_UID);
    expect(result.token).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('SessionTokenController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  function buildController(findUnique: ReturnType<typeof vi.fn>) {
    const tokenStore = new SessionTokenStore();
    const prismaService = { session: { findUnique } };
    const sessionTokenService = new SessionTokenService(tokenStore, prismaService as any);
    // Instantiate controller directly, bypassing NestJS DI
    const controller = new SessionTokenController(sessionTokenService);
    return { controller, tokenStore };
  }

  it('returns 401 when no Authorization header is present', async () => {
    const { controller } = buildController(vi.fn().mockResolvedValue(mockSession));

    await expect(
      controller.issueToken({ sessionId: FAKE_SESSION_ID }, { headers: {} } as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('returns 401 when Firebase token is invalid', async () => {
    const { controller } = buildController(vi.fn().mockResolvedValue(mockSession));
    mockVerifyIdToken.mockRejectedValue(new Error('invalid'));

    await expect(
      controller.issueToken(
        { sessionId: FAKE_SESSION_ID },
        { headers: { authorization: 'Bearer bad_token' } } as any,
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('issues a valid token with a valid Firebase token', async () => {
    const findUnique = vi.fn().mockResolvedValue(mockSession);
    const { controller, tokenStore } = buildController(findUnique);
    mockVerifyIdToken.mockResolvedValue({ uid: FAKE_UID });

    vi.useFakeTimers();
    vi.setSystemTime(currentTimeInWindow());

    const result = await controller.issueToken(
      { sessionId: FAKE_SESSION_ID },
      { headers: { authorization: 'Bearer valid_token' } } as any,
    );

    vi.useRealTimers();

    expect(result).toHaveProperty('token');
    expect(result.token).toMatch(/^[0-9a-f]{64}$/);
    expect(result.token).not.toContain(FAKE_UID);

    // Token is consumable exactly once from the store
    const consumed = tokenStore.consume(result.token, currentTimeInWindow());
    expect(consumed).toMatchObject({ sessionId: mockSession.id, anonymousParticipantId: FAKE_UID });
    expect(tokenStore.consume(result.token, currentTimeInWindow())).toBeNull();
  });
});