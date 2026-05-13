import { UnauthorizedException } from '@nestjs/common'
import { afterEach, describe, expect, it } from 'vitest'
import { VaultAccessGuard } from './vault-access.guard'

function contextFor(headers: Record<string, string | undefined>) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as never
}

describe('VaultAccessGuard', () => {
  const oldSecret = process.env.VAULT_INTERNAL_SECRET

  afterEach(() => {
    process.env.VAULT_INTERNAL_SECRET = oldSecret
  })

  it('fails closed when the internal secret is not configured', () => {
    delete process.env.VAULT_INTERNAL_SECRET

    expect(() => new VaultAccessGuard()).toThrow('VAULT_INTERNAL_SECRET is required')
  })

  it('rejects a shared secret without a requester identity', () => {
    process.env.VAULT_INTERNAL_SECRET = 'vault-secret'
    const guard = new VaultAccessGuard()

    expect(() => guard.canActivate(contextFor({ 'x-vault-secret': 'vault-secret' }))).toThrow(UnauthorizedException)
  })

  it('allows the configured secret only when a requester identity is present', () => {
    process.env.VAULT_INTERNAL_SECRET = 'vault-secret'
    const guard = new VaultAccessGuard()

    expect(guard.canActivate(contextFor({
      'x-vault-secret': 'vault-secret',
      'x-requester-id': 'safety-engine',
    }))).toBe(true)
  })
})
