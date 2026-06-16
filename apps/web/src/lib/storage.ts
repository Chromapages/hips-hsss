/**
 * Storage abstraction — signed-URL pattern.
 *
 * The web app never proxies file bytes through Next.js. Instead, clients
 * request a signed URL here, upload (or download) directly to/from the
 * configured storage backend, and the record on the database holds only
 * the storage key + metadata.
 *
 * Backends supported (selected via STORAGE_BACKEND env var):
 *  - "s3"       : AWS S3 (or any S3-compatible API: R2, MinIO, GCS Interop)
 *  - "local"    : Local filesystem for development (writes to .local-storage/)
 *  - "firebase" : Firebase Storage (uses Admin SDK to sign)
 *
 * Required env vars by backend:
 *   S3:      S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
 *   Local:   STORAGE_LOCAL_DIR (default: .local-storage)
 *   Firebase: FIREBASE_STORAGE_BUCKET
 *
 * Optional:
 *   STORAGE_PUBLIC_BASE_URL — for generating public-style URLs in dev
 *   STORAGE_URL_TTL_SECONDS — signed URL lifetime (default 600 = 10 min)
 */

import 'server-only';
import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export type PresignResult = {
  /** The storage key the client should PUT to (or GET from). */
  key: string;
  /** Fully qualified URL the client should use. */
  url: string;
  /** Required HTTP method. */
  method: 'PUT' | 'GET' | 'POST';
  /** Required HTTP headers (e.g. Content-Type for uploads). */
  headers: Record<string, string>;
  /** Optional form fields (for S3 POST policy). */
  fields?: Record<string, string>;
  /** When the URL expires (ISO timestamp). */
  expiresAt: string;
};

const DEFAULT_TTL_SECONDS = 600;
const MAX_KEY_LENGTH = 512;

function getTtl(): number {
  const raw = process.env.STORAGE_URL_TTL_SECONDS;
  if (!raw) return DEFAULT_TTL_SECONDS;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_SECONDS;
}

function getBackend(): 's3' | 'local' | 'firebase' | 'none' {
  const raw = (process.env.STORAGE_BACKEND ?? '').toLowerCase();
  if (raw === 's3' || raw === 'local' || raw === 'firebase') return raw;
  // Fall back to local dev storage when nothing is configured. This is a
  // no-op on a serverless deploy without env vars; the API endpoint
  // surfaces a 503 to the client in that case.
  if (process.env.NODE_ENV !== 'production') return 'local';
  return 'none';
}

/**
 * Validate a key: no traversal, no `..`, no leading slash, no whitespace,
 * and bounded length. Always prefix a per-record namespace from the caller.
 */
export function buildKey(namespace: string, filename: string): string {
  if (!namespace) throw new Error('storage.buildKey requires a namespace');
  const safeNs = namespace.replace(/[^a-zA-Z0-9_\-:/]/g, '').slice(0, 200);
  const ext = path.extname(filename).slice(0, 16);
  const base = path
    .basename(filename, path.extname(filename))
    .replace(/[^a-zA-Z0-9_\-]/g, '-')
    .slice(0, 80);
  const random = crypto.randomBytes(8).toString('hex');
  const key = `${safeNs}/${Date.now()}-${random}-${base}${ext}`;
  if (key.length > MAX_KEY_LENGTH) {
    throw new Error(`storage key too long (${key.length} > ${MAX_KEY_LENGTH})`);
  }
  return key;
}

export function getStorageConfigStatus(): { backend: string; ready: boolean; missing: string[] } {
  const backend = getBackend();
  const missing: string[] = [];
  if (backend === 's3') {
    for (const v of ['S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']) {
      if (!process.env[v]) missing.push(v);
    }
  } else if (backend === 'firebase') {
    if (!process.env.FIREBASE_STORAGE_BUCKET && !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
      missing.push('FIREBASE_STORAGE_BUCKET');
    }
  } else if (backend === 'none') {
    missing.push('STORAGE_BACKEND (or S3_*, or FIREBASE_STORAGE_BUCKET)');
  }
  return { backend, ready: missing.length === 0, missing };
}

/**
 * Sign a URL for a direct upload.
 *
 * @param key     The storage key. Use buildKey() to derive one safely.
 * @param contentType  MIME type the client will send.
 * @param contentLength  Optional pre-declared content length for S3 sigv4.
 */
export async function signUploadUrl(
  key: string,
  contentType: string,
  contentLength?: number
): Promise<PresignResult> {
  const ttl = getTtl();
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  const backend = getBackend();

  if (backend === 's3') {
    return signS3Upload(key, contentType, contentLength, ttl, expiresAt);
  }
  if (backend === 'local') {
    return signLocalUpload(key, contentType, ttl, expiresAt);
  }
  if (backend === 'firebase') {
    return signFirebaseUpload(key, contentType, ttl, expiresAt);
  }
  throw new Error('Storage backend is not configured');
}

/**
 * Sign a URL for a direct download. The signed URL authorizes only this
 * specific key for the configured TTL.
 */
export async function signDownloadUrl(key: string): Promise<PresignResult> {
  const ttl = getTtl();
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  const backend = getBackend();

  if (backend === 's3') {
    return signS3Download(key, ttl, expiresAt);
  }
  if (backend === 'local') {
    return signLocalDownload(key, ttl, expiresAt);
  }
  if (backend === 'firebase') {
    return signFirebaseDownload(key, ttl, expiresAt);
  }
  throw new Error('Storage backend is not configured');
}

// ─── S3 (and S3-compatible) ─────────────────────────────────────────────────

async function signS3Upload(
  key: string,
  contentType: string,
  contentLength: number | undefined,
  ttl: number,
  expiresAt: string
): Promise<PresignResult> {
  const bucket = required('S3_BUCKET');
  const region = required('S3_REGION');
  const accessKey = required('S3_ACCESS_KEY_ID');
  const secretKey = required('S3_SECRET_ACCESS_KEY');
  const endpoint = process.env.S3_ENDPOINT; // For R2 / MinIO; omit for AWS

  const host = endpoint
    ? endpoint.replace(/^https?:\/\//, '')
    : `${bucket}.s3.${region}.amazonaws.com`;
  const protocol = endpoint?.startsWith('https') || !endpoint ? 'https' : 'http';
  const url = `${protocol}://${host}/${encodeURI(key)}`;

  const amzDate = toAmzDate(new Date());
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const signedHeaders = contentLength != null ? 'host;x-amz-content-sha256;x-amz-date' : 'host';

  const payloadHash = contentLength != null ? 'UNSIGNED-PAYLOAD' : 'UNSIGNED-PAYLOAD';
  const canonicalHeaders = contentLength != null
    ? `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`
    : `host:${host}\nx-amz-date:${amzDate}\n`;

  const params = new URLSearchParams({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${accessKey}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(ttl),
    'X-Amz-SignedHeaders': signedHeaders,
  });
  params.sort();
  const canonicalUri = `/${encodeURI(key)}`;
  const canonicalRequest = [
    'PUT',
    canonicalUri,
    params.toString(),
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');

  const signingKey = getSignatureKey(secretKey, dateStamp, region, 's3');
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
  params.append('X-Amz-Signature', signature);

  return {
    key,
    url: `${url}?${params.toString()}`,
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      ...(contentLength != null ? { 'x-amz-content-sha256': payloadHash } : {}),
      'x-amz-date': amzDate,
    },
    expiresAt,
  };
}

async function signS3Download(key: string, ttl: number, expiresAt: string): Promise<PresignResult> {
  const bucket = required('S3_BUCKET');
  const region = required('S3_REGION');
  const accessKey = required('S3_ACCESS_KEY_ID');
  const secretKey = required('S3_SECRET_ACCESS_KEY');
  const endpoint = process.env.S3_ENDPOINT;

  const host = endpoint
    ? endpoint.replace(/^https?:\/\//, '')
    : `${bucket}.s3.${region}.amazonaws.com`;
  const protocol = endpoint?.startsWith('https') || !endpoint ? 'https' : 'http';
  const url = `${protocol}://${host}/${encodeURI(key)}`;

  const amzDate = toAmzDate(new Date());
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const canonicalRequest = [
    'GET',
    `/${encodeURI(key)}`,
    `X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${encodeURIComponent(`${accessKey}/${credentialScope}`)}&X-Amz-Date=${amzDate}&X-Amz-Expires=${ttl}&X-Amz-SignedHeaders=host`,
    `host:${host}\n`,
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');

  const signingKey = getSignatureKey(secretKey, dateStamp, region, 's3');
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const params = new URLSearchParams({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${accessKey}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(ttl),
    'X-Amz-SignedHeaders': 'host',
    'X-Amz-Signature': signature,
  });

  return {
    key,
    url: `${url}?${params.toString()}`,
    method: 'GET',
    headers: {},
    expiresAt,
  };
}

function getSignatureKey(key: string, dateStamp: string, region: string, service: string) {
  const kDate = crypto.createHmac('sha256', `AWS4${key}`).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
  return crypto.createHmac('sha256', kService).update('aws4_request').digest();
}

function toAmzDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

// ─── Local filesystem (development only) ────────────────────────────────────

async function signLocalUpload(
  key: string,
  contentType: string,
  _ttl: number,
  expiresAt: string
): Promise<PresignResult> {
  const baseUrl = process.env.STORAGE_PUBLIC_BASE_URL ?? '';
  // The local API route verifies an HMAC token derived from the key + ttl.
  const token = await signLocalToken(key, 'PUT', contentType);
  return {
    key,
    url: `${baseUrl}/api/storage/local/${encodeURI(key)}?token=${token}`,
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    expiresAt,
  };
}

async function signLocalDownload(key: string, _ttl: number, expiresAt: string): Promise<PresignResult> {
  const baseUrl = process.env.STORAGE_PUBLIC_BASE_URL ?? '';
  const token = await signLocalToken(key, 'GET', '');
  return {
    key,
    url: `${baseUrl}/api/storage/local/${encodeURI(key)}?token=${token}`,
    method: 'GET',
    headers: {},
    expiresAt,
  };
}

async function signLocalToken(key: string, method: 'PUT' | 'GET' | 'POST', contentType: string): Promise<string> {
  const secret = process.env.STORAGE_LOCAL_HMAC_SECRET ?? process.env.SESSION_SERVICE_SECRET ?? 'dev-only-secret';
  const issuedAt = Date.now();
  const payload = `${method}\n${key}\n${contentType}\n${issuedAt}`;
  const mac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${issuedAt}.${mac}`;
}

export async function verifyLocalToken(key: string, method: 'PUT' | 'GET' | 'POST', contentType: string, token: string): Promise<boolean> {
  const secret = process.env.STORAGE_LOCAL_HMAC_SECRET ?? process.env.SESSION_SERVICE_SECRET ?? 'dev-only-secret';
  const [issuedAtStr, mac] = token.split('.', 2);
  if (!issuedAtStr || !mac) return false;
  const issuedAt = Number.parseInt(issuedAtStr, 10);
  if (!Number.isFinite(issuedAt) || issuedAt <= 0) return false;

  const ttl = getTtl();
  if (Date.now() > issuedAt + ttl * 1000) {
    return false; // Token already expired
  }
  // Clock drift defense
  if (issuedAt > Date.now() + 5000) {
    return false;
  }

  const payload = `${method}\n${key}\n${contentType}\n${issuedAt}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(mac, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export function getLocalStorageDir(): string {
  return process.env.STORAGE_LOCAL_DIR ?? '.local-storage';
}

export async function writeLocalFile(key: string, body: Buffer): Promise<void> {
  const dir = path.join(getLocalStorageDir(), path.dirname(key));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(getLocalStorageDir(), key), body);
}

export async function readLocalFile(key: string): Promise<Buffer> {
  return fs.readFile(path.join(getLocalStorageDir(), key));
}

export async function localFileExists(key: string): Promise<boolean> {
  try {
    await fs.access(path.join(getLocalStorageDir(), key));
    return true;
  } catch {
    return false;
  }
}

// ─── Firebase Storage (best-effort, minimal) ────────────────────────────────
// We delegate signing to the Admin SDK; only the URL + expiry are returned.

async function signFirebaseUpload(
  key: string,
  contentType: string,
  _ttl: number,
  expiresAt: string
): Promise<PresignResult> {
  const { getStorage } = await import('firebase-admin/storage');
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '';
  if (!bucketName) throw new Error('FIREBASE_STORAGE_BUCKET not configured');
  const file = getStorage().bucket(bucketName).file(key);
  const expires = Date.now() + getTtl() * 1000;
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires,
    contentType,
  });
  return { key, url, method: 'PUT', headers: { 'Content-Type': contentType }, expiresAt };
}

async function signFirebaseDownload(key: string, _ttl: number, expiresAt: string): Promise<PresignResult> {
  const { getStorage } = await import('firebase-admin/storage');
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '';
  if (!bucketName) throw new Error('FIREBASE_STORAGE_BUCKET not configured');
  const file = getStorage().bucket(bucketName).file(key);
  const expires = Date.now() + getTtl() * 1000;
  const [url] = await file.getSignedUrl({ version: 'v4', action: 'read', expires });
  return { key, url, method: 'GET', headers: {}, expiresAt };
}
