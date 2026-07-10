import { adminAuth } from './firebase-admin';
import { getPrisma } from './prisma';
import { logger } from './logger';

export interface FirebaseTokenPayload {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  iss: string;
  aud: string;
  auth_time: number;
  sub: string;
  iat: number;
  exp: number;
}

function isPrismaUnavailable(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : undefined;
  const message = error instanceof Error ? error.message : String(error);

  return (
    code === 'P1001' ||
    message.includes("Can't reach database server") ||
    message.includes('ECONNREFUSED')
  );
}

function canBypassCommerceUserCheck(payload: FirebaseTokenPayload, error: unknown) {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_DEMO_MODE === 'true' &&
    Boolean(payload.uid) &&
    isPrismaUnavailable(error)
  );
}

/**
 * Verifies a Firebase ID token from an Authorization header value.
 * Accepts the raw header value (e.g. "Bearer <token>") or just the token.
 * Returns the decoded payload or throws.
 */
export async function verifyFirebaseIdToken(
  authorizationHeader: string | null | undefined
): Promise<FirebaseTokenPayload> {
  if (!authorizationHeader) {
    throw new Error('Authorization header is missing');
  }

  const token = authorizationHeader.trim().replace(/^Bearer\s+/i, '');

  if (!token) {
    throw new Error('Bearer token is missing from Authorization header');
  }

  const payload = await adminAuth.verifyIdToken(token, true) as FirebaseTokenPayload;
  let activeUser: { id: string } | null;
  try {
    activeUser = await getPrisma().user.findFirst({
      where: { firebaseUid: payload.uid, deletedAt: null },
      select: { id: true },
    });
  } catch (error) {
    if (canBypassCommerceUserCheck(payload, error)) {
      logger.warn(
        '[FirebaseAuth] Commerce DB unavailable; allowing Firebase-verified identity in local demo mode.',
        { uidSuffix: payload.uid.slice(-6) }
      );
      return payload;
    }

    throw error;
  }

  if (!activeUser) {
    throw new Error('Authenticated user is missing or disabled');
  }
  return payload;
}
