import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceToken, SCOPES, AUDIENCES } from '@/lib/auth/serviceToken';
import { writeAuditEvent } from '@/lib/admin-audit';

const updateStatusSchema = z.object({
  status: z.enum(['OPEN', 'RESOLVED']),
  reason: z.string().min(3, 'Reason must be at least 3 characters').max(500),
});

const SAFETY_SERVICE_URL = process.env.SAFETY_SERVICE_URL || 'http://localhost:3003';

async function callSafetyService(endpoint: string, method: 'GET' | 'POST' | 'PATCH', body?: unknown) {
  const jwt = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, {
    subject: 'hips-web',
    ref: 'admin-proxy',
  });
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
  };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${SAFETY_SERVICE_URL}${endpoint}`, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Safety service error ${response.status}: ${text}`);
  }

  return response.json();
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  try {
    const body = await req.json();
    const result = updateStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const { id } = await params;
    const { status, reason } = result.data;

    const updated = await callSafetyService(`/safety/alerts/${id}/status`, 'PATCH', {
      status,
      actorId: admin.uid,
      reason,
    });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: status === 'RESOLVED' ? 'SAFETY_ALERT_RESOLVE' : 'SAFETY_ALERT_REOPEN',
      targetType: 'SAFETY_ALERT',
      targetId: id,
      before: null,
      after: { status },
      justification: reason,
      result: 'SUCCESS',
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, alert: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Update alert status error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
