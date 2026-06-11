import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { ROLES } from '@/lib/roles';

export async function GET(req: NextRequest) {
  const db = getDb();
  const auth = getAdminAuth();

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
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId = 'mock-uid-123';
    let role: string = ROLES.FACILITATOR;

    if (process.env.NODE_ENV === 'production' || !token.startsWith('mock-token-')) {
      if (!auth) {
        return NextResponse.json({ availability: defaultAvailability, warning: 'Auth uninitialized. Returning defaults.' });
      }
      const payload = await verifyFirebaseIdToken(token);
      userId = typeof payload.sub === 'string' ? payload.sub : 'unknown';
      role = (payload.role as string) || ROLES.PARTICIPANT;
    }

    if (role !== ROLES.FACILITATOR && role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
  const auth = getAdminAuth();

  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId = 'mock-uid-123';
    let role: string = ROLES.FACILITATOR;

    if (process.env.NODE_ENV === 'production' || !token.startsWith('mock-token-')) {
      if (!auth) {
        return NextResponse.json({ success: true, warning: 'Offline mode: Availability simulated save' });
      }
      const payload = await verifyFirebaseIdToken(token);
      userId = typeof payload.sub === 'string' ? payload.sub : 'unknown';
      role = (payload.role as string) || ROLES.PARTICIPANT;
    }

    if (role !== ROLES.FACILITATOR && role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
