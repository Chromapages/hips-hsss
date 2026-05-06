import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { SessionTokenPayload } from '../types/session.types';

export const SessionToken = createParamDecorator(
  (data: keyof SessionTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const payload = request.sessionToken as SessionTokenPayload | undefined;

    if (data) {
      return payload?.[data];
    }

    return payload;
  },
);

export { SessionTokenPayload };