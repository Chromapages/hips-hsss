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

interface FollowUpSurveyProps {
  participantEmail: string;
  surveyUrl: string;
}

export function FollowUpSurveyEmail({
  participantEmail,
  surveyUrl,
}: FollowUpSurveyProps) {
  return (
    <Html>
      <Head />
      <Preview>When you are ready, we would love to hear from you. No obligation.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>How was your session?</Heading>

          <Section style={section}>
            <Text style={bodyText}>
              When you are ready, we would love a few minutes of your feedback.
              There is no obligation to respond — and no right or wrong answers.
            </Text>
            <Button href={surveyUrl} style={button}>
              Share Your Feedback
            </Button>
          </Section>

          <Section style={section}>
            <Heading style={subheading}>A note on your privacy</Heading>
            <Text style={bodyText}>
              Your feedback helps us improve the experience for everyone
              who uses H.I.P.S. Thank you for being here.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={subheading}>If you need support:</Heading>
            <Text style={crisisText}>
              988 Suicide & Crisis Lifeline — call or text 988
            </Text>
            <Text style={crisisText}>
              Crisis Text Line — text HOME to 741741
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
  marginTop: '24px',
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
