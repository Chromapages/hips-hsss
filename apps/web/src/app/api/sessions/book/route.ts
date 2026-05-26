import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { addHours, isBefore, startOfHour } from 'date-fns';
import { sendBookingConfirmationEmail } from '@/emails';

const bookSchema = z.object({
  serviceId: z.string(),
  startsAt: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  try {
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
    
    const body = await req.json();
    const result = bookSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
    }

    const { serviceId, startsAt } = result.data;
    const startTime = startOfHour(new Date(startsAt));
    const endTime = addHours(startTime, 1);

    if (isBefore(startTime, new Date())) {
      return NextResponse.json({ error: 'Cannot book sessions in the past' }, { status: 400 });
    }

    let sessionResult: {
      id: string;
      serviceName: string;
      startsAt: string;
      status: string;
    } | null = null;
    let userEmail: string | null = null;

    try {
      const txResult = await db.runTransaction(async (transaction) => {
        const userRef = db.collection('users').doc(firebaseUid as string);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists) {
          throw new Error('USER_NOT_FOUND');
        }
        const userData = userDoc.data();
        userEmail = userData?.email ?? null;

        const serviceRef = db.collection('services').doc(serviceId);
        const serviceDoc = await transaction.get(serviceRef);
        
        if (!serviceDoc.exists) {
          throw new Error('SERVICE_NOT_FOUND');
        }
        const serviceData = serviceDoc.data();

        const sessionsRef = db.collection('sessions');
        const existingQuery = sessionsRef
          .where('serviceId', '==', serviceId)
          .where('startsAt', '==', startTime.toISOString())
          .where('status', '==', 'SCHEDULED');
        
        const existingDocs = await transaction.get(existingQuery);

        if (!existingDocs.empty) {
          throw new Error('SLOT_TAKEN');
        }

        const sessionTokenRef = crypto.randomUUID();
        const sessionId = crypto.randomUUID();
        
        const sessionData = {
          id: sessionId,
          userId: firebaseUid,
          serviceId,
          serviceName: serviceData?.name || 'Unknown Service',
          startsAt: startTime.toISOString(),
          endsAt: endTime.toISOString(),
          status: 'SCHEDULED',
          sessionTokenRef,
          createdAt: new Date().toISOString(),
        };

        const sessionRef = db.collection('sessions').doc(sessionId);
        transaction.set(sessionRef, sessionData);

        const participantRef = db.collection('participants').doc(sessionTokenRef);
        transaction.set(participantRef, {
          sessionId,
          role: 'PARTICIPANT',
          createdAt: new Date().toISOString(),
        });

        return sessionData;
      });

      sessionResult = {
        id: txResult.id,
        serviceName: txResult.serviceName,
        startsAt: txResult.startsAt,
        status: txResult.status,
      };
    } catch (transactionError: unknown) {
      const message = transactionError instanceof Error ? transactionError.message : String(transactionError);
      if (message === 'USER_NOT_FOUND') return NextResponse.json({ error: 'User profile not synchronized' }, { status: 404 });
      if (message === 'SERVICE_NOT_FOUND') return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      if (message === 'SLOT_TAKEN') return NextResponse.json({ error: 'This slot is already booked' }, { status: 409 });
      throw transactionError;
    }

    // Send booking confirmation email after successful commit
    if (userEmail && sessionResult) {
      try {
        const startDt = new Date(sessionResult.startsAt);
        const sessionDate = startDt.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        const sessionTime = startDt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        });
        await sendBookingConfirmationEmail({
          to: userEmail,
          serviceName: sessionResult.serviceName,
          sessionDate,
          sessionTime,
        });
        console.log(`[Booking] Confirmation email sent to ${userEmail}`);
      } catch (emailErr) {
        console.error('[Booking] Failed to send confirmation email:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      session: {
        id: sessionResult!.id,
        service: sessionResult!.serviceName,
        startsAt: sessionResult!.startsAt,
        status: sessionResult!.status,
      },
    });
  } catch (error: unknown) {
    console.error('Booking failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
