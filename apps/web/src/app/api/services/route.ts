import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const servicesRef = db.collection('services');
    const snapshot = await servicesRef.where('active', '==', true).get();
    
    let services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Temporary: Seed initial services if empty for development
    if (services.length === 0) {
      const defaultServices = [
        { name: "Peer Support Group", slug: "peer-support", desc: "Weekly group sessions with anonymous abstract avatars.", active: true, category: "Support" },
        { name: "1-on-1 Coaching", slug: "coaching", desc: "Private sessions with verified peer coaches.", active: true, category: "Personal" },
        { name: "Crisis Response Workshop", slug: "crisis-workshop", desc: "Learn emergency de-escalation protocols.", active: true, category: "Training" }
      ];
      
      for (const s of defaultServices) {
        await servicesRef.add(s);
      }
      
      // Re-fetch
      const newSnapshot = await servicesRef.where('active', '==', true).get();
      services = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
