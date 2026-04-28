export type EmailTemplateId =
  | "BOOKING_CONFIRMATION"
  | "SESSION_REMINDER_24H"
  | "PAYMENT_RECEIPT"
  | "DONATION_RECEIPT"
  | "SCHOLARSHIP_APPROVED"
  | "SCHOLARSHIP_DENIED"
  | "PACKAGE_EXPIRY_WARNING"
  | "ORG_INQUIRY_RECEIVED";

export type EmailRenderResult = {
  templateId: EmailTemplateId;
  subject: string;
  preheader: string;
  html: string;
  text: string;
  includesCrisisResources: boolean;
  includesReceiptDisclaimer: boolean;
};

export type ReceiptLine = {
  label: string;
  amount: string;
};

export type TemplateContext = Record<string, string | number | boolean>;
