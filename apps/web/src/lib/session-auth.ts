import { SignJWT, jwtVerify } from "jose";

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SERVICE_SECRET || "default-secret-change-me-in-production"
);

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
