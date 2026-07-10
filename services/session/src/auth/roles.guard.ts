import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { getAdminAuth } from '../firebase-init.js';
import { getAuthoritativeRole } from './commerce-role.js';

export enum UserRole {
  PARTICIPANT = 'PARTICIPANT',
  FACILITATOR = 'FACILITATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required role(s) on a route handler or controller.
 * Usage: @Roles(UserRole.ADMIN)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles required — allow
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = typeof request.headers.get === 'function'
      ? request.headers.get('authorization')
      : request.headers.authorization;
    const idToken = authHeader?.replace('Bearer ', '');

    if (!idToken) {
      throw new UnauthorizedException('Missing Firebase ID token');
    }

    try {
      const auth = getAdminAuth();
      if (!auth) {
        throw new UnauthorizedException('Authentication service unavailable');
      }
      const decoded = await auth.verifyIdToken(idToken, true);
      const role = await getAuthoritativeRole(decoded.uid) as UserRole | null;

      if (!role || !requiredRoles.includes(role)) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // Attach verified identity to request for downstream use
      request['userUid'] = decoded.uid;
      request['userRole'] = role;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }
}
