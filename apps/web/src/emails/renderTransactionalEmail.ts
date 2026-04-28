import {
  CRISIS_RESOURCES,
  DONATION_RECEIPT_DISCLAIMER,
  REQUIRED_DISCLAIMER,
  SCHOLARSHIP_DISCLAIMER,
  assertApprovedCopy,
  type EmailRenderResult,
  type EmailTemplateId,
  type TemplateContext,
} from "@hips/types";

const appUrl = "https://hips.foundation";
const support = "support@hips.foundation";

function value(context: TemplateContext, key: string) {
  return String(context[key] ?? "");
}

function resources() {
  return CRISIS_RESOURCES.map(
    (resource) =>
      `<p><a href="${resource.href}">${resource.label}</a> - ${resource.action}</p>`,
  ).join("");
}

function wrap(
  templateId: EmailTemplateId,
  subject: string,
  preheader: string,
  body: string,
  options: { crisis?: boolean; receipt?: boolean } = {},
): EmailRenderResult {
  const html = `<main><p>${preheader}</p>${body}<footer>H.I.P.S. Foundation - ${support} - ${appUrl}</footer></main>`;
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  assertApprovedCopy(`${subject} ${preheader} ${text}`);

  return {
    templateId,
    subject,
    preheader,
    html,
    text,
    includesCrisisResources: Boolean(options.crisis),
    includesReceiptDisclaimer: Boolean(options.receipt),
  };
}

export function renderTransactionalEmail(
  templateId: EmailTemplateId,
  context: TemplateContext,
) {
  switch (templateId) {
    case "BOOKING_CONFIRMATION":
      return wrap(
        templateId,
        `Your session is confirmed - ${value(context, "session_date")}`,
        `You are booked for ${value(context, "session_time")}.`,
        `<h1>Your session is confirmed.</h1><p>${value(context, "service_name")} on ${value(context, "session_date")} at ${value(context, "session_time")}.</p><p>Join from your dashboard on a laptop or desktop.</p><p>${REQUIRED_DISCLAIMER}</p>${resources()}`,
        { crisis: true },
      );
    case "SESSION_REMINDER_24H":
      return wrap(
        templateId,
        `Your session is tomorrow - ${value(context, "session_time")}`,
        `A quick reminder for ${value(context, "service_name")}.`,
        `<h1>See you tomorrow.</h1><p>${value(context, "session_date")} at ${value(context, "session_time")}.</p>${resources()}`,
        { crisis: true },
      );
    case "PAYMENT_RECEIPT":
      return wrap(
        templateId,
        "Your H.I.P.S. receipt",
        "Your payment has been received.",
        `<h1>Receipt</h1><p>Amount paid: ${value(context, "amount_paid")}</p><p>${REQUIRED_DISCLAIMER}</p>`,
        { receipt: true },
      );
    case "DONATION_RECEIPT":
      return wrap(
        templateId,
        "Thank you for your donation",
        "Your receipt is ready for your records.",
        `<h1>Donation receipt</h1><p>Contribution: ${value(context, "amount_paid")}</p><p>${DONATION_RECEIPT_DISCLAIMER}</p>`,
        { receipt: true },
      );
    case "SCHOLARSHIP_APPROVED":
      return wrap(
        templateId,
        "Your scholarship application has been approved",
        "Your discount code is ready.",
        `<h1>You are all set.</h1><p>Code: ${value(context, "discount_code")}</p><p>${SCHOLARSHIP_DISCLAIMER}</p>`,
      );
    case "SCHOLARSHIP_DENIED":
      return wrap(
        templateId,
        "Your H.I.P.S. scholarship application",
        "Here is what is available to support your access.",
        `<h1>Thank you for applying.</h1><p>We were not able to approve this application at this time. Sliding-scale options remain available.</p>`,
      );
    case "PACKAGE_EXPIRY_WARNING":
      return wrap(
        templateId,
        `Your session package expires on ${value(context, "expiry_date")}`,
        `You have ${value(context, "sessions_remaining")} session(s) left.`,
        `<h1>A reminder about your session package.</h1><p>Book your remaining session before ${value(context, "expiry_date")}.</p>`,
      );
    case "ORG_INQUIRY_RECEIVED":
      return wrap(
        templateId,
        "We received your inquiry - H.I.P.S. Foundation",
        "We will be in touch with a quote within 48 hours.",
        `<h1>We received your inquiry.</h1><p>Thank you for reaching out about ${value(context, "event_type")}.</p><p>${REQUIRED_DISCLAIMER}</p>`,
      );
  }
}
