import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { DONATION_RECEIPT_DISCLAIMER } from '@hips/types';

const APP_URL = 'https://hips.foundation';
const SUPPORT_EMAIL = 'support@hips.foundation';
const ORG_NAME = 'H.I.P.S. Foundation';
const ORG_EIN = process.env.ORG_EIN || '[EIN pending]';

type DonationTier = 'SPONSOR_SESSION' | 'RESTORE_SESSION' | 'RESTORE_LEADER' | 'CUSTOM';

interface DonationReceiptProps {
  donorEmail: string;
  amount: string;
  donationDate: string;
  donationTier: DonationTier;
}

const TIER_IMPACT: Record<DonationTier, string> = {
  SPONSOR_SESSION: 'Your gift funds a peer support session for someone who needs it.',
  RESTORE_SESSION: 'Your gift funds a coaching session for a leader in restoration.',
  RESTORE_LEADER: 'Your gift funds a full coaching package for a leader in need.',
  CUSTOM: 'Your gift supports the H.I.P.S. scholarship fund.',
};

export function DonationReceiptEmail({
  donorEmail,
  amount,
  donationDate,
  donationTier,
}: DonationReceiptProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Your tax-deductible receipt for ${amount} on ${donationDate}.`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Thank you for your support.</Heading>

          <Section style={section}>
            <Text style={impactText}>
              {TIER_IMPACT[donationTier] ?? TIER_IMPACT.CUSTOM}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={subheading}>Your receipt</Heading>
            <Text style={receiptText}>{DONATION_RECEIPT_DISCLAIMER}</Text>
            <Text style={receiptDetail}>Organization: {ORG_NAME}</Text>
            <Text style={receiptDetail}>EIN: {ORG_EIN}</Text>
            <Text style={receiptDetail}>Amount: {amount}</Text>
            <Text style={receiptDetail}>Date: {donationDate}</Text>
          </Section>

          <Section style={section}>
            <Button href={`${APP_URL}/donate`} style={buttonSecondary}>
              Make Another Gift
            </Button>
            <Text style={lowPressure}>Whenever you are ready.</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            {ORG_NAME} · {ORG_EIN} · {SUPPORT_EMAIL}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  fontFamily: 'Georgia, serif',
  backgroundColor: '#fafaf9',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 16px',
};

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e5e5e5',
  padding: '32px',
};

const heading = {
  fontSize: '24px',
  fontWeight: '400' as const,
  color: '#1a1a1a',
  marginBottom: '24px',
};

const subheading = {
  fontSize: '18px',
  fontWeight: '400' as const,
  color: '#1a1a1a',
  marginBottom: '12px',
};

const section = {
  marginBottom: '24px',
};

const impactText = {
  fontSize: '18px',
  color: '#1a1a1a',
  lineHeight: '1.5',
};

const receiptText = {
  fontSize: '14px',
  color: '#737373',
  lineHeight: '1.5',
  marginBottom: '16px',
};

const receiptDetail = {
  fontSize: '14px',
  color: '#404040',
  marginBottom: '8px',
};

const buttonSecondary = {
  backgroundColor: 'transparent',
  border: '1px solid #1a1a1a',
  borderRadius: '6px',
  color: '#1a1a1a',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '500' as const,
  padding: '12px 24px',
  textDecoration: 'none',
  marginBottom: '12px',
};

const lowPressure = {
  fontSize: '14px',
  color: '#737373',
};

const hr = {
  borderColor: '#e5e5e5',
  margin: '24px 0',
};

const footer = {
  fontSize: '14px',
  color: '#737373',
  textAlign: 'center' as const,
};
