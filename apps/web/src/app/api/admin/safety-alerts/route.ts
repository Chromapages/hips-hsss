import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';

const SAFETY_SERVICE_URL = process.env.SAFETY_SERVICE_URL || 'http://localhost:3003';
const SESSION_SERVICE_SECRET = process.env.SESSION_SERVICE_SECRET;

async function callSafetyService(endpoint: string) {
  const response = await fetch(`${SAFETY_SERVICE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${SESSION_SERVICE_SECRET}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Safety service error: ${response.status}`);
  }

  return response.json();
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decodedToken = await verifyFirebaseIdToken(token);
  if (!decodedToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const firebaseUid = typeof decodedToken.sub === 'string' ? decodedToken.sub : null;

  if (!firebaseUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const alerts = await callSafetyService('/safety/alerts');
  return NextResponse.json(alerts);
}