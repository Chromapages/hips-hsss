import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebase-admin';
import { ROLES } from '@/lib/roles';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED']),
});

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });

  const auth = getAdminAuth();
  if (!auth) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });

  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await auth.verifyIdToken(token);
    const userId = payload.uid;

    // Role check — only FACILITATOR or ADMIN can access
    const role = (payload.role as string) || null;
    if (role !== ROLES.FACILITATOR && role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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

  const auth = getAdminAuth();
  if (!auth) return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });

  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await auth.verifyIdToken(token);
    const userId = payload.uid;

    // Role check
    const role = (payload.role as string) || null;
    if (role !== ROLES.FACILITATOR && role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { action, sessionId, data } = body;

    if (action === 'updateStatus' && sessionId) {
      const validation = updateStatusSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      const sessionRef = db.collection('sessions').doc(sessionId);
      await sessionRef.update({ status: validation.data.status, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('[FacilitatorSessions POST] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}