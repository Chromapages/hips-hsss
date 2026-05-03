import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  // We'll use a mock for development if key is missing
  console.warn('RESEND_API_KEY missing. Email will be logged to console.');
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.log('--- MOCK EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log('------------------');
    return { id: 'mock-id' };
  }

  try {
    const data = await resend.emails.send({
      from: 'H.I.P.S. <notifications@hips-support.org>',
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
