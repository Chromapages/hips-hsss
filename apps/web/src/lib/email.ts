import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  // We'll use a mock for development if key is missing
  console.warn('RESEND_API_KEY missing. Email will be logged to console.');
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type SendEmailResult = { id: string | null; error?: string };

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  if (!resend) {
    console.log('--- MOCK EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log('------------------');
    return { id: 'mock-id' };
  }

  try {
    const data = await resend.emails.send(
      {
        from: 'H.I.P.S. <notifications@hips-support.org>',
        to,
        subject,
        html,
      }
    );
    // Resend types this as a discriminated union where one branch has
    // { error, data: null } and another has { data, error: null }.
    // We re-check at runtime to be safe.
    if ('error' in data && data.error) {
      const errValue = data.error as unknown;
      console.error('Resend returned error:', errValue);
      return { id: null, error: typeof errValue === 'string' ? errValue : JSON.stringify(errValue) };
    }
    if ('data' in data && data.data) {
      return { id: (data.data as { id?: string | null }).id ?? null };
    }
    return { id: null };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { id: null, error: error instanceof Error ? error.message : 'unknown' };
  }
}
