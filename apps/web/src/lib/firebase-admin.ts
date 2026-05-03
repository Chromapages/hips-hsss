import * as admin from 'firebase-admin';

type ServiceAccountJson = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function cleanEnvValue(value: string) {
  return value.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
}

function normalizePrivateKey(value?: string) {
  return value ? cleanEnvValue(value).replace(/\\n/g, '\n') : undefined;
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
      // Keep trying other supported encodings.
    }
  }

  return null;
}

function getServiceAccount() {
  const jsonAccount = parseServiceAccountJson(
    process.env.FIREBASE_ADMIN_SDK_KEY || process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  );

  const projectId =
    jsonAccount?.project_id ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = jsonAccount?.client_email || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(jsonAccount?.private_key || process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin credentials are missing. Set FIREBASE_ADMIN_SDK_KEY to the service-account JSON, or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
    );
  }

  if (privateKey.includes('(your full key here)') || privateKey.includes('...')) {
    throw new Error(
      'Firebase Admin private key is still a placeholder. Replace FIREBASE_PRIVATE_KEY or use FIREBASE_ADMIN_SDK_KEY with the full service-account JSON.'
    );
  }

  return { projectId, clientEmail, privateKey };
}

function initAdmin() {
  if (admin.apps.length) return;

  const serviceAccount = getServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('[FirebaseAdmin] Initialized successfully');
}

// Export getters to prevent top-level evaluation errors
export const getAdminAuth = () => {
  initAdmin();
  return admin.auth();
};

export const getDb = () => {
  initAdmin();
  return admin.firestore();
};

// Legacy support if needed, but usage should move to getDb()
export const db = {
  collection: (name: string) => getDb().collection(name),
  runTransaction: <T>(cb: (transaction: admin.firestore.Transaction) => Promise<T>) =>
    getDb().runTransaction(cb),
};

export const adminAuth = {
  setCustomUserClaims: (uid: string, claims: Record<string, unknown>) =>
    getAdminAuth().setCustomUserClaims(uid, claims),
  verifyIdToken: (token: string) => getAdminAuth().verifyIdToken(token),
};

export const isFirebaseAdminReady = () => !!admin.apps.length;
