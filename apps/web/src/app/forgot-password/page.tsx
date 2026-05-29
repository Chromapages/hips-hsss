import { Metadata } from 'next';
import ForgotPasswordClient from './ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'Reset Password — H.I.P.S.',
  description: 'Reset your H.I.P.S. account password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
