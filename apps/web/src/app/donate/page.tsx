"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/polish/ToastProvider";

const tiers = [
  { label: "$25", value: 2500, tier: 'SUPPORTER' },
  { label: "$50", value: 5000, tier: 'BUILDER' },
  { label: "$100", value: 10000, tier: 'SUSTAINER' },
  { label: "$500", value: 50000, tier: 'CATALYST' },
] as const;

export default function DonatePage() {
  const [selected, setSelected] = useState<(typeof tiers)[number]>(tiers[1]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleDonate = async () => {
    setLoading(true);
    let errorThrown = false;
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selected.tier,
          amountCents: selected.value,
        }),
      });
      const data = await res.json();

      // Check HTTP status first
      if (!res.ok) {
        toast("error", data.error || 'Failed to initialize donation');
        errorThrown = true;
        return;
      }

      if (data.clientSecret) {
        router.push(`/checkout/donate?secret=${data.clientSecret}`);
      } else {
        toast("error", data.error || 'Failed to initialize donation');
      }
    } catch (e) {
      console.error('Donation initialization failed:', e);
      if (!errorThrown) {
        toast("error", 'An error occurred. Please try again.');
      }
    } finally {
      if (!errorThrown) {
        setLoading(false);
      }
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pb-32 overflow-x-hidden">
      <header className="pt-24 pb-16 text-center border-b border-white/5 bg-zinc-900/30">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Support the Mission</h1>
          <p className="text-xl text-zinc-400">
            Your tax-deductible donation funds our scholarship program, enabling individuals in financial distress to access our secure, anonymous support services for free.
          </p>
        </div>
      </header>

      <section className="container mx-auto px-6 max-w-4xl mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Make a Contribution</CardTitle>
              <CardDescription className="text-zinc-400">Select a tier or enter a custom amount.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {tiers.map(t => (
                  <button 
                    key={t.tier}
                    className={`h-16 text-lg border rounded-xl transition-all ${selected.tier === t.tier ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-zinc-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'}`}
                    onClick={() => setSelected(t)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <Button 
                size="lg" 
                className="w-full h-14 bg-white text-black hover:bg-zinc-200 text-lg disabled:opacity-50"
                onClick={handleDonate}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Continue to Payment"}
              </Button>
              <p className="text-xs text-center text-zinc-500 mt-4">
                Secure payment processed by Stripe. You will receive an IRS-compliant receipt for your 501(c)(3) contribution.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Your Impact</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-indigo-400 mb-2">$50 funds one session</h4>
                <p className="text-zinc-400 text-sm">Provides a full 45-minute peer support session for someone who otherwise couldn&apos;t afford it.</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">$200 funds a full program</h4>
                <p className="text-zinc-400 text-sm">Covers a 4-week workshop series for a participant dealing with severe workplace burnout.</p>
              </div>
              <div className="pt-6 border-t border-zinc-800">
                <p className="text-sm text-zinc-500 italic">
                  &quot;H.I.P.S. allowed me to get help without risking my security clearance. The scholarship made it possible when I was between jobs. Thank you.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
