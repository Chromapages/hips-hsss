import { Resend } from 'resend'

let resendClient: Resend | null = null

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set')
  }

  resendClient ??= new Resend(process.env.RESEND_API_KEY)
  return resendClient
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return getResend()[prop as keyof Resend]
  },
})

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@hips.foundation'

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  const { data, error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  })

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }
}
