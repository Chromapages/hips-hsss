import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AlertService } from './alert.service'

describe('AlertService', () => {
  let alertService: AlertService

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.TWILIO_ACCOUNT_SID = 'ACtest_sid'
    process.env.TWILIO_AUTH_TOKEN = 'test_auth_token'
    process.env.TWILIO_FROM_NUMBER = '+1555000000'
    process.env.CRISIS_SMS_PRIMARY = '+1555000001'
    process.env.CRISIS_SMS_BACKUP = '+1555000002'
    process.env.CRISIS_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/TEST/BTEST/XTEST'
    process.env.ADMIN_DASHBOARD_URL = 'https://app.hips.foundation'
    alertService = new AlertService()
  })

  describe('dispatchCrisisAlerts', () => {
    it('fires all three channels (SMS primary, SMS backup, Slack) simultaneously', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true })
      vi.stubGlobal('fetch', mockFetch)

      const result = await alertService.dispatchCrisisAlerts({
        crisisId: 'crisis_123',
        sessionId: 'session_abc',
        requesterId: 'user_xyz',
        requesterRole: 'FACILITATOR',
        timestamp: new Date().toISOString(),
      })

      expect(result).toHaveLength(3)
      expect(result[0].channel).toBe('SMS_PRIMARY')
      expect(result[1].channel).toBe('SMS_BACKUP')
      expect(result[2].channel).toBe('SLACK')

      vi.restoreAllMocks()
    })

    it('marks SMS as FAILED if Twilio returns an error', async () => {
      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new Error('Invalid phone number')) // primary fails
        .mockResolvedValueOnce({ ok: true }) // backup ok
        .mockResolvedValueOnce({ ok: true }) // slack ok

      vi.stubGlobal('fetch', mockFetch)

      const result = await alertService.dispatchCrisisAlerts({
        crisisId: 'crisis_456',
        sessionId: 'session_def',
        requesterId: 'user_ghi',
        requesterRole: 'ADMIN',
        timestamp: new Date().toISOString(),
      })

      expect(result[0].status).toBe('FAILED')
      expect(result[0].error).toBe('Invalid phone number')
      expect(result[1].status).toBe('SENT')
      expect(result[2].status).toBe('SENT')

      vi.restoreAllMocks()
    })

    it('continues if Slack fails — does not block SMS dispatch', async () => {
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({ ok: true }) // primary
        .mockResolvedValueOnce({ ok: true }) // backup
        .mockRejectedValueOnce(new Error('Slack webhook URL expired')) // slack fails

      vi.stubGlobal('fetch', mockFetch)

      const result = await alertService.dispatchCrisisAlerts({
        crisisId: 'crisis_789',
        sessionId: 'session_ghi',
        requesterId: 'user_jkl',
        requesterRole: 'FACILITATOR',
        timestamp: new Date().toISOString(),
      })

      expect(result[0].status).toBe('SENT')
      expect(result[1].status).toBe('SENT')
      expect(result[2].status).toBe('FAILED')
      expect(result[2].error).toBe('Slack webhook URL expired')

      vi.restoreAllMocks()
    })
  })

  describe('isConfigured', () => {
    it('returns sms: true when all Twilio credentials and phone numbers are present', () => {
      const result = alertService.isConfigured()
      expect(result.sms).toBe(true)
    })

    it('returns sms: false when TWILIO_ACCOUNT_SID is missing', () => {
      delete process.env.TWILIO_ACCOUNT_SID
      const service = new AlertService()
      expect(service.isConfigured().sms).toBe(false)
    })

    it('returns slack: false when CRISIS_SLACK_WEBHOOK_URL is missing', () => {
      delete process.env.CRISIS_SLACK_WEBHOOK_URL
      const service = new AlertService()
      expect(service.isConfigured().slack).toBe(false)
    })

    it('returns sms: false when CRISIS_SMS_PRIMARY is missing', () => {
      delete process.env.CRISIS_SMS_PRIMARY
      const service = new AlertService()
      expect(service.isConfigured().sms).toBe(false)
    })
  })
})