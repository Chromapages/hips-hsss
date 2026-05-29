import { SignJWT, jwtVerify } from "jose";

const SESSION_SECRET = (() => {
  const secret = process.env.SESSION_SERVICE_SECRET;
  if (!secret) {
    throw new Error(
      'SESSION_SERVICE_SECRET environment variable is required. ' +
      'Session tokens cannot be signed without a secret key. ' +
      'Set SESSION_SERVICE_SECRET in your environment configuration.'
    );
  }
  if (secret.length < 32) {
    throw new Error(
      'SESSION_SERVICE_SECRET must be at least 32 characters. ' +
      'Generate a secure secret: node -e "console.log(require("crypto").randomBytes(32).toString("hex"))"'
    );
  }
  return new TextEncoder().encode(secret);
})();

/**
 * Signs an opaque session token that contains only the session reference.
 * No user identity is included in this token.
 */
export async function signSessionToken(sessionRef: string) {
  return await new SignJWT({ ref: sessionRef })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h") // Session tokens are short-lived
    .sign(SESSION_SECRET);
}

/**
 * Verifies an opaque session token.
 */
export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload as { ref: string; exp?: number };
  } catch {
    return null;
  }
}
