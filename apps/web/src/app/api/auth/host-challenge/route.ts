import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({ code: z.string().min(1).max(64) });

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const secret = process.env.HOST_ACCESS_CODE || 'HIPS-HOST-2025';
    const valid = parsed.data.code.toUpperCase() === secret.toUpperCase();
    return NextResponse.json({ ok: valid }, { status: valid ? 200 : 403 });
  } catch (error) {
    return NextResponse.json({ error: 'internal_server_error' }, { status: 500 });
  }
}
