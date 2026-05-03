import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, db } from '@/lib/firebase-admin';
import { z } from 'zod';

const claimSchema = z.object({
  sessionId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication & Role
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await adminAuth.verifyIdToken(token);
    const role = (payload.role as string) || 'PARTICIPANT';

    if (role !== 'FACILITATOR' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = payload.uid;

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
        status: 'ASSIGNED', // Or keep as SCHEDULED but with assigned lead
        updatedAt: new Date().toISOString(),
      });

      return { success: true };
    });

    console.log(`[FacilitatorClaim] Session ${sessionId} claimed by ${userId}`);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[FacilitatorClaim] Error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
