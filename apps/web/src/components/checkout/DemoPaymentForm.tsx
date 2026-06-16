'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { CreditCard, Lock, CheckCircle2, Loader2 } from 'lucide-react';

interface DemoPaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const DemoPaymentForm: React.FC<DemoPaymentFormProps> = ({
  clientSecret,
  onSuccess,
  onCancel,
}) => {
  const { getToken } = useAuth();
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse details from clientSecret
  let type: 'SESSION' | 'PACKAGE' | 'DONATION' = 'SESSION';
  let id = '';
  let amountCents = 5000;

  if (clientSecret.startsWith('demo_intent_')) {
    type = 'SESSION';
    id = clientSecret.replace('demo_intent_', '');
    amountCents = 5000; // default/mock session price
  } else if (clientSecret.startsWith('demo_package_')) {
    type = 'PACKAGE';
    id = clientSecret.replace('demo_package_', ''); // SINGLE, ESSENTIAL, SANCTUARY
    if (id === 'SINGLE') amountCents = 5000;
    else if (id === 'ESSENTIAL') amountCents = 22500;
    else if (id === 'SANCTUARY') amountCents = 40000;
  } else if (clientSecret.startsWith('demo_donation_')) {
    type = 'DONATION';
    const parts = clientSecret.replace('demo_donation_', '').split('_');
    id = parts[0] || 'GENERAL';
    amountCents = parseInt(parts[1] || '1000', 10);
  }

  const formatAmount = (cents: number): string => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    const formatted = value.length >= 2 ? `${value.substring(0, 2)}/${value.substring(2)}` : value;
    setExpiry(formatted);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvc(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cardholderName.trim()) {
      setError('Cardholder name is required.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length < 5) {
      setError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cvc.length < 3) {
      setError('Please enter a valid 3-digit CVC.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the H.I.P.S. terms of service.');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const token = await getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/checkout/demo-confirm', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type,
          id,
          amountCents,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Simulated payment processing failed.');
        setLoading(false);
        return;
      }

      setLoading(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('An error occurred during payment simulation.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-500 animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-wider font-ui text-zinc-300">Demo Mode Payment</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 font-ui">
          Bypassing Stripe
        </span>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between">
        <span className="text-sm text-zinc-400 font-body">Total Amount Due</span>
        <span className="text-xl font-black text-white font-heading">{formatAmount(amountCents)}</span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-ui" htmlFor="cardholderName">
            Cardholder Name
          </label>
          <input
            id="cardholderName"
            type="text"
            required
            disabled={loading}
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full h-11 px-3.5 rounded-lg border border-zinc-800 bg-zinc-950 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 outline-none transition-all font-body placeholder:text-zinc-600"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-ui" htmlFor="cardNumber">
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            required
            disabled={loading}
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className="w-full h-11 px-3.5 rounded-lg border border-zinc-800 bg-zinc-950 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 outline-none transition-all font-body placeholder:text-zinc-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-ui" htmlFor="expiry">
              Expiration
            </label>
            <input
              id="expiry"
              type="text"
              required
              disabled={loading}
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
              className="w-full h-11 px-3.5 rounded-lg border border-zinc-800 bg-zinc-950 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 outline-none transition-all font-body placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-ui" htmlFor="cvc">
              CVC
            </label>
            <input
              id="cvc"
              type="text"
              required
              disabled={loading}
              placeholder="123"
              value={cvc}
              onChange={handleCvcChange}
              className="w-full h-11 px-3.5 rounded-lg border border-zinc-800 bg-zinc-950 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 outline-none transition-all font-body placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              disabled={loading}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-850 bg-zinc-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-900 cursor-pointer"
            />
            <span className="text-[11px] text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors font-body select-none">
              I agree to the H.I.P.S. terms of service and acknowledge this is a mock payment simulation. No real funds will be charged.
            </span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="flex-1 h-11 rounded-lg border border-zinc-800 hover:bg-zinc-850 text-xs font-bold uppercase tracking-wider font-ui transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] h-11 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600/50 text-black text-xs font-black uppercase tracking-wider font-ui rounded-lg shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                Pay Demo Amount
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-ui uppercase tracking-wider">
        <Lock className="w-3 h-3" />
        Secure 256-bit Simulated SSL Encryption
      </div>
    </div>
  );
};
