import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

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
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = await adminAuth.verifyIdToken(token);
    
    if (!payload.email) {
      return NextResponse.json({ error: 'Email is missing from token' }, { status: 400 });
    }

    console.log('[AuthSync] Token verified for:', payload.email);

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
      if (!user?.role) {
        const defaultRole = 'PARTICIPANT';
        await userRef.update({ role: defaultRole });
        user = { ...user, role: defaultRole };
      }

      // Sync Role to Firebase Custom Claims if not already set correctly
      await adminAuth.setCustomUserClaims(payload.uid, { role: user?.role });

      console.log(`[AuthSync] User synced to Firestore & Claims: ${payload.uid} (Role: ${user?.role})`);

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
      console.error('[AuthSync] CRITICAL Firestore error:', {
        message: getErrorMessage(dbError),
        code,
      });

      if (firestoreDisabled) {
        return NextResponse.json({
          error: 'Firestore is not enabled for this Firebase project.',
          details:
            'Enable the Cloud Firestore API for project hips-hsss, then wait a few minutes and refresh the app.',
          code,
          setupUrl:
            'https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=hips-hsss',
        }, { status: 503 });
      }

      return NextResponse.json({ 
        error: 'Firestore sync failed', 
        details: getErrorMessage(dbError),
        code
      }, { status: 500 });
    }
  } catch (error: unknown) {
    const code = getErrorCode(error);
    console.error('[AuthSync] General auth error:', getErrorMessage(error));
    return NextResponse.json({ 
      error: 'Authentication sync failed', 
      details: getErrorMessage(error)
    }, { status: code?.startsWith('auth/') ? 401 : 500 });
  }
}
