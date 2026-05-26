import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const APP_URL = 'https://hips.foundation';
const SUPPORT_EMAIL = 'support@hips.foundation';
const ORG_NAME = 'H.I.P.S. Foundation';

interface PackageExpiryWarningProps {
  participantEmail: string;
  sessionsRemaining: number;
  expiryDate: string;
}

export function PackageExpiryWarningEmail({
  participantEmail,
  sessionsRemaining,
  expiryDate,
}: PackageExpiryWarningProps) {
  return (
    <Html>
      <Head />
      <Preview>{`You have ${sessionsRemaining} session(s) left. Book before they expire.`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>A reminder about your session package.</Heading>

          <Section style={section}>
            <Text style={label}>Sessions remaining</Text>
            <Text style={value}>{sessionsRemaining}</Text>

            <Text style={label}>Expiry date</Text>
            <Text style={value}>{expiryDate}</Text>
          </Section>

          <Section style={section}>
            <Text style={bodyText}>
              Book your remaining session(s) before they expire.
            </Text>
            <Button href={`${APP_URL}/dashboard/book`} style={button}>
              Book Now
            </Button>
          </Section>

          <Section style={section}>
            <Heading style={subheading}>Ready for more?</Heading>
            <Text style={bodyText}>
              When you are ready for more, you can purchase a new package
              from your dashboard at any time.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            {ORG_NAME} · {SUPPORT_EMAIL}
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

const label = {
  fontSize: '12px',
  color: '#737373',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: '4px',
};

const value = {
  fontSize: '16px',
  color: '#1a1a1a',
  marginBottom: '16px',
};

const bodyText = {
  fontSize: '16px',
  color: '#404040',
  lineHeight: '1.5',
  marginBottom: '16px',
};

const button = {
  backgroundColor: '#1a1a1a',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '500' as const,
  padding: '12px 24px',
  textDecoration: 'none',
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
