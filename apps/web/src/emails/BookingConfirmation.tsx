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
import {
  CRISIS_RESOURCES,
  REQUIRED_DISCLAIMER,
} from '@hips/types';

const APP_URL = 'https://hips.foundation';
const SUPPORT_EMAIL = 'support@hips.foundation';
const ORG_NAME = 'H.I.P.S. Foundation';

interface BookingConfirmationProps {
  participantEmail: string;
  serviceName: string;
  sessionDate: string;
  sessionTime: string;
}

export function BookingConfirmationEmail({
  participantEmail,
  serviceName,
  sessionDate,
  sessionTime,
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`You are booked for ${sessionTime}. Here is everything you need.`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Your session is confirmed.</Heading>

          <Section style={section}>
            <Text style={label}>Service</Text>
            <Text style={value}>{serviceName}</Text>

            <Text style={label}>Date</Text>
            <Text style={value}>{sessionDate}</Text>

            <Text style={label}>Time</Text>
            <Text style={value}>{sessionTime}</Text>

            <Text style={label}>Format</Text>
            <Text style={value}>Voice session with avatar — laptop or desktop required</Text>
          </Section>

          <Section style={section}>
            <Heading style={subheading}>How to join</Heading>
            <Text style={bodyText}>
              On the day of your session, sign in at {APP_URL} and click
              'Join Session' from your dashboard. Sessions require a laptop or
              desktop — mobile devices cannot initiate sessions.
            </Text>
            <Button href={`${APP_URL}/dashboard`} style={button}>
              Go to Dashboard
            </Button>
          </Section>

          <Section style={section}>
            <Heading style={subheading}>Need to reschedule?</Heading>
            <Text style={bodyText}>
              Life happens. If you need to reschedule, contact us at least
              24 hours in advance at{' '}
              <Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={disclaimer}>{REQUIRED_DISCLAIMER}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={subheading}>If you need support before your session:</Heading>
            <Text style={crisisText}>
              988 Suicide & Crisis Lifeline — call or text 988
            </Text>
            <Text style={crisisText}>
              Crisis Text Line — text HOME to 741741
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            {ORG_NAME} · {SUPPORT_EMAIL} · {APP_URL}
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
  marginTop: '24px',
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

const disclaimer = {
  fontSize: '14px',
  color: '#737373',
  lineHeight: '1.5',
};

const crisisText = {
  fontSize: '14px',
  color: '#737373',
  marginBottom: '8px',
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
