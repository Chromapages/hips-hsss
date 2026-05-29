import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAdminAuth } from '@/lib/firebase-admin';
import { z } from 'zod';
import { ROLES } from '@/lib/roles';
import type { DocumentData } from 'firebase-admin/firestore';

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await auth.verifyIdToken(token);
    if (payload.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const usersSnapshot = await db.collection('users').limit(100).get();
    const users = usersSnapshot.docs.map((doc: DocumentData) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ users });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await auth.verifyIdToken(token);
    if (payload.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    const parseResult = z.string().min(1, 'userId is required').safeParse(body.userId);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }
    const userId = parseResult.data;

    const roleResult = z.enum(['PARTICIPANT', 'FACILITATOR', 'ADMIN']).safeParse(body.role);
    if (!roleResult.success) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    const role = roleResult.data;

    // 1. Update Custom Claims in Firebase Auth
    await auth.setCustomUserClaims(userId, { role });

    // 2. Update Role in Firestore
    await db.collection('users').doc(userId).update({
      role,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}