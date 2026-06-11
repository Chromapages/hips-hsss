import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const feedbackSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  rating: z.number().int().min(1).max(5),
  comments: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const db = getDb();
  
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = await verifyFirebaseIdToken(token);
    const firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
    }

    const { sessionId, rating, comments } = result.data;

    if (db) {
      // Check if session exists and belongs to the user
      const sessionRef = db.collection('sessions').doc(sessionId);
      const sessionDoc = await sessionRef.get();

      if (!sessionDoc.exists) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const sessionData = sessionDoc.data();
      if (sessionData?.userId !== firebaseUid) {
        return NextResponse.json({ error: 'Forbidden: You cannot provide feedback for this session' }, { status: 403 });
      }

      // Add feedback anonymously (do NOT store userId directly in feedback to ensure anonymity)
      await db.collection('feedbacks').add({
        sessionId,
        rating,
        comments: comments || '',
        serviceId: sessionData.serviceId || '',
        serviceName: sessionData.serviceName || '',
        createdAt: new Date().toISOString(),
      });

      // Mark feedback as submitted on the session document itself
      await sessionRef.update({
        feedbackSubmitted: true,
        updatedAt: new Date().toISOString(),
      });
    } else {
      console.warn('[FeedbackAPI] Firestore uninitialized. Simulated success locally.');
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[FeedbackAPI] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
