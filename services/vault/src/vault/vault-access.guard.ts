import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { timingSafeEqual } from "crypto";

/**
 * VaultAccessGuard — ensures only authorized internal services
 * can access vault endpoints. Uses a shared secret header.
 *
 * In production this would be replaced by mTLS + IAM role verification.
 */
@Injectable()
export class VaultAccessGuard implements CanActivate {
  private readonly internalSecret: Buffer;

  constructor() {
    const secret = process.env.VAULT_INTERNAL_SECRET
    if (!secret) {
      throw new Error("VAULT_INTERNAL_SECRET is required");
    }
    this.internalSecret = Buffer.from(secret, "utf-8");
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers["x-vault-secret"];
    const requesterId = request.headers["x-requester-id"];

    if (!secret || !requesterId) {
      throw new UnauthorizedException("Vault access denied");
    }

    const secretBuffer = Buffer.from(secret, "utf-8");
    if (
      this.internalSecret.length !== secretBuffer.length ||
      !timingSafeEqual(this.internalSecret, secretBuffer)
    ) {
      throw new UnauthorizedException("Vault access denied");
    }

    return true;
  }
}
