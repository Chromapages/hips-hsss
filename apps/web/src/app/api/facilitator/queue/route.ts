import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { requireRole } from '@/lib/request-auth';
import { FACILITATOR_ROLES } from '@/lib/roles';

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const authResult = await requireRole(req, ...FACILITATOR_ROLES);
  if (authResult.error) return authResult.error;

  try {
    // 2. Fetch Unassigned Scheduled Sessions (limit 50, sorted by soonest first)
    const sessionsSnapshot = await db.collection('sessions')
      .where('status', '==', 'SCHEDULED')
      .where('facilitatorId', '==', null)
      .get();

    const queue = sessionsSnapshot.docs.map(doc => {
      const data = doc.data();
      const serviceName = data.serviceName || 'Support Session';
      
      // Dynamic priority elevation based on service name characteristics
      let priority = data.priority || 'STANDARD';
      const nameLower = serviceName.toLowerCase();
      if (nameLower.includes('crisis') || nameLower.includes('intervention')) {
        priority = 'CRISIS';
      } else if (nameLower.includes('mentoring') || nameLower.includes('grief')) {
        priority = 'URGENT';
      }

      return {
        id: doc.id,
        serviceName,
        startsAt: data.startsAt,
        createdAt: data.createdAt,
        priority,
      };
    });

    // Sort: CRISIS first, then URGENT, then STANDARD. Tie-breaker is startsAt ascending
    const priorityOrder: Record<string, number> = { CRISIS: 1, URGENT: 2, STANDARD: 3 };
    queue.sort((a, b) => {
      const pA = priorityOrder[a.priority] || 3;
      const pB = priorityOrder[b.priority] || 3;
      if (pA !== pB) return pA - pB;
      return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
    });

    return NextResponse.json({ queue });

  } catch (error: unknown) {
    console.error('[FacilitatorQueue] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
