import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.warn("CSP Violation reported:", JSON.stringify(body));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "failed to parse report" }, { status: 400 });
  }
}
