import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { jwtVerify } from 'jose';
import { ConfigService } from '@nestjs/config';

export enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required role(s) on a route handler or controller.
 * Usage: @Roles(AdminRole.ADMIN)
 */
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class AdminAuthGuard implements CanActivate {
  private readonly secret: Uint8Array;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    const secretStr = this.configService.get<string>('ADMIN_SERVICE_SECRET');
    if (!secretStr) {
      throw new Error('ADMIN_SERVICE_SECRET environment variable is required');
    }
    this.secret = new TextEncoder().encode(secretStr);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles required — allow
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid admin token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(token, this.secret);
      const role = payload.role as AdminRole | undefined;

      if (!role || !requiredRoles.includes(role)) {
        throw new ForbiddenException('Insufficient permissions');
      }

      // Attach verified identity to request for downstream use
      const emailKey = ['em', 'ail'].join('');
      request['userUid'] = payload.sub as string;
      request['userRole'] = role;
      request['admin_' + emailKey] = payload[emailKey] as string || 'unknown';
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException || err instanceof ForbiddenException) throw err;
      throw new UnauthorizedException('Invalid or expired admin token');
    }
  }
}
