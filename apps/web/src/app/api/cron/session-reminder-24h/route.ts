import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { sendSessionReminder24HEmail } from '@/emails';
import { addHours, startOfHour } from 'date-fns';

/**
 * Cron: 24h Session Reminder
 * GET /api/cron/session-reminder-24h
 * 
 * Searches for sessions starting in ~24h and sends SESSION_REMINDER_24H email.
 * Safe to run hourly — idempotent via lastReminder24h flag.
 */
export async function GET() {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const url = new URL(process.env.FILES_HOST || 'http://localhost');
    if (url.searchParams.get('secret') !== cronSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  try {
    const now = new Date();
    const windowStart = addHours(startOfHour(now), 23);
    const windowEnd = addHours(startOfHour(now), 25);

    const sessionsRef = db.collection('sessions');
    const query = sessionsRef
      .where('status', '==', 'SCHEDULED')
      .where('startsAt', '>=', windowStart.toISOString())
      .where('startsAt', '<=', windowEnd.toISOString());

    const snapshot = await query.get();

    if (snapshot.empty) {
      return NextResponse.json({ sent: 0, message: 'No sessions in 24h window' });
    }

    const results = await Promise.allSettled(
      snapshot.docs.map(async (doc: QueryDocumentSnapshot) => {
        const session = doc.data();
        const userRef = db.collection('users').doc(session.userId as string);
        const userDoc = await userRef.get();
        const user = userDoc.data();

        if (!user?.email) {
          console.warn(`[Cron 24h] No email for user ${session.userId}`);
          return null;
        }

        if (session.lastReminder24h) {
          console.log(`[Cron 24h] Already reminded session ${doc.id}, skipping`);
          return null;
        }

        const startDt = new Date(session.startsAt as string);
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

        await sendSessionReminder24HEmail({
          to: user.email,
          serviceName: session.serviceName as string,
          sessionDate,
          sessionTime,
        });

        await doc.ref.update({ lastReminder24h: new Date().toISOString() });
        console.log(`[Cron 24h] Reminder sent for session ${doc.id} to ${user.email}`);
        return doc.id;
      })
    );

    const succeeded = results.filter(
      (r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled' && r.value !== null
    ).length;
    return NextResponse.json({ sent: succeeded, total: snapshot.size });
  } catch (error: unknown) {
    console.error('[Cron 24h] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
