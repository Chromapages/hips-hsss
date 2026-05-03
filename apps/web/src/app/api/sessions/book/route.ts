import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { addHours, isBefore, startOfHour } from 'date-fns';

const bookSchema = z.object({
  serviceId: z.string(), // Firestore IDs are strings
  startsAt: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = await verifyFirebaseIdToken(token);
    const firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Validate Input
    const body = await req.json();
    const result = bookSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
    }

    const { serviceId, startsAt } = result.data;
    const startTime = startOfHour(new Date(startsAt));
    const endTime = addHours(startTime, 1);

    // 3. Security Check: No bookings in the past
    if (isBefore(startTime, new Date())) {
      return NextResponse.json({ error: 'Cannot book sessions in the past' }, { status: 400 });
    }

    // 4. Atomic Booking Transaction
    try {
      const result = await db.runTransaction(async (transaction) => {
        // a. Check if user exists
        const userRef = db.collection('users').doc(firebaseUid);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists) {
          throw new Error('USER_NOT_FOUND');
        }

        // b. Check if service exists
        const serviceRef = db.collection('services').doc(serviceId);
        const serviceDoc = await transaction.get(serviceRef);
        
        if (!serviceDoc.exists) {
          throw new Error('SERVICE_NOT_FOUND');
        }

        // c. Check availability (concurrency check)
        const sessionsRef = db.collection('sessions');
        const existingQuery = sessionsRef
          .where('serviceId', '==', serviceId)
          .where('startsAt', '==', startTime.toISOString())
          .where('status', '==', 'SCHEDULED');
        
        const existingDocs = await transaction.get(existingQuery);

        if (!existingDocs.empty) {
          throw new Error('SLOT_TAKEN');
        }

        // d. Create Session Opaque Reference (Anonymity Bridge)
        const sessionTokenRef = crypto.randomUUID();
        const sessionId = crypto.randomUUID();
        
        const sessionData = {
          id: sessionId,
          userId: firebaseUid, // The commerce-side owner
          serviceId,
          serviceName: serviceDoc.data()?.name || 'Unknown Service',
          startsAt: startTime.toISOString(),
          endsAt: endTime.toISOString(),
          status: 'SCHEDULED',
          sessionTokenRef,
          createdAt: new Date().toISOString(),
        };

        const sessionRef = db.collection('sessions').doc(sessionId);
        transaction.set(sessionRef, sessionData);

        // e. Create the Participant mapping (The Bridge)
        // This is where we break the direct link for the session service
        const participantRef = db.collection('participants').doc(sessionTokenRef);
        transaction.set(participantRef, {
          sessionId,
          role: 'PARTICIPANT',
          createdAt: new Date().toISOString(),
        });

        return sessionData;
      });

      return NextResponse.json({
        success: true,
        session: {
          id: result.id,
          service: result.serviceName,
          startsAt: result.startsAt,
          status: result.status,
        },
      });
    } catch (transactionError: unknown) {
      const message = transactionError instanceof Error ? transactionError.message : String(transactionError);
      if (message === 'USER_NOT_FOUND') return NextResponse.json({ error: 'User profile not synchronized' }, { status: 404 });
      if (message === 'SERVICE_NOT_FOUND') return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      if (message === 'SLOT_TAKEN') return NextResponse.json({ error: 'This slot is already booked' }, { status: 409 });
      
      throw transactionError;
    }
  } catch (error: unknown) {
    console.error('Booking failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
