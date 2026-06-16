import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceToken, SCOPES, AUDIENCES } from '@/lib/auth/serviceToken';
import { writeAuditEvent } from '@/lib/admin-audit';

const escalateSchema = z.object({
  reason: z.string().min(10, 'Justification must be at least 10 characters'),
});

const SAFETY_SERVICE_URL = process.env.SAFETY_SERVICE_URL || 'http://localhost:3003';

async function callSafetyService(endpoint: string, method: 'GET' | 'POST', body?: unknown) {
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

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

    const escalated = await callSafetyService(`/safety/alerts/${id}/escalate`, 'POST', {
      actorId: admin.uid,
      reason,
    });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'SAFETY_ALERT_ESCALATE',
      targetType: 'SAFETY_ALERT',
      targetId: id,
      before: null,
      after: { escalated: true },
      justification: reason,
      result: 'SUCCESS',
      ip,
      userAgent,
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
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const { id } = await params;
    const alert = await callSafetyService(`/safety/alerts-by-id/${id}`, 'GET');
    return NextResponse.json(alert);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}