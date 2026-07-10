'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Loader2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type DonationTier = 'SUPPORTER' | 'BUILDER' | 'SUSTAINER' | 'CATALYST';

interface TierOption {
  id: DonationTier;
  label: string;
  amount: number;
}

const TIER_OPTIONS: TierOption[] = [
  { id: 'SUPPORTER', label: '$25 Supporter', amount: 25 },
  { id: 'BUILDER', label: '$50 Builder', amount: 50 },
  { id: 'SUSTAINER', label: '$100 Sustainer', amount: 100 },
  { id: 'CATALYST', label: '$500 Catalyst', amount: 500 },
];

export const DonationPanel: React.FC = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  
  const [selectedTier, setSelectedTier] = useState<DonationTier>('SUSTAINER');
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectTier = (tierId: DonationTier) => {
    setSelectedTier(tierId);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    setIsCustom(true);
  };

  const handleCustomFocus = () => {
    setIsCustom(true);
  };

  const getAmountCents = (): number => {
    if (isCustom) {
      const amt = parseInt(customAmount, 10);
      return isNaN(amt) ? 0 : amt * 100;
    }
    const option = TIER_OPTIONS.find((o) => o.id === selectedTier);
    return option ? option.amount * 100 : 0;
  };

  const handleKeyDownSubmit = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDonateSubmit();
    }
  };

  const handleDonateSubmit = async () => {
    const cents = getAmountCents();
    if (cents <= 0) {
      toast.error('Please select or enter a valid donation amount.');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Map tier to one of the accepted values
      const tierPayload = isCustom ? 'SUSTAINER' : selectedTier;

      const res = await fetch('/api/donations', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tier: tierPayload,
          amountCents: cents,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize donation.');
      }

      if (!data.clientSecret) {
        throw new Error('No client secret returned.');
      }

      router.push(`/checkout/donate?secret=${data.clientSecret}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred while creating your donation.');
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-card border border-border bg-bg-subtle p-8 md:p-10 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-accent animate-pulse" />
          <h3 className="font-heading text-2xl font-bold text-text">Make a Lasting Impact</h3>
        </div>
        <p className="text-text-secondary text-sm font-body leading-relaxed mb-6">
          Select a tier or enter a custom amount to provide anonymous support and scholarship access.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {TIER_OPTIONS.map((option) => {
            const isCurrent = !isCustom && selectedTier === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectTier(option.id)}
                className={cn(
                  "h-12 flex items-center justify-center text-sm border rounded-xl font-bold transition-all outline-none focus:ring-2 focus:ring-primary/40",
                  isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-text hover:border-primary hover:bg-primary/5"
                )}
                aria-label={`Donate ${option.label}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mb-6">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 block font-ui">
            Custom Amount ($ USD)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-text-secondary">
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Other Amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              onFocus={handleCustomFocus}
              className={cn(
                "w-full h-12 pl-7 pr-4 rounded-xl border bg-surface text-sm outline-none transition-all font-body",
                isCustom
                  ? "border-primary ring-2 ring-primary/10"
                  : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
              )}
              aria-label="Enter custom donation amount"
            />
          </div>
        </div>
      </div>

      <div>
        <Button
          type="button"
          onClick={handleDonateSubmit}
          onKeyDown={handleKeyDownSubmit}
          disabled={loading}
          tabIndex={0}
          className="w-full h-12 bg-primary text-white hover:bg-accent transition-all font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2"
          aria-label="Submit donation"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Initializing secure checkout...
            </>
          ) : (
            <>
              Donate ${((getAmountCents()) / 100).toFixed(2)}
            </>
          )}
        </Button>
        <p className="text-[11px] text-center text-text-muted mt-4 font-body">
          100% of your tax-deductible donation directly funds H.I.P.S. scholarships.
        </p>
      </div>
    </div>
  );
};
