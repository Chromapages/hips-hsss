/**
 * POST /api/auth/mfa/setup
 *
 * Step 1 of enrollment. Returns the otpauth:// URI and a base64 PNG of the
 * QR code. Server stores the encrypted TOTP secret on the user record
 * (mfaSecretEnc/Iv/Tag) but does NOT set mfaEnabled=true — that happens
 * in the verify step after the user proves they can produce a valid code.
 *
 * Auth: requires an authenticated admin or facilitator (Firebase ID token
 * in Authorization header) with mfaEnabled=false. Users who already have
 * MFA enrolled must call /api/auth/mfa/backup-codes/regenerate instead.
 */

import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/request-auth';
import { prisma } from '@/lib/prisma';
import { ADMIN_ROLES, FACILITATOR_ROLES, type Role } from '@/lib/roles';
import {
  buildOtpAuthUri,
  encryptTotpSecret,
  generateTotpSecret,
} from '@/lib/mfa';
import { logger, safeError } from '@/lib/logger';

const setupSchema = z.object({
  email: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (auth.error) return auth.error;

  const role = auth.user.role as Role;
  const allowedRoles: readonly Role[] = [...ADMIN_ROLES, ...FACILITATOR_ROLES];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'MFA is only available to admin and facilitator accounts' }, { status: 403 });
  }

  let body: z.infer<typeof setupSchema> = {};
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = setupSchema.safeParse(json);
    if (parsed.success) body = parsed.data;
  } catch {
    // body is optional for this endpoint
  }

  // Refuse re-enrollment without explicit confirmation.
  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: { id: true, email: true, mfaEnabled: true, mfaSecretEnc: true },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  if (user.mfaEnabled) {
    return NextResponse.json({ error: 'MFA is already enrolled. Re-enrollment requires /api/auth/mfa/disable first.' }, { status: 409 });
  }

  const secret = generateTotpSecret();
  const enc = encryptTotpSecret(secret);
  const otpauthUri = buildOtpAuthUri({
    secret,
    email: body.email ?? user.email,
    issuer: 'HIPS',
  });

  // Persist the encrypted secret (but mfaEnabled stays false until verify).
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mfaSecretEnc: enc.ciphertext,
        mfaSecretIv: enc.iv,
        mfaSecretTag: enc.tag,
      },
    });
  } catch (err) {
    logger.error('MFA setup: failed to persist secret', { error: safeError(err) });
    return NextResponse.json({ error: 'Failed to persist MFA secret' }, { status: 500 });
  }

  // QR code as a data: URL. The client renders <img src={qrDataUrl} />.
  let qrDataUrl: string;
  try {
    qrDataUrl = await QRCode.toDataURL(otpauthUri, { errorCorrectionLevel: 'M', margin: 2, scale: 6 });
  } catch (err) {
    logger.error('MFA setup: QR generation failed', { error: safeError(err) });
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }

  // Return the secret in the response so the client can show it as a
  // manual-entry fallback (some users prefer typing the secret). The
  // secret is one-time-use — once mfaEnabled becomes true, it's only
  // stored encrypted in the DB.
  return NextResponse.json({
    otpauthUri,
    qrDataUrl,
    secret, // for manual entry / recovery; client must not log this
  });
}
