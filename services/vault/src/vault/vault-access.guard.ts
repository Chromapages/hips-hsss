import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

/**
 * VaultAccessGuard — ensures only authorized internal services
 * can access vault endpoints. Uses a shared secret header.
 *
 * In production this would be replaced by mTLS + IAM role verification.
 */
@Injectable()
export class VaultAccessGuard implements CanActivate {
  private readonly internalSecret: string;

  constructor() {
    this.internalSecret = process.env.VAULT_INTERNAL_SECRET ?? "";
    if (!this.internalSecret) {
      throw new Error("VAULT_INTERNAL_SECRET is required");
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers["x-vault-secret"];
    const requesterId = request.headers["x-requester-id"];

    if (!secret || secret !== this.internalSecret || !requesterId) {
      throw new UnauthorizedException("Vault access denied");
    }
    return true;
  }
}
