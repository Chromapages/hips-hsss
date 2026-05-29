import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, getDb, isFirebaseAdminReady } from '@/lib/firebase-admin';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getErrorCode(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : undefined;
}

function isFirestoreApiDisabled(error: unknown) {
  const message = getErrorMessage(error);
  const code = getErrorCode(error);

  return (
    code === '7' ||
    code === 'PERMISSION_DENIED' ||
    message.includes('Cloud Firestore API has not been used') ||
    message.includes('firestore.googleapis.com')
  );
}

export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).slice(2, 10);

  // Log incoming request with structured context
  console.error(`[AuthSync][${requestId}] POST /api/auth/sync called`);

  // Check Firebase Admin readiness first with full diagnostic
  const adminReady = isFirebaseAdminReady();
  if (!adminReady) {
    const missingEnvVars: string[] = [];
    if (!process.env.FIREBASE_ADMIN_SDK_KEY && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      missingEnvVars.push('FIREBASE_ADMIN_SDK_KEY / FIREBASE_SERVICE_ACCOUNT_KEY');
    }
    if (!process.env.FIREBASE_PROJECT_ID && !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      missingEnvVars.push('FIREBASE_PROJECT_ID / NEXT_PUBLIC_FIREBASE_PROJECT_ID');
    }
    if (!process.env.FIREBASE_CLIENT_EMAIL) missingEnvVars.push('FIREBASE_CLIENT_EMAIL');
    if (!process.env.FIREBASE_PRIVATE_KEY) missingEnvVars.push('FIREBASE_PRIVATE_KEY');

    console.error(`[AuthSync][${requestId}] Firebase Admin SDK not initialized. Missing env vars: ${missingEnvVars.join(', ')}`);
    return NextResponse.json({
      error: 'Service temporarily unavailable',
      code: 'FIREBASE_ADMIN_NOT_INITIALIZED',
      message: 'Firebase Admin SDK is not configured on this server.',
      guidance: 'Ensure FIREBASE_ADMIN_SDK_KEY (file path or base64 JSON), FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in the server environment.',
      missingEnvVars: missingEnvVars,
      requestId,
    }, { status: 503 });
  }

  try {
    // Initialize Firestore lazily — return 503 if not configured
    const db = getDb();
    if (!db) {
      console.error(`[AuthSync][${requestId}] getDb() returned null despite admin being ready`);
      return NextResponse.json({
        error: 'Service temporarily unavailable',
        code: 'FIRESTORE_NOT_INITIALIZED',
        message: 'Firestore could not be initialized.',
        guidance: 'Verify Firebase project has Firestore enabled and credentials are valid.',
        requestId,
      }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = await adminAuth.verifyIdToken(token);

    if (!payload.email) {
      return NextResponse.json({ error: 'Email is missing from token' }, { status: 400 });
    }

    console.log(`[AuthSync][${requestId}] Token verified for: ${payload.email}`);

    // Upsert the user in Firestore
    try {
      const userRef = db.collection('users').doc(payload.uid);

      const userData = {
        firebaseUid: payload.uid,
        email: payload.email,
        updatedAt: new Date().toISOString(),
      };

      // Set user data, merging with existing if present
      await userRef.set(userData, { merge: true });

      // Fetch the document to get the full state (including default fields if needed)
      const userDoc = await userRef.get();
      let user = userDoc.data();

      // Ensure a default role exists if it's a new user
      // Role is managed server-side only — never sourced from user-writable fields
      const defaultRole = 'PARTICIPANT';
      if (!user?.role) {
        await userRef.set({ role: defaultRole }, { merge: true });
        user = { ...user, role: defaultRole };
      }

      // IMPORTANT: Custom claims must NOT be set from user-writable Firestore fields.
      // Custom claims are the authoritative source for RBAC on the client.
      // Role is only promoted via a privileged internal flow, never via self-write.
      await adminAuth.setCustomUserClaims(payload.uid, { role: defaultRole });

      console.log(`[AuthSync][${requestId}] User synced to Firestore & Claims: ${payload.uid} (Role: ${user?.role})`);

      return NextResponse.json({
        success: true,
        user: {
          id: payload.uid,
          email: payload.email,
          role: user?.role || 'PARTICIPANT'
        }
      });
    } catch (dbError: unknown) {
      const code = getErrorCode(dbError);
      const firestoreDisabled = isFirestoreApiDisabled(dbError);
      console.error(`[AuthSync][${requestId}] CRITICAL Firestore error:`, {
        message: getErrorMessage(dbError),
        code,
        stack: dbError instanceof Error ? dbError.stack : undefined,
      });

      if (firestoreDisabled) {
        return NextResponse.json({
          error: 'Firestore is not enabled for this Firebase project.',
          details:
            'Enable the Cloud Firestore API for project hips-hsss, then wait a few minutes and refresh the app.',
          code,
          setupUrl:
            'https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=hips-hsss',
          requestId,
        }, { status: 503 });
      }

      return NextResponse.json({
        error: 'Firestore sync failed',
        details: 'User data sync failed. Contact support if the problem persists.',
        code,
        requestId,
      }, { status: 500 });
    }
  } catch (error: unknown) {
    const code = getErrorCode(error);
    const message = getErrorMessage(error);
    console.error(`[AuthSync][${requestId}] General auth error:`, {
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
