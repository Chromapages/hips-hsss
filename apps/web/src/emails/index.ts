import { render } from '@react-email/render';
import { BookingConfirmationEmail } from './BookingConfirmation';
import { SessionReminder24HEmail } from './SessionReminder24H';
import { FollowUpSurveyEmail } from './FollowUpSurvey';
import { PackageExpiryWarningEmail } from './PackageExpiryWarning';
import { DonationReceiptEmail } from './DonationReceipt';
import { SessionCancellationEmail } from './SessionCancellation';
import { sendEmail } from '@/lib/email';

const FROM = 'H.I.P.S. Foundation <notifications@hips-support.org>';

// ========== BOOKING_CONFIRMATION ==========

interface SendBookingConfirmationOptions {
  to: string;
  serviceName: string;
  sessionDate: string;
  sessionTime: string;
}

export async function sendBookingConfirmationEmail({
  to,
  serviceName,
  sessionDate,
  sessionTime,
}: SendBookingConfirmationOptions) {
  const email = BookingConfirmationEmail({
    participantEmail: to,
    serviceName,
    sessionDate,
    sessionTime,
  });
  const html = await render(email, { pretty: true });
  return sendEmail({
    to,
    subject: `Your session is confirmed — ${sessionDate}`,
    html,
  });
}

// ========== SESSION_REMINDER_24H ==========

interface SendSessionReminder24HOptions {
  to: string;
  serviceName: string;
  sessionDate: string;
  sessionTime: string;
}

export async function sendSessionReminder24HEmail({
  to,
  serviceName,
  sessionDate,
  sessionTime,
}: SendSessionReminder24HOptions) {
  const email = SessionReminder24HEmail({
    participantEmail: to,
    serviceName,
    sessionDate,
    sessionTime,
  });
  const html = await render(email, { pretty: true });
  return sendEmail({
    to,
    subject: `Your session is tomorrow — ${sessionTime}`,
    html,
  });
}

// ========== FOLLOW_UP_SURVEY ==========

interface SendFollowUpSurveyOptions {
  to: string;
  surveyUrl: string;
}

export async function sendFollowUpSurveyEmail({
  to,
  surveyUrl,
}: SendFollowUpSurveyOptions) {
  const email = FollowUpSurveyEmail({
    participantEmail: to,
    surveyUrl,
  });
  const html = await render(email, { pretty: true });
  return sendEmail({
    to,
    subject: 'How was your session?',
    html,
  });
}

// ========== PACKAGE_EXPIRY_WARNING ==========

interface SendPackageExpiryWarningOptions {
  to: string;
  sessionsRemaining: number;
  expiryDate: string;
}

export async function sendPackageExpiryWarningEmail({
  to,
  sessionsRemaining,
  expiryDate,
}: SendPackageExpiryWarningOptions) {
  const email = PackageExpiryWarningEmail({
    participantEmail: to,
    sessionsRemaining,
    expiryDate,
  });
  const html = await render(email, { pretty: true });
  return sendEmail({
    to,
    subject: `Your session package expires on ${expiryDate}`,
    html,
  });
}

// ========== DONATION_RECEIPT ==========

interface SendDonationReceiptOptions {
  to: string;
  amount: string;
  donationDate: string;
  donationTier: 'SPONSOR_SESSION' | 'RESTORE_SESSION' | 'RESTORE_LEADER' | 'CUSTOM';
}

export async function sendDonationReceiptEmail({
  to,
  amount,
  donationDate,
  donationTier,
  
}: SendDonationReceiptOptions) {
  const email = DonationReceiptEmail({
    donorEmail: to,
    amount,
    donationDate,
    donationTier,
  });
  const html = await render(email, { pretty: true });
  return sendEmail({
    to,
    subject: `Thank you — your donation receipt from H.I.P.S. Foundation`,
    html,
  });
}

// ========== SESSION_CANCELLATION ==========

interface SendSessionCancellationOptions {
  to: string;
  sessionDate: string;
  sessionTime: string;
  cancelledBy: 'PARTICIPANT' | 'PLATFORM';
  sessionsRemaining?: number;
}

export async function sendSessionCancellationEmail({
  to,
  sessionDate,
  sessionTime,
  cancelledBy,
  sessionsRemaining,
}: SendSessionCancellationOptions) {
  const email = SessionCancellationEmail({
    participantEmail: to,
    sessionDate,
    sessionTime,
    cancelledBy,
    sessionsRemaining: sessionsRemaining ?? undefined,
  });
  const html = await render(email, { pretty: true });
  return sendEmail({
    to,
    subject: `Your session on ${sessionDate} has been cancelled`,
    html,
  });
}
