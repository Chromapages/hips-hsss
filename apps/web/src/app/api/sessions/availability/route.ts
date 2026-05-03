import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { addDays, startOfDay, addHours, isAfter } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json({ error: 'serviceId is required' }, { status: 400 });
    }

    const now = new Date();
    const daysToCheck = 7;
    const startHour = 9;
    const endHour = 17;

    const availableSlots = [];

    // Fetch existing booked sessions from Firestore
    const sessionsSnapshot = await db.collection('sessions')
      .where('serviceId', '==', serviceId)
      .where('status', '==', 'SCHEDULED')
      .where('startsAt', '>=', now.toISOString())
      .where('startsAt', '<=', addDays(now, daysToCheck).toISOString())
      .get();

    const bookedTimestamps = new Set(
      sessionsSnapshot.docs.map(doc => new Date(doc.data().startsAt).getTime())
    );

    for (let i = 0; i < daysToCheck; i++) {
      const day = startOfDay(addDays(now, i));
      
      for (let hour = startHour; hour <= endHour; hour++) {
        const slotStart = addHours(day, hour);
        
        if (isAfter(slotStart, now)) {
          if (!bookedTimestamps.has(slotStart.getTime())) {
            availableSlots.push({
              startsAt: slotStart.toISOString(),
              endsAt: addHours(slotStart, 1).toISOString(),
            });
          }
        }
      }
    }

    return NextResponse.json(availableSlots);
  } catch (error: any) {
    console.error('Failed to fetch availability:', error.message || error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
