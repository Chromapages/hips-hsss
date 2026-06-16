'use client';

import { AuthGuard } from './AuthGuard';
import type { AllowedRole } from './AuthGuard';

export function ClientShell({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
}) {
  return <AuthGuard allowedRoles={allowedRoles}>{children}</AuthGuard>;
}
