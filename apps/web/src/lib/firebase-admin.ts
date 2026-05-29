import * as admin from 'firebase-admin';
import * as fs from 'fs';

type ServiceAccountJson = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function cleanEnvValue(value: string) {
  return value.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
}

function normalizePrivateKey(value?: string) {
  if (!value) return undefined;
  const cleaned = cleanEnvValue(value);
  // .env files store the key with literal \n (two chars). Replace them with real newlines.
  return cleaned.includes('\\n') ? cleaned.replace(/\\n/g, '\n') : cleaned;
}

function tryReadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function parseServiceAccountJson(value?: string): ServiceAccountJson | null {
  if (!value) return null;

  const cleaned = cleanEnvValue(value);
  const candidates: string[] = [];

  // If the value looks like a file path, try to read and parse the file first
  // (covers VPS deployments where FIREBASE_ADMIN_SDK_KEY=/home/deploy/.../firebase-admin.json)
  if (cleaned.includes('/') && (cleaned.endsWith('.json') || cleaned.startsWith('/'))) {
    const fileContents = tryReadFile(cleaned);
    if (fileContents) {
      candidates.push(fileContents);
    }
  }

  // Then try the raw value and base64-decoded value
  candidates.push(cleaned);
  candidates.push(
    (() => {
      try {
        return Buffer.from(cleaned, 'base64').toString('utf8');
      } catch {
        return '';
      }
    })()
  );

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
  const privateKey = jsonAccount?.private_key
    ? normalizePrivateKey(jsonAccount.private_key)
    : normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

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

function initAdmin(): admin.app.App | null {
  // Singleton guard using firebase-admin's own app registry
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }
  if (_adminApp) return _adminApp;

  const serviceAccount = getServiceAccount();

  console.log('[FirebaseAdmin] getServiceAccount result:', serviceAccount ? { projectId: serviceAccount.projectId, clientEmail: serviceAccount.clientEmail, hasKey: !!serviceAccount.privateKey } : null);

  if (!serviceAccount) {
    console.warn(
      '[FirebaseAdmin] Credentials missing — Admin SDK not initialized. ' +
      'Set FIREBASE_ADMIN_SDK_KEY or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY. ' +
      'Set NONE of these to skip initialization entirely for local development.'
    );
    return null;
  }

  try {
    console.log('[FirebaseAdmin] Attempting initializeApp with serviceAccount:', {
      projectId: serviceAccount.projectId,
      clientEmail: serviceAccount.clientEmail,
      privateKeyLength: serviceAccount.privateKey.length,
      privateKeySnippet: serviceAccount.privateKey.substring(0, 40) + '...',
      hasLineBreaks: serviceAccount.privateKey.includes('\n'),
    });
    _adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('[FirebaseAdmin] Initialized successfully');
    return _adminApp;
  } catch (err) {
    console.error('[FirebaseAdmin] Failed to initialize:', err);
    return null;
  }
}

// Lazy auth instance — returns null if Admin SDK failed to init
let _auth: admin.auth.Auth | null = null;
const getAuth = (): admin.auth.Auth | null => {
  const app = initAdmin();
  if (!app) return null;
  if (!_auth) _auth = admin.auth(app);
  return _auth;
};

// Lazy firestore instance — returns null if Admin SDK failed to init
let _db: admin.firestore.Firestore | null = null;
const getDb = (): admin.firestore.Firestore | null => {
  const app = initAdmin();
  if (!app) return null;
  if (!_db) _db = admin.firestore(app);
  return _db;
};

// Legacy support — only created when accessed (lazy); returns null-safe proxy when uninitialized
export const db = {
  collection: (name: string) => {
    const instance = getDb();
    if (!instance) throw new Error('Firebase Admin SDK not initialized');
    return instance.collection(name);
  },
  runTransaction: <T>(cb: (tx: admin.firestore.Transaction) => Promise<T>) => {
    const instance = getDb();
    if (!instance) throw new Error('Firebase Admin SDK not initialized');
    return instance.runTransaction(cb);
  },
};

export const adminAuth = {
  setCustomUserClaims: (uid: string, claims: Record<string, unknown>) => {
    const auth = getAuth();
    if (!auth) {
      console.warn('[FirebaseAdmin] adminAuth unavailable — credentials missing');
      return Promise.resolve({});
    }
    return auth.setCustomUserClaims(uid, claims);
  },
  verifyIdToken: (token: string) => {
    const auth = getAuth();
    if (!auth) {
      console.warn('[FirebaseAdmin] adminAuth unavailable — credentials missing');
      return Promise.reject(new Error('Firebase Admin SDK not initialized'));
    }
    return auth.verifyIdToken(token);
  },
};

export const getAdminAuth = () => getAuth();
export { getDb };

export const isFirebaseAdminReady = () => {
  if (_adminApp !== null) return true;
  // Try to initialize on demand — handles case where check is called before getAuth/getDb
  initAdmin();
  return _adminApp !== null;
};