import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyFirebaseIdToken } from './firebase-auth';

const mockVerifyIdToken = vi.hoisted(() => vi.fn());

vi.mock('./firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: mockVerifyIdToken,
  },
}));

const mockPayload = {
  uid: 'user123',
  email: 'test@example.com',
  email_verified: true,
  iss: 'https://securetoken.google.com/project-id',
  aud: 'project-id',
  sub: 'user123',
  auth_time: 1710000000,
  iat: 1710000000,
  exp: 1710003600,
};

describe('verifyFirebaseIdToken', () => {
  beforeEach(() => {
    mockVerifyIdToken.mockReset();
  });

  it('returns decoded payload for a valid Bearer token', async () => {
    mockVerifyIdToken.mockResolvedValue(mockPayload as never);

    const result = await verifyFirebaseIdToken('Bearer abc123token');

    expect(result).toEqual(mockPayload);
    expect(mockVerifyIdToken).toHaveBeenCalledWith('abc123token');
  });

  it('returns decoded payload when header value is just the token', async () => {
    mockVerifyIdToken.mockResolvedValue(mockPayload as never);

    const result = await verifyFirebaseIdToken('abc123token');

    expect(result).toEqual(mockPayload);
    expect(mockVerifyIdToken).toHaveBeenCalledWith('abc123token');
  });

  it('throws when authorization header is null', async () => {
    await expect(verifyFirebaseIdToken(null)).rejects.toThrow(
      'Authorization header is missing'
    );
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('throws when authorization header is undefined', async () => {
    await expect(verifyFirebaseIdToken(undefined)).rejects.toThrow(
      'Authorization header is missing'
    );
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('throws when authorization header is an empty string', async () => {
    await expect(verifyFirebaseIdToken('')).rejects.toThrow(
      'Authorization header is missing'
    );
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('passes through errors from verifyIdToken', async () => {
    const error = new Error('Invalid token');
    mockVerifyIdToken.mockRejectedValue(error);

    await expect(verifyFirebaseIdToken('Bearer badtoken')).rejects.toThrow(
      'Invalid token'
    );
  });

  it('trims whitespace around the token', async () => {
    mockVerifyIdToken.mockResolvedValue(mockPayload as never);

    await verifyFirebaseIdToken('  Bearer   abc123token  ');

    expect(mockVerifyIdToken).toHaveBeenCalledWith('abc123token');
  });

  it('is case-insensitive for Bearer prefix', async () => {
    mockVerifyIdToken.mockResolvedValue(mockPayload as never);

    await verifyFirebaseIdToken('BEARER abc123token');
    expect(mockVerifyIdToken).toHaveBeenCalledWith('abc123token');

    mockVerifyIdToken.mockClear();
    await verifyFirebaseIdToken('bearer abc123token');
    expect(mockVerifyIdToken).toHaveBeenCalledWith('abc123token');
  });
});