import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

type DashboardSession = {
  id: string;
  serviceName?: string;
  startsAt?: string | Date | { toDate?: () => Date; seconds?: number };
  status?: string;
};

type DashboardPackage = {
  id: string;
  serviceName?: string;
  totalSessions?: number;
  usedSessions?: number;
};

function toDate(value: DashboardSession['startsAt']) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
  return null;
}

function serializeDate(value: DashboardSession['startsAt']) {
  const date = toDate(value);
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
}

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

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await adminAuth.verifyIdToken(token);
    const userId = payload.uid;

    // Look up the user's internal anonymous ID (never expose Firebase UID)
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 2. Fetch User Sessions
    const sessionsSnapshot = await db.collection('sessions')
      .where('userId', '==', userId)
      .get();
    
    const sessions = sessionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DashboardSession));

    // 3. Fetch User Packages (Optional/Placeholder for now)
    const packagesSnapshot = await db.collection('packages')
      .where('userId', '==', userId)
      .get();
    
    const packages = packagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DashboardPackage));

    const now = new Date();
    const sortedSessions = [...sessions].sort((a, b) => {
      const aTime = toDate(a.startsAt)?.getTime() || 0;
      const bTime = toDate(b.startsAt)?.getTime() || 0;
      return bTime - aTime;
    });
    const upcomingSessions = sessions.filter(s => {
      const startsAt = toDate(s.startsAt);
      return s.status === 'SCHEDULED' && startsAt && startsAt > now;
    });
    
    // Sort ascending for next session
    const sortedUpcoming = [...upcomingSessions].sort((a, b) => {
      const aTime = toDate(a.startsAt)?.getTime() || 0;
      const bTime = toDate(b.startsAt)?.getTime() || 0;
      return aTime - bTime;
    });
    const nextSession = sortedUpcoming[0] || null;

    return NextResponse.json({
      stats: {
        upcoming: upcomingSessions.length,
        packages: packages.filter(p => (p.usedSessions || 0) < (p.totalSessions || 0)).length,
      },
      nextSession: nextSession ? {
        id: nextSession.id,
        serviceName: nextSession.serviceName,
        startsAt: serializeDate(nextSession.startsAt),
      } : null,
      sessions: sortedSessions.map(s => ({
        id: s.id.substring(0, 8),
        service: s.serviceName || 'Session',
        date: serializeDate(s.startsAt),
        status: s.status,
      })),
      packages: packages.map(p => ({
        id: p.id,
        service: p.serviceName || 'Package',
        remaining: (p.totalSessions || 0) - (p.usedSessions || 0),
        total: p.totalSessions || 0,
      })),
    });
  } catch (error: unknown) {
    const code = getErrorCode(error);
    const firestoreDisabled = isFirestoreApiDisabled(error);
    console.error('[DashboardAPI] CRITICAL Error:', {
      message: getErrorMessage(error),
      code,
      stack: error instanceof Error ? error.stack : undefined
    });

    if (firestoreDisabled) {
      return NextResponse.json({
        error: 'Firestore is not enabled for this Firebase project.',
        details:
          'Enable the Cloud Firestore API for project hips-hsss, then wait a few minutes and refresh the dashboard.',
        code,
        setupUrl:
          'https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=hips-hsss',
      }, { status: 503 });
    }

    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: getErrorMessage(error),
      code 
    }, { status: code?.startsWith('auth/') ? 401 : 500 });
  }
}
