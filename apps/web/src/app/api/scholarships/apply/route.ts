import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const applySchema = z.object({
  requestedCents: z.number().int().positive(),
  note: z.string().min(20).max(1000),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyFirebaseIdToken(token);
    const firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate Input
    const body = await req.json();
    const result = applySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
    }

    const { requestedCents, note } = result.data;

    // 3. Find User in Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not synchronized' }, { status: 404 });
    }

    // 4. Create Scholarship Request in Firestore
    const scholarshipRef = db.collection('scholarships').doc();
    const scholarshipData = {
      id: scholarshipRef.id,
      userId: firebaseUid,
      requestedCents,
      note,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    await scholarshipRef.set(scholarshipData);

    return NextResponse.json({
      success: true,
      scholarship: {
        id: scholarshipData.id,
        status: scholarshipData.status,
        requestedCents: scholarshipData.requestedCents,
      }
    });
  } catch (error: unknown) {
    console.error('Scholarship application failed:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
