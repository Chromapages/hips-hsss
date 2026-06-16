import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/firebase-auth';

const confirmSchema = z.object({
  type: z.enum(['SESSION', 'PACKAGE', 'DONATION']),
  id: z.string(), // sessionId, packageId, or donation tier
  amountCents: z.number().int().positive(),
});

const PACKAGES = {
  SINGLE: { credits: 1, name: 'Single Session' },
  ESSENTIAL: { credits: 5, name: 'Essential Pack (5)' },
  SANCTUARY: { credits: 10, name: 'Sanctuary Pack (10)' },
} as const;

export async function POST(req: NextRequest) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (!isDemoMode) {
    return NextResponse.json({ error: 'Demo mode is not enabled' }, { status: 403 });
  }

  // 1. Authenticate (optional for donations, required for others)
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  let firebaseUid: string | null = null;

  if (token) {
    try {
      const payload = await verifyFirebaseIdToken(token);
      firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;
    } catch (err) {
      console.warn('[DemoConfirm] Invalid token provided:', err);
    }
  }

  // 2. Validate payload
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = confirmSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid payload schema', details: result.error.format() }, { status: 400 });
  }

  const { type, id, amountCents } = result.data;

  // For session and package, authentication is strictly required
  if (type !== 'DONATION' && !firebaseUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Initialize Firestore
  const db = getDb();
  if (!db) {
    console.warn('[DemoConfirm] Firebase Admin SDK is uninitialized. Simulating success in offline mode.');
    return NextResponse.json({ success: true, offline: true });
  }

  try {
    if (type === 'SESSION') {
      const sessionRef = db.collection('sessions').doc(id);
      const sessionDoc = await sessionRef.get();

      if (!sessionDoc.exists) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const sessionData = sessionDoc.data();
      if (sessionData?.userId !== firebaseUid) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      await sessionRef.update({
        stripePaymentId: `demo_pm_session_${id}`,
        status: 'SCHEDULED',
        updatedAt: new Date().toISOString(),
      });

      console.log(`[DemoConfirm] Successfully confirmed session ${id} for user ${firebaseUid}`);
    } else if (type === 'PACKAGE_PURCHASE' || type === 'PACKAGE') {
      const packageKey = id as keyof typeof PACKAGES;
      const pkg = PACKAGES[packageKey];

      if (!pkg) {
        return NextResponse.json({ error: 'Invalid package selection' }, { status: 400 });
      }

      await db.collection('packages').add({
        userId: firebaseUid,
        serviceName: pkg.name,
        totalSessions: pkg.credits,
        usedSessions: 0,
        stripePaymentId: `demo_pm_package_${id}_${Date.now()}`,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(`[DemoConfirm] Successfully issued package ${pkg.name} to user ${firebaseUid}`);
    } else if (type === 'DONATION') {
      await db.collection('donations').add({
        amountCents,
        tier: id,
        stripePaymentId: `demo_pm_donation_${id}_${Date.now()}`,
        userId: firebaseUid || null,
        createdAt: new Date().toISOString(),
      });

      console.log(`[DemoConfirm] Recorded donation of ${amountCents} cents for tier ${id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[DemoConfirm] Error confirming mock payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
