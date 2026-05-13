import { ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { describe, expect, it, vi } from 'vitest'
import { SessionTokenGuard } from './session-token.guard'

function contextFor(headers: Record<string, string | undefined>, params: Record<string, string> = {}) {
  const request: { headers: Record<string, string | undefined>; params: Record<string, string>; sessionToken?: unknown } = {
    headers,
    params,
  }

  return {
    request,
    context: {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never,
  }
}

describe('SessionTokenGuard', () => {
  it('rejects missing or short session tokens', async () => {
    const guard = new SessionTokenGuard({ validateSessionToken: vi.fn() } as never)

    await expect(guard.canActivate(contextFor({}).context)).rejects.toBeInstanceOf(UnauthorizedException)
    await expect(guard.canActivate(contextFor({ 'x-session-token': 'short' }).context)).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('rejects a valid token for a different session or room', async () => {
    const guard = new SessionTokenGuard({
      validateSessionToken: vi.fn().mockResolvedValue({
        sessionRecordId: 'session-a',
        roomId: 'room-a',
        anonId: 'participant-a',
      }),
    } as never)

    await expect(
      guard.canActivate(contextFor({ 'x-session-token': 'x'.repeat(32) }, { id: 'session-b' }).context),
    ).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('attaches the validated participant token for the matching session', async () => {
    const guard = new SessionTokenGuard({
      validateSessionToken: vi.fn().mockResolvedValue({
        sessionRecordId: 'session-a',
        roomId: 'room-a',
        anonId: 'participant-a',
      }),
    } as never)
    const { request, context } = contextFor({ authorization: `Bearer ${'x'.repeat(32)}` }, { id: 'room-a' })

    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect(request.sessionToken).toMatchObject({
      sessionRecordId: 'session-a',
      roomId: 'room-a',
      anonId: 'participant-a',
      role: 'participant',
    })
  })
})
