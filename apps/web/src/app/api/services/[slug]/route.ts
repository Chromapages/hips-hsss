import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, getDb, isFirebaseAdminReady } from '@/lib/firebase-admin';
import { verifyFirebaseIdToken } from '@/lib/firebase-auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isFirebaseAdminReady()) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  // Authenticate — unauthenticated callers get 401
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await verifyFirebaseIdToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const service = await db.collection('services').doc(slug).get();

    if (!service.exists) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Return only public fields — never expose internal document IDs
    const data = service.data()!;
    return NextResponse.json({
      slug: service.id,
      name: data.name,
      description: data.description,
      price: data.price,
      active: data.active,
    });
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
