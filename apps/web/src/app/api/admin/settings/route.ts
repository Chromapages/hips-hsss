import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';

const SETTINGS_DOC_ID = 'platform';

const settingsSchema = z.object({
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().max(500).optional(),
  scholarshipDeadline: z.string().datetime().nullable().optional(),
  rateLimitFlag: z.boolean().default(false),
});

/**
 * System settings stored in Firestore (single doc). Used by the admin
 * Settings page and read by middleware to enforce maintenance mode.
 */
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  const db = getDb();
  if (!db) {
    // Offline fallback: derive defaults from env so the page still renders
    return NextResponse.json({
      settings: {
        maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
        maintenanceMessage: process.env.MAINTENANCE_MESSAGE ?? null,
        scholarshipDeadline: process.env.SCHOLARSHIP_DEADLINE_ISO ?? null,
        rateLimitFlag: false,
      },
      source: 'env',
    });
  }

  try {
    const doc = await db.collection('admin_settings').doc(SETTINGS_DOC_ID).get();
    const data = doc.exists ? (doc.data() ?? {}) : {};
    return NextResponse.json({ settings: data, source: 'firestore' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  const parsed = settingsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.format() },
      { status: 400 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Firestore unavailable' }, { status: 503 });
  }

  try {
    const previous = await db.collection('admin_settings').doc(SETTINGS_DOC_ID).get();
    const before = previous.exists ? previous.data() : {};

    const now = new Date().toISOString();
    const next = {
      ...parsed.data,
      updatedAt: now,
      updatedBy: admin.uid,
    };
    await db.collection('admin_settings').doc(SETTINGS_DOC_ID).set(next, { merge: true });

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'SETTINGS_UPDATE',
      targetType: 'SETTINGS',
      targetId: SETTINGS_DOC_ID,
      before: before as any,
      after: next as any,
      result: 'SUCCESS',
      ip,
    });

    return NextResponse.json({ success: true, settings: next });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[SettingsUpdate] error:', message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
