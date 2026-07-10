import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  PARTICIPANT = 'PARTICIPANT',
  FACILITATOR = 'FACILITATOR',
  ADMIN = 'ADMIN',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // VaultAuthGuard must run first and set request.user — if not, deny access
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const role = user.role;

    if (!role || !requiredRoles.includes(role)) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }
}
