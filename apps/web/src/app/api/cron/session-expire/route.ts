import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { Phase5SessionSchema } from '@/lib/schemas/session';
import { verifyCronSecret } from '@/lib/security/cron';
const SESSION_COLLECTION = 'phase5_sessions';
const SESSION_TOKEN_TTL_MS = (60 * 60 * 1000) + (5 * 60 * 1000); // 1 hour + 5 minutes buffer

/**
 * Cron: Session Expiration
 * GET /api/cron/session-expire
 *
 * Polls for sessions that have exceeded SESSION_TOKEN_TTL_MS and closes them.
 * Uses activeAt as the reference point — sessions without activeAt are skipped.
 * Safe to run every 5 minutes; idempotent (only transitions active sessions).
 */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const cutoff = new Date(Date.now() - SESSION_TOKEN_TTL_MS).toISOString();

    const snapshot = await db
      .collection(SESSION_COLLECTION)
      .where('status', '==', 'active')
      .where('createdAt', '<', cutoff)
      .get();

    let expiredCount = 0;

    for (const doc of snapshot.docs) {
      const parsed = Phase5SessionSchema.safeParse({ id: doc.id, ...doc.data() });
      if (!parsed.success) continue;
      const data = parsed.data;

      if (data.activeAt) {
        const activeMs = Date.now() - new Date(data.activeAt).getTime();
        if (activeMs > SESSION_TOKEN_TTL_MS) {
          await doc.ref.update({
            status: 'ended',
            endedAt: new Date().toISOString(),
          });
          expiredCount++;
        }
      }
    }

    console.log(`[Cron session-expire] Expired ${expiredCount} stale sessions (checked ${snapshot.size})`);

    return NextResponse.json({ expired: expiredCount, checked: snapshot.size });
  } catch (error: unknown) {
    console.error('[Cron session-expire] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
