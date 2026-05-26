import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { sendPackageExpiryWarningEmail } from '@/emails';

/**
 * Cron: Package Expiry Warning
 * GET /api/cron/package-expiry-warning
 * 
 * Finds packages where usedSessions/totalSessions >= 0.75 and sends expiry warning.
 * Idempotent: skips packages notified within last 7 days.
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
    const packagesRef = db.collection('packages');
    const snapshot = await packagesRef
      .where('status', '==', 'ACTIVE')
      .where('usedSessions', '>=', 1)
      .get();

    const atRisk = snapshot.docs.filter((doc: QueryDocumentSnapshot) => {
      const pkg = doc.data();
      const ratio = pkg.usedSessions / pkg.totalSessions;
      return ratio >= 0.75;
    });

    if (atRisk.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No packages at 75% usage' });
    }

    const results = await Promise.allSettled(
      atRisk.map(async (doc: QueryDocumentSnapshot) => {
        const pkg = doc.data();
        const userRef = db.collection('users').doc(pkg.userId as string);
        const userDoc = await userRef.get();
        const user = userDoc.data();

        if (!user?.email) {
          console.warn(`[Cron Expiry] No email for user ${pkg.userId}`);
          return null;
        }

        const lastNotified = pkg.lastExpiryWarning;
        if (lastNotified) {
          const daysSince = (Date.now() - new Date(lastNotified).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSince < 7) {
            console.log(`[Cron Expiry] Already notified for package ${doc.id}, skipping`);
            return null;
          }
        }

        const remaining = pkg.totalSessions - pkg.usedSessions;
        const expiryDate = new Date(pkg.expiresAt as string).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        await sendPackageExpiryWarningEmail({
          to: user.email,
          sessionsRemaining: remaining,
          expiryDate,
        });

        await doc.ref.update({ lastExpiryWarning: new Date().toISOString() });
        console.log(`[Cron Expiry] Warning sent for package ${doc.id} to ${user.email}`);
        return doc.id;
      })
    );

    const succeeded = results.filter(
      (r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled' && r.value !== null
    ).length;
    return NextResponse.json({ sent: succeeded, total: atRisk.length });
  } catch (error: unknown) {
    console.error('[Cron Expiry] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
