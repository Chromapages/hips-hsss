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
  return value ? cleanEnvValue(value).replace(/\\/g, '\\n') : undefined;
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
    return null;
  }

  if (
    privateKey.includes('(your full key here)') ||
    privateKey.includes('...') ||
    privateKey === 'undefined'
  ) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

let _adminApp: admin.app.App | null = null;

function initAdmin(): admin.app.App {
  if (_adminApp) return _adminApp;

  const serviceAccount = getServiceAccount();

  if (!serviceAccount) {
    throw new Error(
      'Firebase Admin credentials are missing. Set FIREBASE_ADMIN_SDK_KEY to the service-account JSON, ' +
      'or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY. ' +
      'Alternatively, set NONE of these to skip Firebase Admin initialization entirely for local development.'
    );
  }

  _adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('[FirebaseAdmin] Initialized successfully');
  return _adminApp;
}

// Lazy auth instance
let _auth: admin.auth.Auth | null = null;
const getAuth = (): admin.auth.Auth => {
  initAdmin();
  if (!_auth) _auth = admin.auth();
  return _auth;
};

// Lazy firestore instance
let _db: admin.firestore.Firestore | null = null;
const getDb = (): admin.firestore.Firestore => {
  initAdmin();
  if (!_db) _db = admin.firestore();
  return _db;
};

// Legacy support — only created when accessed (lazy)
export const db = {
  collection: (name: string) => getDb().collection(name),
  runTransaction: <T>(cb: (tx: admin.firestore.Transaction) => Promise<T>) =>
    getDb().runTransaction(cb),
};

export const adminAuth = {
  setCustomUserClaims: (uid: string, claims: Record<string, unknown>) =>
    getAuth().setCustomUserClaims(uid, claims),
  verifyIdToken: (token: string) => getAuth().verifyIdToken(token),
};

export const getAdminAuth = () => getAuth();
export { getDb };

export const isFirebaseAdminReady = () => _adminApp !== null;