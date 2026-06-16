import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, errors as joseErrors } from 'jose';

/**
 * The set of scopes this guard accepts. Layer 2 widening — previously only
 * `safety:report`. The mitigation route now uses `safety:mitigate` (issued
 * by the web app via lib/auth/serviceToken.ts).
 */
const ACCEPTED_SCOPES = new Set<string>(['safety:report', 'safety:mitigate']);

@Injectable()
export class ServiceAuthGuard implements CanActivate {
  private readonly secret: Uint8Array;

  constructor(private configService: ConfigService) {
    // Layer 6: dual-secret support. The PRIMARY is SERVICE_JWT_SECRET (the
    // central key the web app signs with). The legacy SAFETY_SERVICE_SECRET
    // is still accepted as a SECONDARY during the rotation window.
    const primary = this.configService.get<string>('SERVICE_JWT_SECRET');
    const secondary = this.configService.get<string>('SAFETY_SERVICE_SECRET');
    if (!primary && !secondary) {
      throw new Error('SERVICE_JWT_SECRET (or legacy SAFETY_SERVICE_SECRET) is required');
    }
    // We try primary first at verify time, so encode both.
    this.secret = new TextEncoder().encode(primary ?? secondary ?? '');
    this.secondarySecret = secondary ? new TextEncoder().encode(secondary) : null;
  }

  private readonly secondarySecret: Uint8Array | null;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid service token');
    }

    const token = authHeader.split(' ')[1];

    // Layer 6: try both secrets. The first successful verify wins.
    let payload: any;
    try {
      const result = await jwtVerify(token, this.secret, {
        issuer: 'hips-web',
        audience: 'hips-safety',
        clockTolerance: 5,
      });
      payload = result.payload;
    } catch (primaryErr) {
      if (!this.secondarySecret) {
        throw this.toUnauthorized(primaryErr, 'invalid_signature');
      }
      try {
        const result = await jwtVerify(token, this.secondarySecret, {
          issuer: 'hips-web',
          audience: 'hips-safety',
          clockTolerance: 5,
        });
        payload = result.payload;
      } catch (secondaryErr) {
        throw this.toUnauthorized(secondaryErr, 'invalid_signature');
      }
    }

    if (payload.token_use !== 'service') {
      throw new ForbiddenException('Token is not a service token');
    }
    if (typeof payload.scope !== 'string' || !ACCEPTED_SCOPES.has(payload.scope)) {
      throw new ForbiddenException(`Token scope "${payload.scope}" is not accepted by this endpoint`);
    }

    request['serviceRef'] = payload.ref;
    request['serviceScope'] = payload.scope;
    request['serviceJti'] = payload.jti;
    return true;
  }

  private toUnauthorized(err: unknown, fallback: 'invalid_signature'): UnauthorizedException {
    if (err instanceof joseErrors.JWTExpired) {
      return new UnauthorizedException('expired');
    }
    if (err instanceof joseErrors.JWSSignatureVerificationFailed) {
      return new UnauthorizedException('invalid_signature');
    }
    if (err instanceof joseErrors.JWTInvalid) {
      return new UnauthorizedException('malformed');
    }
    return new UnauthorizedException(fallback);
  }
}