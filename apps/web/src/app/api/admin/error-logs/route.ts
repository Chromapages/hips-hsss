import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getDb, isFirebaseAdminReady } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { asError } from '@/lib/errors';

// Mock error logs for offline local development
const MOCK_ERROR_LOGS = [
  {
    id: 'mock-err-1',
    message: 'LiveKit Room Connection error: Connection timeout after 15000ms',
    severity: 'CRITICAL',
    sessionId: 'session-breath-102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
    stack: 'Error: Connection timeout\n    at Room.connect (node_modules/livekit-client/dist/room.js:231:14)\n    at SessionRoom.tsx:288:24'
  },
  {
    id: 'mock-err-2',
    message: 'Microphone access blocked. Please enable microphone permissions in your browser settings to join the session.',
    severity: 'HIGH',
    sessionId: 'session-anxiety-05',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/...',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 min ago
    stack: 'DOMException: Permission denied'
  },
  {
    id: 'mock-err-3',
    message: 'Microphone publication failed: Audio node could not be created because AudioContext was suspended',
    severity: 'HIGH',
    sessionId: 'session-breath-102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours ago
    stack: 'Error: AudioContext is suspended\n    at SessionContent.tsx:559:12'
  },
  {
    id: 'mock-err-4',
    message: 'Token fetch failed: Session has ended',
    severity: 'CRITICAL',
    sessionId: 'session-support-99',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    stack: 'Error: Session is not active\n    at fetchLiveKitToken (SessionRoom.tsx:185:17)'
  },
  {
    id: 'mock-err-5',
    message: 'Voice mask unavailable: AudioWorklet failed to load in this browser environment',
    severity: 'MEDIUM',
    sessionId: 'session-practice-sandbox',
    userAgent: 'Mozilla/5.0 (Safari/17.0) AppleWebKit/605.1.15...',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    stack: 'Error: AudioWorklet not supported'
  }
];

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const adminReady = isFirebaseAdminReady();

    // If offline local dev bypass and Firebase Admin is not ready, return mock data
    if (process.env.NODE_ENV === 'development' && !adminReady) {
      const severityFilter = req.nextUrl.searchParams.get('severity');
      let logs = MOCK_ERROR_LOGS;
      if (severityFilter) {
        logs = logs.filter(l => l.severity === severityFilter);
      }
      return NextResponse.json(logs);
    }

    // Query from Firestore
    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const severityFilter = req.nextUrl.searchParams.get('severity');
    let query: admin.firestore.Query = db.collection('error_logs');

    if (severityFilter) {
      query = query.where('severity', '==', severityFilter);
    }

    // Sort by creation time descending
    query = query.orderBy('createdAt', 'desc').limit(100);

    const snapshot = await query.get();
    const logs = snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(logs);
  } catch (error: unknown) {
    const errorObj = asError(error);
    console.error('[AdminErrorLogs] Fetch error:', errorObj);
    return NextResponse.json({ error: errorObj.message || 'Internal Server Error' }, { status: 500 });
  }
}
