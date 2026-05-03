import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Authentication & Role
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await adminAuth.verifyIdToken(token);
    const role = (payload.role as string) || 'PARTICIPANT';

    if (role !== 'FACILITATOR' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Facilitator access required' }, { status: 403 });
    }

    // 2. Fetch Unassigned Scheduled Sessions
    // We look for sessions that are SCHEDULED and have no facilitatorId
    const sessionsSnapshot = await db.collection('sessions')
      .where('status', '==', 'SCHEDULED')
      .where('facilitatorId', '==', null)
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

  } catch (error: any) {
    console.error('[FacilitatorQueue] Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
