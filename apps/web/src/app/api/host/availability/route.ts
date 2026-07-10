import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { FACILITATOR_ROLES } from '@/lib/roles';
import { requireRole } from '@/lib/request-auth';

export async function GET(req: NextRequest) {
  const db = getDb();
  const authResult = await requireRole(req, ...FACILITATOR_ROLES);
  if (authResult.error) return authResult.error;

  const defaultAvailability = {
    monday: ['morning', 'afternoon'],
    tuesday: ['morning', 'afternoon'],
    wednesday: ['morning', 'afternoon', 'evening'],
    thursday: ['morning', 'afternoon'],
    friday: ['morning', 'afternoon'],
    saturday: [],
    sunday: [],
  };

  try {
    const userId = authResult.user.uid;

    if (!db) {
      return NextResponse.json({ availability: defaultAvailability });
    }

    const doc = await db.collection('host_availability').doc(userId).get();
    if (!doc.exists) {
      return NextResponse.json({ availability: defaultAvailability });
    }

    return NextResponse.json({ availability: doc.data()?.availability || defaultAvailability });
  } catch (error) {
    console.error('[HostAvailability GET] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const authResult = await requireRole(req, ...FACILITATOR_ROLES);
  if (authResult.error) return authResult.error;

  try {
    const userId = authResult.user.uid;

    const body = await req.json();
    const { availability } = body;

    if (!availability) {
      return NextResponse.json({ error: 'Availability data is required' }, { status: 400 });
    }

    if (db) {
      await db.collection('host_availability').doc(userId).set({
        availability,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[HostAvailability POST] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
