import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createServiceToken, SCOPES, AUDIENCES } from '@/lib/auth/serviceToken';
import { getInternalServiceUrl } from '@/lib/internal-service-url';

const SAFETY_SERVICE_URL = getInternalServiceUrl('SAFETY_SERVICE_URL', 'http://localhost:3003');

async function callSafetyService(endpoint: string) {
  const jwt = await createServiceToken([SCOPES.SAFETY_REPORT], AUDIENCES.SAFETY, {
    subject: 'hips-web',
    ref: 'admin-proxy',
  });
  const response = await fetch(`${SAFETY_SERVICE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Safety service error: ${response.status}`);
  }

  return response.json();
}

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const alerts = await callSafetyService('/safety/alerts');
    return NextResponse.json(alerts);
  } catch (err) {
    console.error('Failed to contact safety service:', err);
    return NextResponse.json({ error: 'Safety service unavailable' }, { status: 502 });
  }
}
