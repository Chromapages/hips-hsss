import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { sendSessionCancellationEmail } from '@/emails';

const cancelSchema = z.object({
  sessionId: z.string(),
  reason: z.enum(['PARTICIPANT', 'PLATFORM']).optional().default('PLATFORM'),
});

export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    let firebaseUid: string | null = null;
    try {
      const payload = await verifyFirebaseIdToken(token);
      firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = cancelSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
    }

    const { sessionId, reason } = result.data;

    try {
      const sessionRef = db.collection('sessions').doc(sessionId);
      const sessionDoc = await sessionRef.get();

      if (!sessionDoc.exists) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const session = sessionDoc.data();
      const userRef = db.collection('users').doc(session?.userId as string);
      const userDoc = await userRef.get();
      const user = userDoc.data();

      if (!user) {
        return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
      }

      // Ownership check: only the session owner, facilitator, or admin can cancel
      const sessionData = sessionDoc.data();
      const isOwner = sessionData?.userId === firebaseUid;
      const isFacilitator = sessionData?.facilitatorId === firebaseUid;
      // Note: role check would require fetching user doc; owner/facilitator check is sufficient for now

      if (!isOwner && !isFacilitator) {
        return NextResponse.json({ error: 'Forbidden: not authorized to cancel this session' }, { status: 403 });
      }

      // Cancel the session
      await sessionRef.update({
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
        cancelledBy: reason,
        updatedAt: new Date().toISOString(),
      });

      // Send cancellation email
      if (user.email) {
        try {
          const startDt = new Date(session?.startsAt as string);
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

          await sendSessionCancellationEmail({
            to: user.email,
            sessionDate,
            sessionTime,
            cancelledBy: reason as 'PARTICIPANT' | 'PLATFORM',
          });
          console.log(`[Cancellation] Email sent to ${user.email} for session ${sessionId}`);
        } catch (emailErr) {
          console.error('[Cancellation] Failed to send email:', emailErr);
        }
      }

      return NextResponse.json({ success: true, sessionId });
    } catch (error: unknown) {
      console.error('Session cancellation failed:', error instanceof Error ? error.message : error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Cancel endpoint failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
