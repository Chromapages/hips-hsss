'use client'
import { Metadata } from 'next';

type CheckoutErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export const metadata: Metadata = {
  title: 'Checkout Error — H.I.P.S.',
  description: 'Payment checkout failed.',
};

export default function CheckoutError({ error, reset }: CheckoutErrorProps) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-zinc-400">
            We couldn't process your payment. No charges were made.
          </p>
        </div>
        {error?.digest && (
          <p className="text-xs text-zinc-600 font-mono mb-6">Error: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-colors"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-medium text-zinc-300 transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
