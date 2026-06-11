import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { ROLES } from '@/lib/roles';

export async function GET(req: NextRequest) {
  const db = getDb();
  const auth = getAdminAuth();

  const mockHosts = [
    {
      id: 'host-1',
      name: 'Sarah K.',
      specialty: 'Crisis Intervention, Grief',
      status: 'ONLINE',
      caseload: 0,
    },
    {
      id: 'host-2',
      name: 'David M.',
      specialty: 'Stress Management, LGBTQ+',
      status: 'BUSY',
      caseload: 1,
    },
    {
      id: 'host-3',
      name: 'Elena R.',
      specialty: 'Trauma recovery, Veterans',
      status: 'ONLINE',
      caseload: 0,
    },
    {
      id: 'host-4',
      name: 'Marcus T.',
      specialty: 'Anxiety, General Support',
      status: 'OFFLINE',
      caseload: 0,
    },
  ];

  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let role: string = ROLES.FACILITATOR;

    if (process.env.NODE_ENV === 'production' || !token.startsWith('mock-token-')) {
      if (!auth) {
        return NextResponse.json({ hosts: mockHosts, warning: 'Auth uninitialized. Returning mock hosts.' });
      }
      const payload = await verifyFirebaseIdToken(token);
      role = (payload.role as string) || ROLES.PARTICIPANT;
    }

    if (role !== ROLES.FACILITATOR && role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!db) {
      return NextResponse.json({ hosts: mockHosts });
    }

    // Query all hosts (users with role FACILITATOR or ADMIN)
    const snapshot = await db.collection('users')
      .where('role', 'in', [ROLES.FACILITATOR, ROLES.ADMIN])
      .limit(50)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ hosts: mockHosts, isDemoData: true });
    }

    // Find caseload (active sessions count) for each host
    const hostsData = await Promise.all(snapshot.docs.map(async doc => {
      const userData = doc.data();
      const hostId = doc.id;

      // Count active sessions for this host
      const activeSessionsCount = await db.collection('sessions')
        .where('facilitatorId', '==', hostId)
        .where('status', '==', 'ACTIVE')
        .count()
        .get();

      const caseload = activeSessionsCount.data().count;

      // Determine online status (mock or check a heartbeat/status field if available)
      const lastActive = userData.updatedAt;
      let status = 'OFFLINE';
      if (lastActive) {
        const diffMs = Date.now() - new Date(lastActive).getTime();
        if (diffMs < 5 * 60 * 1000) { // active in last 5 minutes
          status = caseload > 0 ? 'BUSY' : 'ONLINE';
        }
      }

      // Default specialties or use from database
      const specialty = userData.specialties?.join(', ') || 'Peer Support, General Wellness';

      return {
        id: hostId,
        name: userData.displayName || 'Peer Supporter',
        specialty,
        status: userData.status || status,
        caseload,
      };
    }));

    return NextResponse.json({ hosts: hostsData });

  } catch (error: unknown) {
    console.error('[FacilitatorHosts GET] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
