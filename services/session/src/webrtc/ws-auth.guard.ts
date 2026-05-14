import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    return Boolean((client as Socket & { sessionToken?: unknown }).sessionToken);
  }
}
