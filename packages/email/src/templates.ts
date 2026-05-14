// Booking Confirmation Email
export function bookingConfirmationEmail(data: {
  participantName: string
  serviceName: string
  scheduledAt: string
  facilitatorName: string
  sessionLink?: string
}): { subject: string; html: string; text: string } {
  const subject = `Your H.I.P.S. Session is Confirmed — ${data.serviceName}`
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Inter, Arial, sans-serif; color: #1A3A5C; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 24px; }
    .header { border-bottom: 2px solid #E8D5B7; padding-bottom: 16px; margin-bottom: 24px; }
    .logo { font-size: 20px; font-weight: 700; color: #2D5A8E; }
    h1 { font-size: 24px; color: #1A3A5C; margin-bottom: 16px; }
    .detail-row { margin-bottom: 12px; }
    .label { font-weight: 600; color: #4A8FA8; }
    .disclaimer { margin-top: 32px; padding: 16px; background: #F9F5ED; border-left: 4px solid #7BC4C4; font-size: 13px; color: #4A8FA8; }
    .footer { margin-top: 32px; font-size: 12px; color: #4A8FA8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">H.I.P.S. — Hiding in Plain Sight Foundation</div>
    </div>
    <h1>Your Session is Confirmed</h1>
    <p>Hello ${data.participantName},</p>
    <p>Your session has been booked and payment has been confirmed. Here are your details:</p>
    <div class="detail-row"><span class="label">Service:</span> ${data.serviceName}</div>
    <div class="detail-row"><span class="label">Date & Time:</span> ${data.scheduledAt}</div>
    <div class="detail-row"><span class="label">Facilitator:</span> ${data.facilitatorName}</div>
    ${data.sessionLink ? `<p>Join link: <a href="${data.sessionLink}">${data.sessionLink}</a></p>` : ''}
    <p>You'll receive a reminder 24 hours before your session.</p>
    <div class="disclaimer">
      <strong>Disclaimer:</strong> H.I.P.S. offers peer support, coaching, and care navigation services. These services are not a substitute for licensed medical care, professional support, or crisis intervention. If you are in crisis, please contact the 988 Suicide & Crisis Lifeline or your local emergency services.
    </div>
    <div class="footer">
      <p>Hiding in Plain Sight Foundation · 501(c)(3) Nonprofit</p>
    </div>
  </div>
</body>
</html>`
  const text = `H.I.P.S. Session Confirmed

Hello ${data.participantName},

Your session is confirmed:
Service: ${data.serviceName}
Date & Time: ${data.scheduledAt}
Facilitator: ${data.facilitatorName}
${data.sessionLink ? `Join: ${data.sessionLink}` : ''}

Disclaimer: H.I.P.S. offers peer support, coaching, and care navigation services. These services are not a substitute for licensed medical care, professional support, or crisis intervention. If you are in crisis, please contact 988 Suicide & Crisis Lifeline or your local emergency services.

Hiding in Plain Sight Foundation · 501(c)(3) Nonprofit`

  return { subject, html, text }
}

// Scholarship Approved Email
export function scholarshipApprovedEmail(data: {
  participantName: string
  serviceName: string
  approvedAmount: number
  discountCode: string
  expiresAt: string
}): { subject: string; html: string; text: string } {
  const subject = `Scholarship Approved — Your Discount Code`
  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>body { font-family: Inter, Arial, sans-serif; color: #1A3A5C; line-height: 1.6; }
.container { max-width: 600px; margin: 0 auto; padding: 24px; }
.header { border-bottom: 2px solid #E8D5B7; padding-bottom: 16px; margin-bottom: 24px; }
.logo { font-size: 20px; font-weight: 700; color: #2D5A8E; }
h1 { font-size: 24px; color: #1A3A5C; }
.code-box { background: #F0F7FF; border: 2px solid #2D5A8E; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0; font-family: monospace; font-size: 20px; letter-spacing: 2px; }
.disclaimer { margin-top: 32px; padding: 16px; background: #F9F5ED; border-left: 4px solid #7BC4C4; font-size: 13px; color: #4A8FA8; }
</style></head>
<body><div class="container">
<div class="header"><div class="logo">H.I.P.S.</div></div>
<h1>Scholarship Approved</h1>
<p>Hello ${data.participantName},</p>
<p>Great news — your scholarship application for <strong>${data.serviceName}</strong> has been approved.</p>
<p>Amount covered: <strong>$${(data.approvedAmount / 100).toFixed(2)}</strong></p>
<div class="code-box">${data.discountCode}</div>
<p>This code expires on ${data.expiresAt}. Apply it at checkout to redeem your discount.</p>
<div class="disclaimer">
<strong>Disclaimer:</strong> H.I.P.S. offers peer support, coaching, and care navigation services. These services are not a substitute for licensed medical care or professional support. If you are in crisis, please contact 988 Suicide & Crisis Lifeline.
</div>
</div></body></html>`
  const text = `Scholarship Approved — H.I.P.S.

Hello ${data.participantName},

Your scholarship for ${data.serviceName} has been approved.
Amount: $${(data.approvedAmount / 100).toFixed(2)}
Discount Code: ${data.discountCode}
Expires: ${data.expiresAt}

Disclaimer: H.I.P.S. offers peer support, coaching, and care navigation services. These services are not a substitute for licensed medical care or professional support. If you are in crisis, contact 988.`
  return { subject, html, text }
}

// Scholarship Denied Email
export function scholarshipDeniedEmail(data: {
  participantName: string
  serviceName: string
  reason?: string
}): { subject: string; html: string; text: string } {
  const subject = `Scholarship Application Update — H.I.P.S.`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body { font-family: Inter, Arial, sans-serif; color: #1A3A5C; line-height: 1.6; }
.container { max-width: 600px; margin: 0 auto; padding: 24px; }
.header { border-bottom: 2px solid #E8D5B7; padding-bottom: 16px; margin-bottom: 24px; }
.logo { font-size: 20px; font-weight: 700; color: #2D5A8E; }
.disclaimer { margin-top: 32px; padding: 16px; background: #F9F5ED; border-left: 4px solid #7BC4C4; font-size: 13px; color: #4A8FA8; }
</style></head><body><div class="container">
<div class="header"><div class="logo">H.I.P.S.</div></div>
<h1>Scholarship Application Update</h1>
<p>Hello ${data.participantName},</p>
<p>Thank you for applying for a scholarship for <strong>${data.serviceName}</strong>. After review, we are unable to approve this application at this time.</p>
${data.reason ? `<p>${data.reason}</p>` : ''}
<p>You are welcome to apply again in the future. If you have questions, please reach out to our team.</p>
<div class="disclaimer">
<strong>Disclaimer:</strong> H.I.P.S. offers peer support, coaching, and care navigation services. These services are not a substitute for licensed medical care or professional support. If you are in crisis, please contact 988 Suicide & Crisis Lifeline.
</div>
</div></body></html>`
  const text = `Scholarship Application Update — H.I.P.S.

Hello ${data.participantName},

Thank you for applying for a scholarship for ${data.serviceName}. We are unable to approve this application at this time.

You may reapply in the future. If you have questions, contact our team.

Disclaimer: H.I.P.S. offers peer support, coaching, and care navigation services. Not a substitute for licensed medical care or professional support. Crisis: 988.`
  return { subject, html, text }
}

// IRS-Compliant Donation Receipt
export function donationReceiptEmail(data: {
  donorEmail: string
  amount: number
  tier: string
  donationDate: string
  ein: string
  orgName: string
}): { subject: string; html: string; text: string } {
  const amountDollars = (data.amount / 100).toFixed(2)
  const subject = `Thank You for Your Donation — H.I.P.S. Foundation`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body { font-family: Inter, Arial, sans-serif; color: #1A3A5C; line-height: 1.6; }
.container { max-width: 600px; margin: 0 auto; padding: 24px; }
.header { border-bottom: 2px solid #E8D5B7; padding-bottom: 16px; margin-bottom: 24px; }
.logo { font-size: 20px; font-weight: 700; color: #2D5A8E; }
.receipt-box { background: #F9F5ED; border: 1px solid #E8D5B7; border-radius: 8px; padding: 24px; margin: 24px 0; }
.receipt-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
.receipt-total { border-top: 2px solid #1A3A5C; padding-top: 12px; margin-top: 12px; font-weight: 700; font-size: 18px; }
.disclaimer-box { margin-top: 24px; padding: 16px; background: #fff; border: 1px solid #E8D5B7; font-size: 13px; color: #4A8FA8; }
</style></head><body><div class="container">
<div class="header"><div class="logo">H.I.P.S. Foundation</div></div>
<h1>Donation Receipt</h1>
<p>This receipt confirms your generous donation to Hiding in Plain Sight Foundation.</p>
<div class="receipt-box">
  <div class="receipt-row"><span>Organization:</span><span>${data.orgName}</span></div>
  <div class="receipt-row"><span>EIN:</span><span>${data.ein}</span></div>
  <div class="receipt-row"><span>Donation Amount:</span><span>$${amountDollars}</span></div>
  <div class="receipt-row"><span>Date:</span><span>${data.donationDate}</span></div>
  <div class="receipt-row"><span>Tier:</span><span>${data.tier}</span></div>
  <div class="receipt-total"><span>Total (Tax-Deductible):</span><span>$${amountDollars}</span></div>
</div>
<div class="disclaimer-box">
  <p><strong>No goods or services were provided in exchange for this contribution.</strong></p>
  <p>Hiding in Plain Sight Foundation is a 501(c)(3) nonprofit organization. This donation is tax-deductible to the extent allowed by law. Please retain this receipt for your tax records.</p>
</div>
</div></body></html>`
  const text = `DONATION RECEIPT — H.I.P.S. Foundation

Organization: ${data.orgName}
EIN: ${data.ein}
Donation Amount: $${amountDollars}
Date: ${data.donationDate}
Tier: ${data.tier}

NO GOODS OR SERVICES WERE PROVIDED IN EXCHANGE FOR THIS CONTRIBUTION.

Hiding in Plain Sight Foundation is a 501(c)(3) nonprofit. Tax-deductible to extent allowed by law.`
  return { subject, html, text }
}

// Package Purchase Confirmation
export function packagePurchaseEmail(data: {
  participantName: string
  serviceName: string
  totalSessions: number
  pricePaid: number
  expiresAt: string
}): { subject: string; html: string; text: string } {
  const subject = `Package Purchased — ${data.totalSessions} Sessions`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body { font-family: Inter, Arial, sans-serif; color: #1A3A5C; line-height: 1.6; }
.container { max-width: 600px; margin: 0 auto; padding: 24px; }
.header { border-bottom: 2px solid #E8D5B7; padding-bottom: 16px; margin-bottom: 24px; }
.logo { font-size: 20px; font-weight: 700; color: #2D5A8E; }
.detail-row { margin-bottom: 12px; }
.label { font-weight: 600; color: #4A8FA8; }
.disclaimer { margin-top: 32px; padding: 16px; background: #F9F5ED; border-left: 4px solid #7BC4C4; font-size: 13px; color: #4A8FA8; }
</style></head><body><div class="container">
<div class="header"><div class="logo">H.I.P.S.</div></div>
<h1>Package Purchased</h1>
<p>Hello ${data.participantName},</p>
<p>Your session package has been confirmed. Book your sessions any time before the expiry date.</p>
<div class="detail-row"><span class="label">Package:</span> ${data.serviceName}</div>
<div class="detail-row"><span class="label">Sessions:</span> ${data.totalSessions}</div>
<div class="detail-row"><span class="label">Amount Paid:</span> $${(data.pricePaid / 100).toFixed(2)}</div>
<div class="detail-row"><span class="label">Expires:</span> ${data.expiresAt}</div>
<p>Book sessions at your dashboard: <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">${process.env.NEXT_PUBLIC_APP_URL}/dashboard</a></p>
<div class="disclaimer">
<strong>Disclaimer:</strong> H.I.P.S. offers peer support, coaching, and care navigation. Not a substitute for licensed medical care or professional support. Crisis: 988.
</div>
</div></body></html>`
  const text = `Package Purchased — H.I.P.S.

Hello ${data.participantName},

Package: ${data.serviceName}
Sessions: ${data.totalSessions}
Amount Paid: $${(data.pricePaid / 100).toFixed(2)}
Expires: ${data.expiresAt}

Book sessions at: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Disclaimer: H.I.P.S. — not a licensed medical service. Crisis: 988.`
  return { subject, html, text }
}

// Session Reminder (24-hour)
export function sessionReminderEmail(data: {
  participantName: string
  serviceName: string
  scheduledAt: string
  facilitatorName: string
  sessionLink?: string
}): { subject: string; html: string; text: string } {
  const subject = `Reminder: Your H.I.P.S. Session Tomorrow`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body { font-family: Inter, Arial, sans-serif; color: #1A3A5C; line-height: 1.6; }
.container { max-width: 600px; margin: 0 auto; padding: 24px; }
.header { border-bottom: 2px solid #E8D5B7; padding-bottom: 16px; margin-bottom: 24px; }
.logo { font-size: 20px; font-weight: 700; color: #2D5A8E; }
.detail-row { margin-bottom: 12px; }
.label { font-weight: 600; color: #4A8FA8; }
.disclaimer { margin-top: 32px; padding: 16px; background: #F9F5ED; border-left: 4px solid #7BC4C4; font-size: 13px; color: #4A8FA8; }
</style></head><body><div class="container">
<div class="header"><div class="logo">H.I.P.S.</div></div>
<h1>Session Tomorrow</h1>
<p>Hello ${data.participantName},</p>
<p>This is a reminder that your session is coming up tomorrow.</p>
<div class="detail-row"><span class="label">Service:</span> ${data.serviceName}</div>
<div class="detail-row"><span class="label">Time:</span> ${data.scheduledAt}</div>
<div class="detail-row"><span class="label">Facilitator:</span> ${data.facilitatorName}</div>
${data.sessionLink ? `<p>Join: <a href="${data.sessionLink}">${data.sessionLink}</a></p>` : ''}
<div class="disclaimer">
<strong>Disclaimer:</strong> H.I.P.S. — peer support, coaching, care navigation. Not a licensed medical service. Crisis: 988.
</div>
</div></body></html>`
  const text = `Session Reminder — H.I.P.S.

Hello ${data.participantName},

Your session is tomorrow:
Service: ${data.serviceName}
Time: ${data.scheduledAt}
Facilitator: ${data.facilitatorName}
${data.sessionLink ? `Join: ${data.sessionLink}` : ''}

Crisis: 988 Suicide & Crisis Lifeline`
  return { subject, html, text }
}

// Package Expiry Warning (75%)
export function packageExpiryWarningEmail(data: {
  participantName: string
  serviceName: string
  remainingSessions: number
  totalSessions: number
  expiresAt: string
}): { subject: string; html: string; text: string } {
  const subject = `Your H.I.P.S. Package Expiring Soon`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body { font-family: Inter, Arial, sans-serif; color: #1A3A5C; line-height: 1.6; }
.container { max-width: 600px; margin: 0 auto; padding: 24px; }
.header { border-bottom: 2px solid #E8D5B7; padding-bottom: 16px; margin-bottom: 24px; }
.logo { font-size: 20px; font-weight: 700; color: #2D5A8E; }
.cta { background: #2D5A8E; color: white; padding: 12px 24px; border-radius: 6px; display: inline-block; margin-top: 16px; text-decoration: none; }
.disclaimer { margin-top: 32px; padding: 16px; background: #F9F5ED; border-left: 4px solid #7BC4C4; font-size: 13px; color: #4A8FA8; }
</style></head><body><div class="container">
<div class="header"><div class="logo">H.I.P.S.</div></div>
<h1>Use Your Sessions Before They Expire</h1>
<p>Hello ${data.participantName},</p>
<p>Your <strong>${data.serviceName}</strong> package expires on <strong>${data.expiresAt}</strong>.</p>
<p>You have <strong>${data.remainingSessions} of ${data.totalSessions}</strong> sessions remaining.</p>
<p>Book your remaining sessions now before they expire.</p>
<a class="cta" href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Book Sessions</a>
<div class="disclaimer">
<strong>Disclaimer:</strong> H.I.P.S. — not a licensed medical service. Crisis: 988.
</div>
</div></body></html>`
  const text = `Package Expiring — H.I.P.S.

Hello ${data.participantName},

Your ${data.serviceName} package expires ${data.expiresAt}.
${data.remainingSessions} of ${data.totalSessions} sessions remaining.

Book now: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Crisis: 988.`
  return { subject, html, text }
}

// Org Inquiry Received
export function orgInquiryReceivedEmail(data: {
  contactName: string
  orgName: string
  eventType: string
  inquiryId: string
}): { subject: string; html: string; text: string } {
  const subject = `We've Received Your Inquiry — H.I.P.S.`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body { font-family: Inter, Arial, sans-serif; color: #1A3A5C; line-height: 1.6; }
.container { max-width: 600px; margin: 0 auto; padding: 24px; }
.header { border-bottom: 2px solid #E8D5B7; padding-bottom: 16px; margin-bottom: 24px; }
.logo { font-size: 20px; font-weight: 700; color: #2D5A8E; }
</style></head><body><div class="container">
<div class="header"><div class="logo">H.I.P.S.</div></div>
<h1>Thank You for Your Interest</h1>
<p>Hello ${data.contactName},</p>
<p>We've received your inquiry for <strong>${data.orgName}</strong> regarding a <strong>${data.eventType}</strong>.</p>
<p>Our team will review your inquiry and be in touch within 2 business days.</p>
<p>Inquiry reference: <code>${data.inquiryId}</code></p>
</div></body></html>`
  const text = `Inquiry Received — H.I.P.S.

Hello ${data.contactName},

We've received your ${data.eventType} inquiry for ${data.orgName}.
Reference: ${data.inquiryId}

Our team will be in touch within 2 business days.`
  return { subject, html, text }
}
