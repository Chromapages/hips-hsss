import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signUploadUrl, buildKey, getStorageConfigStatus } from '@/lib/storage';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const presignUploadSchema = z.object({
  /** Namespace prefix, e.g. "safety/{alertId}" or "scholarship/{id}". */
  namespace: z.string().min(1).max(200),
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(200),
  contentLength: z.number().int().min(1).max(50 * 1024 * 1024).optional(),
});

/**
 * POST /api/storage/presign-upload
 *
 * Returns a short-lived signed PUT URL the client uses to upload the file
 * directly to the storage backend. The signed URL is scoped to a single
 * storage key derived from (namespace, filename, timestamp, random).
 *
 * Authorization: ADMIN_ROLES only. (Attachments may contain PII for safety
 * incidents and scholarship support documents.)
 */
export async function POST(req: NextRequest) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = presignUploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.format() },
      { status: 400 }
    );
  }

  const status = getStorageConfigStatus();
  if (!status.ready) {
    return NextResponse.json(
      {
        error: 'Storage backend is not configured',
        code: 'STORAGE_NOT_CONFIGURED',
        missing: status.missing,
        guidance: 'Set STORAGE_BACKEND to "s3", "firebase", or run in development for local storage.',
      },
      { status: 503 }
    );
  }

  try {
    const key = buildKey(parsed.data.namespace, parsed.data.filename);
    const result = await signUploadUrl(key, parsed.data.contentType, parsed.data.contentLength);

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'STORAGE_PRESIGN_UPLOAD',
      targetType: 'STORAGE',
      targetId: key,
      after: { contentType: parsed.data.contentType, contentLength: parsed.data.contentLength ?? null },
      result: 'SUCCESS',
      ip,
    });

    return NextResponse.json({ ...result, storageBackend: status.backend });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[presignUpload] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
