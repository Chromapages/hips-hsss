import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPrisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { ROLES } from '@/lib/roles';
import { extractBearerToken } from '@/lib/extract-token';

const escalateSchema = z.object({
  reason: z.string().min(10, 'Justification must be at least 10 characters'),
});

const SAFETY_SERVICE_URL = process.env.SAFETY_SERVICE_URL || 'http://localhost:3003';
const SESSION_SERVICE_SECRET = process.env.SESSION_SERVICE_SECRET;

async function callSafetyService(endpoint: string, body: unknown) {
  const response = await fetch(`${SAFETY_SERVICE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SESSION_SERVICE_SECRET}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Safety service error ${response.status}: ${text}`);
  }

  return response.json();
}

async function verifyAdmin(req: NextRequest) {
  const token = extractBearerToken(req.headers.get('authorization'));
  if (!token) return null;

  try {
    const payload = await verifyFirebaseIdToken(token);
    const firebaseUid = typeof payload.sub === 'string' ? payload.sub : null;
    if (!firebaseUid) return null;

    const user = await getPrisma().user.findUnique({ where: { firebaseUid } });
    if (user?.role !== ROLES.ADMIN) return null;
    return user;
  } catch {
    return null;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = escalateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const { id } = await params;
    const { reason } = result.data;

    const escalated = await callSafetyService(`/safety/alerts/${id}/escalate`, {
      actorId: admin.id,
      reason,
    });

    return NextResponse.json({ success: true, ...escalated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Escalate alert error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const alert = await callSafetyService(`/safety/alerts/${id}`, undefined);
    return NextResponse.json(alert);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}