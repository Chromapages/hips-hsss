import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, isFirebaseAdminReady } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email';

const errorReportSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = errorReportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid error report payload' }, { status: 400 });
    }

    const { message, stack, sessionId, userAgent, severity } = parsed.data;

    console.error(`[Client-Error] [${severity}] Message: ${message}`);
    if (stack) console.error(`[Client-Error] Stack: ${stack}`);

    // Log to Firestore if ready
    if (isFirebaseAdminReady()) {
      try {
        await db.collection('error_logs').add({
          message,
          stack: stack || null,
          sessionId: sessionId || null,
          userAgent: userAgent || null,
          severity,
          createdAt: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.error('[ErrorAPI] Failed to write error log to Firestore:', dbErr);
      }
    }

    // Send immediate email alert for CRITICAL or HIGH severity errors
    if (severity === 'CRITICAL' || severity === 'HIGH') {
      try {
        const coordinatorEmail = process.env.COORDINATOR_EMAIL || 'coordinator@hips-support.org';
        await sendEmail({
          to: coordinatorEmail,
          subject: `[HIPS ALERT] Live Session Technical Error - ${severity}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #173B57;">
              <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 8px;">
                Critical Session Alert
              </h2>
              <p>An urgent technical issue was reported during a live session.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb; width: 120px;">Severity</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; color: #ef4444; font-weight: bold;">${severity}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Session ID</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${sessionId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Message</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${message}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">User Agent</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 12px;">${userAgent || 'N/A'}</td>
                </tr>
              </table>
              ${stack ? `
                <h3 style="margin-top: 20px; color: #374151;">Stack Trace</h3>
                <pre style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 11px; overflow-x: auto; max-height: 250px;">${stack}</pre>
              ` : ''}
              <p style="margin-top: 25px; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                H.I.P.S. Foundation Platform System Notification
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[ErrorAPI] Failed to send alert email:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
