import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { writeAuditEvent } from '@/lib/admin-audit';
import { getAdminAuth } from '@/lib/firebase-admin';
import { canAssignRole } from '@/lib/permissions';
import { getPrisma } from '@/lib/prisma';
import { type Role } from '@/lib/roles';
import { verifySudoToken, sudoRequiredResponse } from '@/lib/sudo';
import { revokeAllUserSessions } from '@/lib/auth/revocation';
import { logSecurityEvent } from '@/lib/security/audit';

const roleChangeSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['PARTICIPANT', 'FACILITATOR', 'ADMIN']),
});

function auditContext(req: NextRequest) {
  return {
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
  };
}

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const users = await getPrisma().user.findMany({
      where: { deletedAt: null },
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: {
        firebaseUid: true,
        email: true,
        role: true,
        suspendedAt: true,
        suspensionReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.firebaseUid,
        email: user.email,
        role: user.role,
        suspendedAt: user.suspendedAt,
        suspensionReason: user.suspensionReason,
        displayName: null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const { admin, error } = await requireAdmin(req);
  if (error) return error;

  // Layer 4: role change is destructive — require a valid sudo token.
  // The client must call /api/auth/sudo/request and /api/auth/sudo first.
  const sudo = await verifySudoToken(req);
  if (!sudo) {
    return sudoRequiredResponse();
  }

  const parsed = roleChangeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid role change request' }, { status: 400 });
  }

  const { userId, role } = parsed.data;
  if (admin.uid === userId) {
    return NextResponse.json({ error: 'Cannot change your own role' }, { status: 403 });
  }

  const target = await getPrisma().user.findFirst({
    where: { firebaseUid: userId, deletedAt: null },
    select: { id: true, role: true, suspendedAt: true },
  });
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  if (target.suspendedAt) {
    return NextResponse.json({ error: 'Cannot change role of a suspended user. Unsuspend first.' }, { status: 409 });
  }

  const currentRole = target.role as Role;
  const requestedRole = role as Role;
  const context = auditContext(req);

  if (!canAssignRole(admin.role as Role, currentRole, requestedRole)) {
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'ROLE_CHANGE',
      targetType: 'USER',
      targetId: userId,
      before: { role: currentRole },
      after: { role: requestedRole },
      result: 'FAILURE',
      ...context,
    });
    return NextResponse.json({ error: 'Forbidden role assignment' }, { status: 403 });
  }

  try {
    await getPrisma().user.update({
      where: { id: target.id },
      data: { role: requestedRole },
    });
    await auth.revokeRefreshTokens(userId);
    // Layer 3: bulk-revoke all app-level sessions for this user so a
    // stale token from a different device cannot continue to operate
    // under the new role.
    try {
      await revokeAllUserSessions({ userId: target.id, reason: 'role_change' });
    } catch {
      // Revocation is best-effort; the role change has succeeded.
    }
    const auditWritten = await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'ROLE_CHANGE',
      targetType: 'USER',
      targetId: userId,
      before: { role: currentRole },
      after: { role: requestedRole },
      result: 'SUCCESS',
      ...context,
    });
    if (!auditWritten) {
      throw new Error('Role change audit event could not be persisted');
    }

    await logSecurityEvent({
      eventType: 'ROLE_CHANGED',
      outcome: 'SUCCESS',
      actorId: admin.uid,
      actorRole: admin.role,
      targetType: 'user',
      targetId: userId,
      metadata: { from: currentRole, to: requestedRole },
    });

    return NextResponse.json({ success: true });
  } catch (roleChangeError) {
    try {
      await getPrisma().user.update({
        where: { id: target.id },
        data: { role: currentRole },
      });
    } catch (rollbackError) {
      console.error('CRITICAL: Failed to roll back role after session revocation failure:', rollbackError);
    }
    await writeAuditEvent({
      actorId: admin.uid,
      actorEmail: admin.email || 'unknown',
      action: 'ROLE_CHANGE',
      targetType: 'USER',
      targetId: userId,
      before: { role: currentRole },
      after: { role: requestedRole },
      result: 'FAILURE',
      ...context,
    });
    console.error('Failed to update user role:', roleChangeError);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
