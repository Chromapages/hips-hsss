import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceToken, SCOPES, AUDIENCES } from '@/lib/auth/serviceToken';

const SAFETY_SERVICE_URL = process.env.SAFETY_SERVICE_URL || 'http://localhost:3003';

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    // Aggregate stats from Firestore in parallel
    // Use count() aggregation for large collections to avoid scanning all documents
    const [
      sessionsCount,
      scholarshipsCount,
      inquiriesCount,
      usersCount,
    ] = await Promise.all([
      db.collection('sessions').where('status', '==', 'ACTIVE').count().get(),
      db.collection('scholarships').where('status', '==', 'APPROVED').count().get(),
      db.collection('contact_inquiries').count().get(),
      db.collection('users').count().get(),
    ]);

    // Fetch alerts from the safety service
    let recentAlerts: any[] = [];
    try {
      const jwt = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, {
        subject: 'hips-web',
        ref: 'admin-proxy',
      });
      const safetyResponse = await fetch(`${SAFETY_SERVICE_URL}/safety/alerts`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
      if (safetyResponse.ok) {
        const alerts = await safetyResponse.json();
        recentAlerts = Array.isArray(alerts) ? alerts.slice(0, 5) : [];
      }
    } catch (err) {
      console.error('Failed to fetch safety alerts for stats:', err);
    }

    // Fetch last 30 days of sessions to build growth velocity chart
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessionsSnapshotForChart = await db.collection('sessions')
      .where('startsAt', '>=', thirtyDaysAgo.toISOString())
      .get();

    // Group sessions by date
    const dailyCounts: Record<string, number> = {};
    sessionsSnapshotForChart.docs.forEach(doc => {
      const data = doc.data();
      if (data.startsAt) {
        const dateStr = data.startsAt.substring(0, 10); // YYYY-MM-DD
        dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
      }
    });

    // Generate last 30 days list with real data
    const growthData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().substring(0, 10);
      
      const realCount = dailyCounts[dateStr] || 0;
      
      growthData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sessions: realCount,
      });
    }

    return NextResponse.json({
      activeSessions: sessionsCount.data().count,
      scholarships: scholarshipsCount.data().count,
      inquiries: inquiriesCount.data().count,
      totalUsers: usersCount.data().count,
      totalRevenue: "0.00 (Pending reconciliation)",
      recentAlerts,
      growthData,
      dataFreshnessAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('[AdminStats] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
