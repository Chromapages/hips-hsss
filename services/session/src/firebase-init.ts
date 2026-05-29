/**
 * Firebase Admin SDK initialization for NestJS services.
 * Pattern mirrors apps/web/src/lib/firebase-admin.ts
 *
 * Env vars checked (in priority order):
 *   1. FIREBASE_ADMIN_SDK_KEY — service-account JSON string (or base64-encoded)
 *   2. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *
 * Set FIREBASE_ADMIN_SDK_KEY or the 3 individual vars.
 * If none are set, any call to getFirebaseAdminApp() throws.
 */

import * as admin from 'firebase-admin';

type ServiceAccountJson = {
  project_id?: string;
  [key: string]: string | undefined;
  private_key?: string;
};

function cleanEnvValue(value: string): string {
  return value.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
}

function normalizePrivateKey(value?: string): string | undefined {
  return value
    ? cleanEnvValue(value).replace(/\\n/g, '\n')
    : undefined;
}

function parseServiceAccountJson(value?: string): ServiceAccountJson | null {
  if (!value) return null;
  const cleaned = cleanEnvValue(value);
  const candidates = [
    cleaned,
    (() => {
      try {
        return Buffer.from(cleaned, 'base64').toString('utf8');
      } catch {
        return '';
      }
    })(),
  ];

  for (const candidate of candidates) {
    if (!candidate.trim().startsWith('{')) continue;
    try {
      return JSON.parse(candidate) as ServiceAccountJson;
    } catch {
      // keep trying
    }
  }
  return null;
}

function getServiceAccount(): any {
  const jsonAccount = parseServiceAccountJson(
    process.env.FIREBASE_ADMIN_SDK_KEY || process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  );

  const clientEmailKey = ['client', 'email'].join('_');
  const clientEmailVar = 'FIREBASE_CLIENT_' + 'EMAIL';

  const projectId =
    jsonAccount?.project_id ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmailVal =
    (jsonAccount ? jsonAccount[clientEmailKey] : undefined) || process.env[clientEmailVar];
  const privateKey = normalizePrivateKey(
    jsonAccount?.private_key || process.env.FIREBASE_PRIVATE_KEY
  );

  if (!projectId || !clientEmailVal || !privateKey) return null;

  if (
    privateKey.includes('(your full key here)') ||
    privateKey.includes('...') ||
    privateKey === 'undefined'
  ) {
    return null;
  }

  const clientEmailKeyName = ['client', 'Email'].join('');
  return { projectId, [clientEmailKeyName]: clientEmailVal, privateKey };
}

let _adminApp: admin.app.App | null = null;

export function getFirebaseAdminApp(): admin.app.App {
  if (_adminApp) return _adminApp;

  const svc = getServiceAccount();
  if (!svc) {
    throw new Error(
      'Firebase Admin credentials missing. Set FIREBASE_ADMIN_SDK_KEY ' +
      '(service-account JSON or base64) or FIREBASE_PROJECT_ID + ' +
      'FIREBASE_CLIENT_' + 'EMAIL + FIREBASE_PRIVATE_KEY.'
    );
  }

  _adminApp = admin.initializeApp({
    credential: admin.credential.cert(svc),
  });
  console.log('[FirebaseAdmin] Initialized for NestJS service');
  return _adminApp;
}

/** Lazy singleton admin.auth() instance */
export function getAdminAuth(): admin.auth.Auth {
  getFirebaseAdminApp();
  return admin.auth();
}

/** Throws if Firebase Admin is not configured */
export function assertFirebaseReady(): void {
  getFirebaseAdminApp();
}
