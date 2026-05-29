import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  try {
    // In the try block:
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await auth.verifyIdToken(token);
    const role = (payload.role as string) || 'PARTICIPANT';

    if (role !== 'FACILITATOR' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Facilitator access required' }, { status: 403 });
    }

    // 2. Fetch Unassigned Scheduled Sessions (limit 50, sorted by soonest first)
    const sessionsSnapshot = await db.collection('sessions')
      .where('status', '==', 'SCHEDULED')
      .where('facilitatorId', '==', null)
      .orderBy('startsAt', 'asc')
      .limit(50)
      .get();

    const queue = sessionsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        serviceName: data.serviceName || 'Support Session',
        startsAt: data.startsAt, // Standardized in Firestore
        createdAt: data.createdAt,
      };
    });

    // Sort by soonest first
    queue.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    return NextResponse.json({ queue });

  } catch (error: unknown) {
    console.error('[FacilitatorQueue] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
