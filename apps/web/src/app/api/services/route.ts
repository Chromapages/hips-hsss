import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

export async function GET() {
  // Initialize Firestore lazily — return 503 if not configured
  const db = getDb();
  if (!db) {
    return NextResponse.json({
      error: 'Service temporarily unavailable. Please try again later.',
    }, { status: 503 });
  }

  try {
    const servicesRef = db.collection('services');
    const snapshot = await servicesRef.where('active', '==', true).get();
    
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
