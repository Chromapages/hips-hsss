import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceToken, SCOPES, AUDIENCES } from '@/lib/auth/serviceToken';
import { writeAuditEvent } from '@/lib/admin-audit';
import { getInternalServiceUrl } from '@/lib/internal-service-url';

const SAFETY_SERVICE_URL = getInternalServiceUrl('SAFETY_SERVICE_URL', 'http://localhost:3003');

/**
 * POST /api/admin/crisis-access
 *
 * Phase 6.5 — Human-initiated crisis protocol trigger.
 * Admin initiates crisis → Vault access with justification → VaultAccessLog (INSERT only, immutable).
 * No automated AI decisions.
 */
export async function POST(req: NextRequest) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  try {
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

    const jwt = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, {
      subject: 'hips-web',
      ref: 'admin-proxy',
    });
    const response = await fetch(`${SAFETY_SERVICE_URL}/safety/crisis-access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ subjectRef: subjectRef.trim(), justification: justification.trim() }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const message = errorJson.message || 'Safety service error. Please try again or contact support.';
      console.error('[CrisisAccess] Safety service error:', response.status, errorJson);
      return NextResponse.json(
        { error: message },
        { status: response.status }
      );
    }

    const result = await response.json();

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'CRISIS_ACCESS_TRIGGER',
      targetType: 'CRISIS_ACCESS',
      targetId: subjectRef.trim(),
      before: null,
      after: result,
      justification: justification.trim(),
      result: 'SUCCESS',
      ip,
      userAgent,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('Crisis access error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
