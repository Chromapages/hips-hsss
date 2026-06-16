import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { FACILITATOR_ROLES, ROLES } from '@/lib/roles';
import { requireRole } from '@/lib/request-auth';
import { getPrisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const db = getDb();
  const authResult = await requireRole(req, ...FACILITATOR_ROLES);
  if (authResult.error) return authResult.error;

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
    if (!db) {
      return NextResponse.json({ hosts: mockHosts });
    }

    const hosts = await getPrisma().user.findMany({
      where: {
        deletedAt: null,
        role: { in: [ROLES.FACILITATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN] },
      },
      take: 50,
      select: { firebaseUid: true, email: true },
    });

    if (hosts.length === 0) {
      return NextResponse.json({ hosts: mockHosts, isDemoData: true });
    }

    const hostsData = await Promise.all(hosts.map(async (host) => {
      const hostId = host.firebaseUid;
      const activeSessionsCount = await db.collection('sessions')
        .where('facilitatorId', '==', hostId)
        .where('status', '==', 'ACTIVE')
        .count()
        .get();

      const caseload = activeSessionsCount.data().count;

      return {
        id: hostId,
        name: host.email,
        specialty: 'Peer Support, General Wellness',
        status: caseload > 0 ? 'BUSY' : 'OFFLINE',
        caseload,
      };
    }));

    return NextResponse.json({ hosts: hostsData });

  } catch (error: unknown) {
    console.error('[FacilitatorHosts GET] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
