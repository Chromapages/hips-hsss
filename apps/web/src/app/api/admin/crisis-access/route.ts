import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseIdToken } from '@/lib/auth-edge';
import { ROLES } from '@/lib/roles';
import { extractBearerToken } from '@/lib/extract-token';

const SAFETY_SERVICE_URL = process.env.SAFETY_SERVICE_URL;
const SESSION_SERVICE_SECRET = process.env.SESSION_SERVICE_SECRET;

function getSafetyServiceUrl(): string {
  if (!SAFETY_SERVICE_URL) {
    throw new Error('SAFETY_SERVICE_URL environment variable is not set — crisis access is unavailable');
  }
  return SAFETY_SERVICE_URL;
}

function getSessionServiceSecret(): string {
  if (!SESSION_SERVICE_SECRET) throw new Error('SESSION_SERVICE_SECRET is required');
  return SESSION_SERVICE_SECRET;
}

/**
 * POST /api/admin/crisis-access
 *
 * Phase 6.5 — Human-initiated crisis protocol trigger.
 * Admin initiates crisis → Vault access with justification → VaultAccessLog (INSERT only, immutable).
 * No automated AI decisions.
 */
export async function POST(req: NextRequest) {
  const token = extractBearerToken(req.headers.get('Authorization'));
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decodedToken = await verifyFirebaseIdToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const firebaseUid =
    typeof decodedToken.sub === 'string' ? decodedToken.sub : null;
  if (!firebaseUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin role check (DB, not JWT claim)
  const user = await prisma.user.findUnique({ where: { firebaseUid } });
  if (!user || user.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { subjectRef, justification } = body;

  if (!subjectRef || typeof subjectRef !== 'string' || !subjectRef.trim()) {
    return NextResponse.json(
      { error: 'subjectRef is required' },
      { status: 400 }
    );
  }

  if (
    !justification ||
    typeof justification !== 'string' ||
    justification.trim().length < 10
  ) {
    return NextResponse.json(
      { error: 'justification must be at least 10 characters' },
      { status: 400 }
    );
  }

  const response = await fetch(`${getSafetyServiceUrl()}/safety/crisis-access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getSessionServiceSecret()}`,
    },
    body: JSON.stringify({ subjectRef: subjectRef.trim(), justification: justification.trim() }),
  });

  if (!response.ok) {
    // Log error details server-side; return generic message to client
    const errorText = await response.text();
    console.error('[CrisisAccess] Safety service error:', response.status, errorText);
    return NextResponse.json(
      { error: 'Safety service error. Please try again or contact support.' },
      { status: 502 }
    );
  }

  const result = await response.json();
  return NextResponse.json(result);
}
