import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/firebase-admin";
import { adminAuth } from "@/lib/firebase-admin";
import { signSessionToken } from "@/lib/session-auth";
import { isAfter, subMinutes, addMinutes } from "date-fns";

const tokenSchema = z.object({
  sessionId: z.string(), // Firestore IDs are strings
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await adminAuth.verifyIdToken(token);

    // 2. Validate Input
    const body = await req.json();
    const result = tokenSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { sessionId } = result.data;

    // 3. Fetch Session from Firestore
    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const session = sessionDoc.data();

    if (!session || !session.sessionTokenRef) {
      return NextResponse.json({ error: "Session is invalid" }, { status: 404 });
    }

    // Security: Ensure session belongs to the user
    if (session.userId !== payload.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Time Window Check: Can only get token 10 mins before or during session
    const now = new Date();
    const startTime = subMinutes(new Date(session.startsAt), 10);
    const endTime = addMinutes(new Date(session.endsAt), 10);

    if (isAfter(now, endTime) || !isAfter(now, startTime)) {
      return NextResponse.json({ 
        error: "Session window is not active",
        details: "Access opens 10 minutes before the scheduled start."
      }, { status: 403 });
    }

    // 4. Issue Opaque Session Token
    // We sign the sessionTokenRef, which is a random UUID with no PII.
    const sessionToken = await signSessionToken(session.sessionTokenRef);

    return NextResponse.json({
      success: true,
      token: sessionToken,
    });
  } catch (error: unknown) {
    console.error("Session token issuance failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
