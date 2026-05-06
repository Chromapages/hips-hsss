import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

/**
 * AdminGuard — verifies the request is from an authenticated admin.
 * In production: validates against Clerk JWT or internal service token.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  private readonly adminApiSecret: string;

  constructor() {
    this.adminApiSecret = process.env.SAFETY_ENGINE_SECRET ?? "";
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiSecret = request.headers["x-safety-engine-secret"];
    const requesterId = request.headers["x-requester-id"];

    if (!apiSecret || apiSecret !== this.adminApiSecret) {
      throw new UnauthorizedException("Safety engine access denied");
    }
    return true;
  }
}
