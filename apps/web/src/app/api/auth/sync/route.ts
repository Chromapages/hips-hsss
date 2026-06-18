import { NextRequest, NextResponse } from 'next/server';
import {
  adminAuth,
  getAdminAuth,
  getFirebaseAdminConfigStatus,
  isFirebaseAdminReady,
} from '@/lib/firebase-admin';
import { getPrisma } from '@/lib/prisma';
import { ROLES, type Role } from '@/lib/roles';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getErrorCode(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : undefined;
}

function isDatabaseUnavailableError(error: unknown) {
  const code = getErrorCode(error);
  const message = getErrorMessage(error);

  return (
    code === 'P1001' ||
    code === 'P1002' ||
    code === 'P1008' ||
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    message.includes('DATABASE_URL is not set') ||
    message.includes("Can't reach database server") ||
    message.includes('Timed out fetching a new connection')
  );
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
      initError: process.env.NODE_ENV !== 'production' ? configStatus.initError : undefined,
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
    let role: Role = ROLES.PARTICIPANT;
    let userId: string = payload.uid;
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    const demoRoles: Record<string, Role> = {
      "participant@hips.foundation": ROLES.PARTICIPANT,
      "facilitator@hips.foundation": ROLES.FACILITATOR,
      "admin@hips.foundation": ROLES.ADMIN,
      "superadmin@hips.foundation": ROLES.SUPER_ADMIN,
    };

    try {
      const prisma = getPrisma();
      const existing = await prisma.user.findUnique({
        where: { firebaseUid: payload.uid },
        select: { id: true, deletedAt: true },
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
            data: { 
              firebaseUid: payload.uid, 
              email: payload.email, 
              role: (payload.email && demoRoles[payload.email]) || ROLES.PARTICIPANT
            },
            select: { id: true, firebaseUid: true, email: true, role: true },
          });

      role = user.role as Role;
      userId = user.id;
    } catch (dbError: unknown) {
      const emailKey = payload.email || "";
      if (isDemoMode) {
        role = demoRoles[emailKey] || ROLES.PARTICIPANT;
        logger.warn(`[AuthSync][${requestId}] Database unreachable. Falling back to DEMO_MODE role assignment.`, {
          email: payload.email,
          role,
        });
      } else {
        const code = getErrorCode(dbError);
        const isUnavailable = isDatabaseUnavailableError(dbError);
        logger.error(`[AuthSync][${requestId}] CRITICAL Commerce DB error`, {
          message: getErrorMessage(dbError),
          code,
          isUnavailable,
          stack: dbError instanceof Error ? dbError.stack : undefined,
        });

        return NextResponse.json({
          error: isUnavailable ? 'User sync temporarily unavailable' : 'User sync failed',
          details: isUnavailable
            ? 'User data sync is temporarily unavailable. Please try again shortly.'
            : 'User data sync failed. Contact support if the problem persists.',
          code,
          requestId,
        }, { status: isUnavailable ? 503 : 500 });
      }
    }

    try {
      // Remove only the legacy role claim. Firebase tokens prove identity only.
      const authUser = await getAdminAuth()?.getUser(payload.uid);
      const remainingClaims = { ...(authUser?.customClaims || {}) };
      delete remainingClaims.role;
      await adminAuth.setCustomUserClaims(payload.uid, remainingClaims);

      logger.info(`[AuthSync][${requestId}] User synced to Commerce DB`, {
        uidSuffix: payload.uid.slice(-6),
        role,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          uid: payload.uid,
          email: payload.email,
          role,
        },
        authTime: payload.auth_time,
      });
    } catch (adminError: unknown) {
      // If setting user claims or fetching fails but we are in demo mode, ignore and proceed
      if (isDemoMode) {
        return NextResponse.json({
          success: true,
          user: {
            id: userId,
            uid: payload.uid,
            email: payload.email,
            role,
          },
          authTime: payload.auth_time,
        });
      }
      throw adminError;
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
