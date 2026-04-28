export const REQUIRED_DISCLAIMER =
  "H.I.P.S. provides peer support, coaching, and care navigation. It is not emergency care. If you need immediate help, call or text 988.";

export const DONATION_RECEIPT_DISCLAIMER =
  "H.I.P.S. Foundation is a nonprofit organization. Keep this receipt for your records. No goods or services were provided in exchange for this contribution unless stated on the receipt.";

export const SCHOLARSHIP_DISCLAIMER =
  "Scholarship pricing supports access to the same peer support, coaching, and care navigation experience available to all participants.";

export const DIGITAL_PRODUCT_DISCLAIMER =
  "Digital resources are educational peer-support materials and do not replace emergency or local professional support.";

export const CRISIS_RESOURCES = [
  {
    label: "988 Suicide & Crisis Lifeline",
    action: "Call or text 988",
    href: "tel:988",
  },
  {
    label: "Crisis Text Line",
    action: "Text HOME to 741741",
    href: "sms:741741",
  },
] as const;

export const BANNED_CLINICAL_TERMS = [
  "therapy",
  "treatment",
  "diagnosis",
  "clinical",
  "patient",
] as const;

export function assertApprovedCopy(value: string) {
  const normalized = value.toLowerCase();
  const blocked = BANNED_CLINICAL_TERMS.filter((term) =>
    normalized.includes(term),
  );

  if (blocked.length > 0) {
    throw new Error(`Copy contains blocked language: ${blocked.join(", ")}`);
  }
}
