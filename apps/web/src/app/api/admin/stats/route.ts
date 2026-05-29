import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { ROLES } from '@/lib/roles';

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decodedToken = await verifyFirebaseIdToken(token);
    const firebaseUid = typeof decodedToken.sub === 'string' ? decodedToken.sub : null;

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check Admin Role in Firestore
    const userRef = db.collection('users').doc(firebaseUid);
    const userDoc = await userRef.get();
    const user = userDoc.data();

    if (!user || user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Aggregate stats from Firestore in parallel
    // Use count() aggregation for large collections to avoid scanning all documents
    const [
      sessionsCount,
      scholarshipsCount,
      inquiriesCount,
      usersCount,
      packagesSnapshot,
      alertsSnapshot,
    ] = await Promise.all([
      db.collection('sessions').where('status', '==', 'SCHEDULED').count().get(),
      db.collection('scholarships').where('status', '==', 'APPROVED').count().get(),
      db.collection('inquiries').count().get(),
      db.collection('users').count().get(),
      db.collection('packages').select({ amount: true }).get(),
      db.collection('safetyAlerts').orderBy('createdAt', 'desc').limit(5).get(),
    ]);

    let totalRevenue = 0;
    packagesSnapshot.docs.forEach(doc => {
      totalRevenue += (doc.data().amount || 0);
    });

    return NextResponse.json({
      activeSessions: sessionsCount.data().count,
      scholarships: scholarshipsCount.data().count,
      inquiries: inquiriesCount.data().count,
      totalUsers: usersCount.data().count,
      totalRevenue: totalRevenue.toFixed(2),
      recentAlerts: alertsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    });
  } catch (error: unknown) {
    console.error('[AdminStats] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
