import { NextRequest, NextResponse } from 'next/server';
import {
  adminAuth,
  getAdminAuth,
  getFirebaseAdminConfigStatus,
  isFirebaseAdminReady,
} from '@/lib/firebase-admin';
import { getPrisma } from '@/lib/prisma';
import { ROLES } from '@/lib/roles';
import { logger } from '@/lib/logger';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getErrorCode(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : undefined;
}

export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).slice(2, 10);

  // Log incoming request with structured context
  logger.info(`[AuthSync][${requestId}] POST /api/auth/sync called`);

  // Check Firebase Admin readiness first with full diagnostic
  const adminReady = isFirebaseAdminReady();
  if (!adminReady) {
    const configStatus = getFirebaseAdminConfigStatus();

    logger.error(
      `[AuthSync][${requestId}] Firebase Admin SDK not initialized`,
      { missingEnvVars: configStatus.missing }
    );
    return NextResponse.json({
      error: 'Service temporarily unavailable',
      code: 'FIREBASE_ADMIN_NOT_INITIALIZED',
      message: 'Firebase Admin SDK is not configured on this server.',
      guidance:
        'Ensure FIREBASE_ADMIN_SDK_KEY points to a valid service account JSON file, or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY directly.',
      missingEnvVars: configStatus.missing,
      requestId,
    }, { status: 503 });
  }

  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = await adminAuth.verifyIdToken(token, true);

    if (!payload.email) {
      return NextResponse.json({ error: 'Email is missing from token' }, { status: 400 });
    }

    logger.info(`[AuthSync][${requestId}] Token verified`, {
      uidSuffix: payload.uid.slice(-6),
    });

    // Commerce.User is the sole role authority. Existing logins never update role.
    try {
      const prisma = getPrisma();
      const existing = await prisma.user.findUnique({
        where: { firebaseUid: payload.uid },
        select: { deletedAt: true },
      });
      if (existing?.deletedAt) {
        return NextResponse.json({ error: 'Account is disabled' }, { status: 403 });
      }

      const user = existing
        ? await prisma.user.update({
            where: { firebaseUid: payload.uid },
            data: { email: payload.email },
            select: { id: true, firebaseUid: true, email: true, role: true },
          })
        : await prisma.user.create({
            data: { firebaseUid: payload.uid, email: payload.email, role: ROLES.PARTICIPANT },
            select: { id: true, firebaseUid: true, email: true, role: true },
          });

      // Remove only the legacy role claim. Firebase tokens prove identity only.
      const authUser = await getAdminAuth()?.getUser(payload.uid);
      const remainingClaims = { ...(authUser?.customClaims || {}) };
      delete remainingClaims.role;
      await adminAuth.setCustomUserClaims(payload.uid, remainingClaims);

      logger.info(`[AuthSync][${requestId}] User synced to Commerce DB`, {
        uidSuffix: payload.uid.slice(-6),
        role: user.role,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          uid: user.firebaseUid,
          email: user.email,
          role: user.role,
        },
        authTime: payload.auth_time,
      });
    } catch (dbError: unknown) {
      const code = getErrorCode(dbError);
      logger.error(`[AuthSync][${requestId}] CRITICAL Commerce DB error`, {
        message: getErrorMessage(dbError),
        code,
        stack: dbError instanceof Error ? dbError.stack : undefined,
      });

      return NextResponse.json({
        error: 'User sync failed',
        details: 'User data sync failed. Contact support if the problem persists.',
        code,
        requestId,
      }, { status: 500 });
    }
  } catch (error: unknown) {
    const code = getErrorCode(error);
    const message = getErrorMessage(error);
    logger.error(`[AuthSync][${requestId}] General auth error`, {
      message,
      code,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Handle Firebase auth-specific errors with appropriate status codes
    if (code?.startsWith('auth/')) {
      return NextResponse.json({
        error: 'Authentication sync failed',
        details: 'Authentication service error. Please try again or sign out and back in.',
        code,
        requestId,
      }, { status: 401 });
    }

    return NextResponse.json({
      error: 'Authentication sync failed',
      details: 'Authentication service error. Please try again or sign out and back in.',
      code,
      requestId,
    }, { status: 500 });
  }
}
