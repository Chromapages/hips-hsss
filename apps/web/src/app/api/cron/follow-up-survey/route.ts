import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { sendFollowUpSurveyEmail } from '@/emails';
import { addHours } from 'date-fns';

const SURVEY_URL = process.env.SURVEY_URL || 'https://hips.foundation/feedback';

/**
 * Cron: Follow-up Survey
 * GET /api/cron/follow-up-survey
 * 
 * Finds sessions completed ~48h ago and sends FOLLOW_UP_SURVEY email.
 * Idempotent via surveySent flag on the session document.
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
    const windowStart = addHours(now, -50);
    const windowEnd = addHours(now, -46);

    const sessionsRef = db.collection('sessions');
    const snapshot = await sessionsRef
      .where('status', '==', 'COMPLETED')
      .where('completedAt', '>=', windowStart.toISOString())
      .where('completedAt', '<=', windowEnd.toISOString())
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ sent: 0, message: 'No sessions completed in survey window' });
    }

    const results = await Promise.allSettled(
      snapshot.docs.map(async (doc: QueryDocumentSnapshot) => {
        const session = doc.data();
        const userRef = db.collection('users').doc(session.userId as string);
        const userDoc = await userRef.get();
        const user = userDoc.data();

        if (!user?.email) {
          console.warn(`[Cron Survey] No email for user ${session.userId}`);
          return null;
        }

        if (session.surveySent) {
          console.log(`[Cron Survey] Survey already sent for session ${doc.id}, skipping`);
          return null;
        }

        await sendFollowUpSurveyEmail({
          to: user.email,
          surveyUrl: SURVEY_URL,
        });

        await doc.ref.update({ surveySent: new Date().toISOString() });
        console.log(`[Cron Survey] Survey sent for session ${doc.id} to ${user.email}`);
        return doc.id;
      })
    );

    const succeeded = results.filter(
      (r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled' && r.value !== null
    ).length;
    return NextResponse.json({ sent: succeeded, total: snapshot.size });
  } catch (error: unknown) {
    console.error('[Cron Survey] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
