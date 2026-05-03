import { jwtVerify, importX509 } from 'jose';

const FIREBASE_PUBLIC_KEYS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let publicKeysCache: { keys: Record<string, string>; expires: number } | null = null;

async function getPublicKeys() {
  const now = Date.now();
  if (publicKeysCache && publicKeysCache.expires > now) {
    return publicKeysCache.keys;
  }

  const response = await fetch(FIREBASE_PUBLIC_KEYS_URL);
  const cacheControl = response.headers.get('cache-control');
  const maxAgeMatch = cacheControl?.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch?.[1] ? parseInt(maxAgeMatch[1], 10) : 3600;

  const keys = await response.json();
  publicKeysCache = {
    keys,
    expires: now + maxAge * 1000,
  };

  return keys;
}

export async function verifyFirebaseIdToken(token: string) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not configured');
  }

  const publicKeys = await getPublicKeys();
  
  // Need to decode the header to get the kid (Key ID)
  const encodedHeader = token.split('.')[0];
  if (!encodedHeader) {
    throw new Error('Invalid token header');
  }

  const header = JSON.parse(atob(encodedHeader));
  const kid = header.kid;
  const x509 = publicKeys[kid];

  if (!x509) {
    throw new Error('Invalid Key ID');
  }

  const publicKey = await importX509(x509, 'RS256');

  const { payload } = await jwtVerify(token, publicKey, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  // Additional Firebase checks
  const now = Math.floor(Date.now() / 1000);
  if (payload.auth_time && typeof payload.auth_time === 'number' && payload.auth_time > now) {
    throw new Error('Token used before auth_time');
  }

  return payload;
}
