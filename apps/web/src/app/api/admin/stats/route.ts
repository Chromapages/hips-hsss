import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

export async function GET(req: NextRequest) {
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

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Aggregate stats from Firestore
    const sessionsSnapshot = await db.collection('sessions')
      .where('status', '==', 'SCHEDULED')
      .get();
    
    const scholarshipsSnapshot = await db.collection('scholarships')
      .where('status', '==', 'APPROVED')
      .get();
    
    const inquiriesSnapshot = await db.collection('inquiries')
      .get();

    const usersSnapshot = await db.collection('users').get();

    const packagesSnapshot = await db.collection('packages').get();
    let totalRevenue = 0;
    packagesSnapshot.docs.forEach(doc => {
      totalRevenue += (doc.data().amount || 0);
    });

    const alertsSnapshot = await db.collection('safetyAlerts')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    return NextResponse.json({
      activeSessions: sessionsSnapshot.size,
      scholarships: scholarshipsSnapshot.size,
      inquiries: inquiriesSnapshot.size,
      totalUsers: usersSnapshot.size,
      totalRevenue: totalRevenue.toFixed(2),
      recentAlerts: alertsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    });
  } catch (error: unknown) {
    console.error('[AdminStats] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
