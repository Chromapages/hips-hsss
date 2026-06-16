import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { z } from 'zod';
import { requireRole } from '@/lib/request-auth';
import { FACILITATOR_ROLES } from '@/lib/roles';

const claimSchema = z.object({
  sessionId: z.string(),
});

export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const authResult = await requireRole(req, ...FACILITATOR_ROLES);
  if (authResult.error) return authResult.error;

  try {
    const userId = authResult.user.uid;

    // 2. Validate Input
    const body = await req.json();
    const { sessionId } = claimSchema.parse(body);

    // 3. Claim Session (Atomic Transaction)
    const sessionRef = db.collection('sessions').doc(sessionId);

    const result = await db.runTransaction(async (transaction) => {
      const sessionDoc = await transaction.get(sessionRef);

      if (!sessionDoc.exists) throw new Error('Session not found');

      const data = sessionDoc.data();

      if (data?.facilitatorId) {
        throw new Error('Session already claimed by another facilitator');
      }

      if (data?.userId === userId) {
        throw new Error('You cannot facilitate your own session');
      }

      transaction.update(sessionRef, {
        facilitatorId: userId,
        status: 'SCHEDULED',
        updatedAt: new Date().toISOString(),
      });

      return { success: true };
    });

    console.log(`[FacilitatorClaim] Session ${sessionId} claimed by ${userId}`);
    return NextResponse.json(result);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[FacilitatorClaim] Error:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
