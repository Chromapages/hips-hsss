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
import { CRISIS_RESOURCES } from '@hips/types';

const APP_URL = 'https://hips.foundation';
const SUPPORT_EMAIL = 'support@hips.foundation';
const ORG_NAME = 'H.I.P.S. Foundation';

type CancellationActor = 'PARTICIPANT' | 'PLATFORM';

interface SessionCancellationProps {
  participantEmail: string;
  sessionDate: string;
  sessionTime: string;
  cancelledBy: CancellationActor;
  sessionsRemaining?: number | undefined;
}

export function SessionCancellationEmail({
  participantEmail,
  sessionDate,
  sessionTime,
  cancelledBy,
  sessionsRemaining,
}: SessionCancellationProps) {
  const isParticipantCancellation = cancelledBy === 'PARTICIPANT';

  const bodyCopy = isParticipantCancellation
    ? `Your session on ${sessionDate} at ${sessionTime} has been cancelled as requested.`
    : `We had to cancel your session on ${sessionDate} at ${sessionTime}. We are sorry for the disruption.`;

  return (
    <Html>
      <Head />
      <Preview>Here is what happened and how to rebook.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Your session has been cancelled.</Heading>

          <Section style={section}>
            <Text style={bodyText}>{bodyCopy}</Text>
          </Section>

          {sessionsRemaining !== undefined && sessionsRemaining > 0 && (
            <Section style={section}>
              <Heading style={subheading}>Session balance</Heading>
              <Text style={bodyText}>
                Your session has been returned to your package balance.
                You still have {sessionsRemaining} session(s) available.
              </Text>
            </Section>
          )}

          <Section style={section}>
            <Button href={`${APP_URL}/dashboard/book`} style={button}>
              Book a New Session
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={subheading}>If you need support in the meantime:</Heading>
            <Text style={crisisText}>
              988 — call or text | Crisis Text Line — text HOME to 741741
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
