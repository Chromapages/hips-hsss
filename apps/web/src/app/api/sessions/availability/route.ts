import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { addDays, startOfDay, addHours, isAfter } from 'date-fns';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

// In-memory cache with 1-minute TTL
const cache = new Map<string, { data: unknown; expiresAt: number }>();

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  try {
    // Verify Firebase auth token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await verifyFirebaseIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');
    const date = searchParams.get('date') || new Date().toISOString().slice(0, 10);
    const cacheKey = `${serviceId}:${date}`;
    const now = Date.now();

    // Return cached result if valid
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return NextResponse.json(cached.data);
    }

    const daysToCheck = 7;
    const startHour = 9;
    const endHour = 17;

    const availableSlots = [];

    // Fetch existing booked sessions from Firestore
    const sessionsSnapshot = await db.collection('sessions')
      .where('serviceId', '==', serviceId)
      .where('status', '==', 'SCHEDULED')
      .where('startsAt', '>=', now.toISOString())
      .where('startsAt', '<=', addDays(new Date(), daysToCheck).toISOString())
      .get();

    const bookedTimestamps = new Set(
      sessionsSnapshot.docs.map(doc => {
        const ts = doc.data().startsAt;
        return ts ? new Date(ts).getTime() : null;
      }).filter((ts): ts is number => ts !== null)
    );

    for (let i = 0; i < daysToCheck; i++) {
      const day = startOfDay(addDays(new Date(), i));

      for (let hour = startHour; hour <= endHour; hour++) {
        const slotStart = addHours(day, hour);

        if (isAfter(slotStart, new Date())) {
          if (!bookedTimestamps.has(slotStart.getTime())) {
            availableSlots.push({
              startsAt: slotStart.toISOString(),
              endsAt: addHours(slotStart, 1).toISOString(),
            });
          }
        }
      }
    }

    // Store in cache for 1 minute
    cache.set(cacheKey, { data: availableSlots, expiresAt: now + 60_000 });

    return NextResponse.json(availableSlots);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Failed to fetch availability:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}