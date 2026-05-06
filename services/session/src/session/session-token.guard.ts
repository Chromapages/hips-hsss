import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

/**
 * SessionTokenGuard — validates the anonymous session token
 * on all /session/v1/:id/* routes.
 */
@Injectable()
export class SessionTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers["x-session-token"];

    if (!token || typeof token !== "string" || token.length < 16) {
      throw new UnauthorizedException("Invalid session token");
    }
    return true;
  }
}
