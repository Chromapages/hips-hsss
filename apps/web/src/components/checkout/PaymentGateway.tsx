'use client';

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import { DemoPaymentForm } from "./DemoPaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function PaymentGateway({
  clientSecret,
  amount,
}: {
  clientSecret: string;
  amount: number;
}) {
  const isDemo = clientSecret.startsWith('demo_');

  if (isDemo) {
    return (
      <DemoPaymentForm
        clientSecret={clientSecret}
        onSuccess={() => {
          window.location.href = '/dashboard?payment_success=true';
        }}
      />
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
}
