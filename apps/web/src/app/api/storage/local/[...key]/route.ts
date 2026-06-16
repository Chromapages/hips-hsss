import { NextRequest, NextResponse } from 'next/server';
import { verifyLocalToken, writeLocalFile, readLocalFile, localFileExists } from '@/lib/storage';

/**
 * Local-development storage endpoint. Only active when STORAGE_BACKEND=local
 * (or unset in non-production). Files live in .local-storage/ on the server.
 *
 * PUT  /api/storage/local/<key>?token=...  — write the body to <key>
 * GET  /api/storage/local/<key>?token=...  — stream the file back
 *
 * Authorization: an HMAC token issued by signLocalToken. The token is bound
 * to (method, key, contentType, ttl). It is intentionally narrow — the same
 * token cannot be used for a different key or method.
 *
 * Production hardening: if NODE_ENV === 'production' and STORAGE_BACKEND is
 * not 'local', this route returns 404. The S3 / Firebase backends are
 * expected to be used in production and never go through this route.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  if (process.env.NODE_ENV === 'production' && process.env.STORAGE_BACKEND && process.env.STORAGE_BACKEND !== 'local') {
    return new NextResponse('Not Found', { status: 404 });
  }
  const { key: keyParts } = await params;
  const key = keyParts.map(decodeURIComponent).join('/');
  const token = req.nextUrl.searchParams.get('token') ?? '';
  const contentType = req.headers.get('content-type') ?? 'application/octet-stream';

  if (!await verifyLocalToken(key, 'PUT', contentType, token)) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
  }

  try {
    const buf = Buffer.from(await req.arrayBuffer());
    if (buf.length > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 50 MB)' }, { status: 413 });
    }
    await writeLocalFile(key, buf);
    return NextResponse.json({ success: true, key, size: buf.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  if (process.env.NODE_ENV === 'production' && process.env.STORAGE_BACKEND && process.env.STORAGE_BACKEND !== 'local') {
    return new NextResponse('Not Found', { status: 404 });
  }
  const { key: keyParts } = await params;
  const key = keyParts.map(decodeURIComponent).join('/');
  const token = req.nextUrl.searchParams.get('token') ?? '';

  if (!await verifyLocalToken(key, 'GET', '', token)) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
  }

  if (!await localFileExists(key)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const buf = await readLocalFile(key);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
