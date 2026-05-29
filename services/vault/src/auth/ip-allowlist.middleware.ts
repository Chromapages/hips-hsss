import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

/**
 * IP Allowlist Middleware for Vault Service
 *
 * Validates incoming request IP against VAULT_IP_ALLOWLIST.
 * Handles x-forwarded-for header carefully - only trusts the leftmost IP
 * when TRUST_X_FORWARDED_FOR is enabled (for cases behind a proxy/load balancer).
 *
 * Returns 403 Forbidden if IP is not in allowlist.
 *
 * Usage: Apply globally in main.ts or per-route via module middleware.
 */
@Injectable()
export class IpAllowlistMiddleware implements NestMiddleware {
  private readonly logger = new Logger(IpAllowlistMiddleware.name);

  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const allowlist = this.configService.get<string>('VAULT_IP_ALLOWLIST');
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';

    // P1.7: In production, refuse to start if IP allowlist is not configured
    if (!allowlist || allowlist.trim() === '') {
      if (nodeEnv === 'production') {
        this.logger.error('VAULT_IP_ALLOWLIST not configured in production — rejecting request');
        res.status(503).json({
          error: 'Service Unavailable',
          message: 'IP allowlist not configured',
        });
        return;
      }
      // In development, allow all but warn
      this.logger.warn('[IpAllowlist] VAULT_IP_ALLOWLIST not set — allowing all (development only)');
      return next();
    }

    const clientIp = this.resolveClientIp(req);
    const allowedIps = allowlist.split(',').map(ip => ip.trim());

    if (!this.isIpAllowed(clientIp, allowedIps)) {
      this.logger.warn(`IP ${clientIp} not in allowlist. Path: ${req.path}`);
      res.status(403).json({
        error: 'Forbidden',
        message: 'IP address not in allowlist',
      });
      return;
    }

    next();
  }

  /**
   * Resolve the real client IP, handling x-forwarded-for carefully.
   *
   * When behind a trusted proxy/load balancer:
   * - Set TRUST_X_FORWARDED_FOR=true env var
   * - Use leftmost IP from x-forwarded-for (original client)
   *
   * Without trusted proxy:
   * - Use req.ip directly (set by Express)
   */
  private resolveClientIp(req: Request): string {
    const trustProxy = this.configService.get<boolean>('TRUST_X_FORWARDED_FOR');

    if (trustProxy && req.headers['x-forwarded-for']) {
      // x-forwarded-for: client, proxy1, proxy2, ...
      // Leftmost is original client (but could be spoofed if not behind trusted proxy)
      const forwardedIps = (req.headers['x-forwarded-for'] as string)
        .split(',')
        .map(ip => ip.trim());
      const clientIp = forwardedIps[0] || 'unknown';

      this.logger.debug(`Resolved IP from x-forwarded-for: ${clientIp}`);
      return clientIp;
    }

    // Fall back to Express's req.ip (set by framework, considers proxy settings)
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  /**
   * Check if IP is allowed.
   * Supports:
   * - Exact match: "192.168.1.1"
   * - CIDR notation: "10.0.0.0/8"
   * - IPv6: "::1", "fe80::/10"
   */
  private isIpAllowed(clientIp: string, allowedIps: string[]): boolean {
    for (const allowed of allowedIps) {
      if (this.compareIps(clientIp, allowed)) {
        return true;
      }
    }
    return false;
  }

  private compareIps(clientIp: string, allowed: string): boolean {
    // Exact match
    if (clientIp === allowed) {
      return true;
    }

    // CIDR matching
    if (allowed.includes('/')) {
      return this.ipInCidr(clientIp, allowed);
    }

    return false;
  }

  private ipInCidr(ip: string, cidr: string): boolean {
    // Simple CIDR comparison for IPv4
    // For production, consider using a library like ip-address or netmask
    try {
      const parts = cidr.split('/');
      if (parts.length !== 2) {
        return false;
      }
      const range = parts[0];
      const bitsStr = parts[1];
      if (!range || !bitsStr) {
        return false;
      }
      const bits = parseInt(bitsStr, 10);

      if (isNaN(bits) || bits < 0 || bits > 32) {
        return false;
      }

      // Convert IPs to integers
      const ipInt = this.ipv4ToInt(ip);
      const rangeInt = this.ipv4ToInt(range);

      if (ipInt === null || rangeInt === null) {
        return false;
      }

      const mask = -1 << (32 - bits);
      return (ipInt & mask) === (rangeInt & mask);
    } catch {
      return false;
    }
  }

  private ipv4ToInt(ip: string): number | null {
    const parts = ip.split('.');
    if (parts.length !== 4) {
      return null;
    }

    let result = 0;
    for (const part of parts) {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255) {
        return null;
      }
      result = (result << 8) + num;
    }

    return result >>> 0; // Convert to unsigned
  }
}