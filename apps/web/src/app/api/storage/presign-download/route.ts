import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signDownloadUrl, getStorageConfigStatus } from '@/lib/storage';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const presignDownloadSchema = z.object({
  key: z.string().min(1).max(512),
});

/**
 * POST /api/storage/presign-download
 *
 * Returns a short-lived signed GET URL the client uses to download an
 * attachment directly. The key is opaque to the client (the API expects
 * the client to pass back a key it received from presign-upload or stored
 * on a record).
 *
 * Authorization: ADMIN_ROLES only.
 */
export async function POST(req: NextRequest) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = presignDownloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.format() },
      { status: 400 }
    );
  }

  const status = getStorageConfigStatus();
  if (!status.ready) {
    return NextResponse.json(
      { error: 'Storage backend is not configured', code: 'STORAGE_NOT_CONFIGURED' },
      { status: 503 }
    );
  }

  try {
    const result = await signDownloadUrl(parsed.data.key);

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'STORAGE_PRESIGN_DOWNLOAD',
      targetType: 'STORAGE',
      targetId: parsed.data.key,
      result: 'SUCCESS',
      ip,
    });

    return NextResponse.json({ ...result, storageBackend: status.backend });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[presignDownload] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
