import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { FACILITATOR_ROLES } from '@/lib/roles';
import { requireRole } from '@/lib/request-auth';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED']),
});

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });

  const authResult = await requireRole(req, ...FACILITATOR_ROLES);
  if (authResult.error) return authResult.error;

  try {
    const userId = authResult.user.uid;

    const sessionsSnapshot = await db.collection('sessions')
      .where('facilitatorId', '==', userId)
      .get();

    const sessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ sessions });
  } catch (error: unknown) {
    console.error('[FacilitatorSessions GET] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });

  const authResult = await requireRole(req, ...FACILITATOR_ROLES);
  if (authResult.error) return authResult.error;

  try {
    const userId = authResult.user.uid;
    const body = await req.json();
    const { action, sessionId, data } = body;

    if (action === 'updateStatus' && sessionId) {
      const validation = updateStatusSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      const sessionRef = db.collection('sessions').doc(sessionId);
      const sessionDoc = await sessionRef.get();
      if (!sessionDoc.exists) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      if (sessionDoc.data()?.facilitatorId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      await sessionRef.update({ status: validation.data.status, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('[FacilitatorSessions POST] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
