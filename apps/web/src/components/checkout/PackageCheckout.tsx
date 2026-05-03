'use client';

import { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe-client';
import { useAuth } from '@/components/auth/AuthProvider';
import { X, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';

function CheckoutForm({ amount, packageName, onClose }: { amount: number, packageName: string, onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?purchase=success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    } else {
      // Stripe will redirect the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">{packageName}</h3>
        <p className="text-sm text-zinc-400">Total Due: ${amount.toFixed(2)} USD</p>
      </div>

      <PaymentElement 
        options={{
          layout: 'tabs',
        }} 
      />

      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4 pt-4">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing Securely...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
        
        <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
           <div className="flex items-center gap-1">
             <Lock className="h-3 w-3" />
             Encrypted
           </div>
           <div className="flex items-center gap-1">
             <ShieldCheck className="h-3 w-3" />
             PCI Compliant
           </div>
        </div>
      </div>
    </form>
  );
}

export function PackageCheckout({ packageId, onClose }: { packageId: 'SINGLE' | 'ESSENTIAL' | 'SANCTUARY', onClose: () => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [packageInfo, setPackageInfo] = useState<{ name: string, amount: number } | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    async function initializeCheckout() {
      try {
        const token = await getToken();
        const response = await fetch('/api/checkout/package-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ packageId }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setClientSecret(data.clientSecret);
        setPackageInfo({ name: data.packageName, amount: data.amount });
      } catch (err: any) {
        toast.error('Failed to initialize checkout: ' + err.message);
        onClose();
      }
    }

    initializeCheckout();
  }, [packageId, getToken, onClose]);

  if (!clientSecret || !packageInfo) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-white font-medium">Securing connection to Stripe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <Elements 
            stripe={getStripe()} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'night',
                labels: 'floating',
              }
            }}
          >
            <CheckoutForm 
              amount={packageInfo.amount} 
              packageName={packageInfo.name} 
              onClose={onClose} 
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
