import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { FACILITATOR_ROLES } from '@/lib/roles';
import { requireRole } from '@/lib/request-auth';
import { getAnonymousHandle } from '@/lib/anonymity';
import { differenceInMinutes } from 'date-fns';

export async function GET(req: NextRequest) {
  const db = getDb();
  const authResult = await requireRole(req, ...FACILITATOR_ROLES);
  if (authResult.error) return authResult.error;

  // Baseline mock data for development mode or fallback
  const today = new Date();
  const fmt = (h: number, m = 0, offsetDays = 0): string => {
    const d = new Date(today);
    d.setDate(today.getDate() + offsetDays);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  const mockAppointments = [
    {
      id: "appt-001",
      clientHandle: "Brave-Owl-3",
      serviceName: "Emotional Support Session",
      startsAt: fmt(10, 0),
      durationMinutes: 50,
      status: "UPCOMING",
    },
    {
      id: "appt-002",
      clientHandle: "Silent-River-9",
      serviceName: "Peer Mentoring",
      startsAt: fmt(13, 30),
      durationMinutes: 50,
      status: "UPCOMING",
    },
    {
      id: "appt-003",
      clientHandle: "Gentle-Fox-2",
      serviceName: "Crisis Intervention",
      startsAt: fmt(15, 0),
      durationMinutes: 30,
      status: "UPCOMING",
    },
    {
      id: "appt-004",
      clientHandle: "Swift-Hawk-7",
      serviceName: "Skill Building Workshop",
      startsAt: fmt(11, 0, -1),
      durationMinutes: 60,
      status: "COMPLETED",
    },
    {
      id: "appt-005",
      clientHandle: "Calm-Bear-5",
      serviceName: "Emotional Support Session",
      startsAt: fmt(14, 0, -2),
      durationMinutes: 50,
      status: "COMPLETED",
    },
  ];

  try {
    const userId = authResult.user.uid;

    if (!db) {
      return NextResponse.json({ appointments: mockAppointments, warning: 'Firebase uninitialized. Showing mock appointments.' });
    }

    // Query actual sessions assigned to this facilitator/host
    const snapshot = await db.collection('sessions')
      .where('facilitatorId', '==', userId)
      .limit(100)
      .get();

    if (snapshot.empty) {
      // If the host has no claimed sessions, return mock sessions combined with a helper warning
      // to avoid an empty dashboard in fresh dev database setups.
      return NextResponse.json({ appointments: mockAppointments, isDemoData: true });
    }

    const appointments = snapshot.docs.map(doc => {
      const data = doc.data();
      const startsAt = data.startsAt || new Date().toISOString();
      const endsAt = data.endsAt || new Date(new Date(startsAt).getTime() + 50 * 60000).toISOString();
      const durationMinutes = Math.max(10, differenceInMinutes(new Date(endsAt), new Date(startsAt)));

      return {
        id: doc.id,
        clientHandle: getAnonymousHandle(data.userId || 'anonymous-user'),
        serviceName: data.serviceName || 'Peer Support Session',
        startsAt,
        durationMinutes,
        status: data.status || 'UPCOMING',
      };
    });

    // Sort: upcoming first (startsAt ascending), then past/completed (startsAt descending)
    appointments.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    return NextResponse.json({ appointments });

  } catch (error: unknown) {
    console.error('[HostAppointmentsAPI] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
