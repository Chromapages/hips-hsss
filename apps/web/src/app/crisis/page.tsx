'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/polish/Navbar';
import { ShieldAlert, Phone, Heart, Lock, MessageCircle, ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CrisisPage() {
  const [breathStage, setBreathStage] = useState<'Inhale' | 'Hold' | 'Exhale' | 'HoldOut'>('Inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setBreathStage((current) => {
            switch (current) {
              case 'Inhale': return 'Hold';
              case 'Hold': return 'Exhale';
              case 'Exhale': return 'HoldOut';
              case 'HoldOut': return 'Inhale';
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white text-primary selection:bg-primary/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.15)_0%,transparent_70%)] -z-10" />
        <div className="absolute top-[30%] -left-[10%] w-[40%] h-[400px] bg-red-600/5 blur-[120px] rounded-full -z-10 animate-pulse" />

        <div className="container mx-auto px-6 text-center relative">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-50 backdrop-blur-xl px-4 py-1.5 text-xs font-bold text-red-600 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 brand-caps"
            role="status"
            aria-live="polite"
          >
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            Crisis Support Available 24/7
          </div>

          <div className="flex flex-col items-center justify-center mb-8">
            <div
              className="p-6 bg-red-50 rounded-3xl border border-red-200 mb-8 animate-pulse"
              aria-hidden="true"
            >
              <ShieldAlert className="w-16 h-16 text-red-500" />
            </div>

            {/* H1 - serif heading */}
            <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-[0.9] bg-gradient-to-b from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Crisis Support
            </h1>

            <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 font-body">
              If you or someone you know is in immediate danger, please contact emergency services or reach out to one of the crisis resources below.
            </p>
          </div>
        </div>
      </section>

      {/* Breathing Exercise */}
      <section className="pb-16 container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div
            className="w-full py-12 bg-surface rounded-3xl border border-border"
            role="region"
            aria-label="Guided breathing exercise for calming"
          >
            <div className="flex flex-col items-center space-y-6">
              {/* H2 - serif heading */}
              <h2 className="font-heading text-xl font-bold text-primary">Take a Moment to Breathe</h2>
              <div
                className={`w-40 h-40 rounded-full border-4 border-emerald-500/50 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
                  breathStage === 'Inhale' ? 'scale-125 bg-emerald-500/20' :
                  breathStage === 'Exhale' ? 'scale-75 bg-transparent' : 'scale-100'
                }`}
                aria-live="polite"
              >
                <span className="text-4xl font-bold text-emerald-600 font-heading">{countdown}</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600 uppercase tracking-widest animate-pulse font-ui">
                {breathStage.replace('HoldOut', 'Hold')}
              </p>
              <p className="text-sm text-muted font-body">Box Breathing for grounding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Resources */}
      <section className="pb-32 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* H2 - serif heading */}
          <h2 className="font-heading text-3xl font-bold tracking-tight mb-4 text-center text-primary">Crisis Resources</h2>
          <p className="text-secondary text-center mb-12 max-w-xl mx-auto font-body">
            These resources are available 24/7. You deserve support.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 988 Lifeline */}
            <div className="p-8 rounded-3xl bg-white border border-border hover:border-red-500/30 transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <Phone className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  {/* H3 - serif heading */}
                  <h3 className="font-heading text-xl font-bold mb-1 text-primary">988 Suicide & Crisis Lifeline</h3>
                  <p className="text-sm text-muted font-body">United States</p>
                </div>
              </div>
              <p className="text-secondary text-sm mb-6 leading-relaxed font-body">
                Free, confidential support for people in distress. Available 24/7 for anyone experiencing emotional distress or suicidal crisis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:988"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white font-ui uppercase tracking-wide"
                  aria-label="Call 988 Suicide and Crisis Lifeline"
                >
                  <Phone className="w-4 h-4" />
                  Call 988
                </a>
                <a
                  href="tel:988"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-surface hover:bg-border text-primary rounded-xl font-medium transition-all border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white font-ui uppercase tracking-wide"
                  aria-label="Text 988 Suicide and Crisis Lifeline"
                >
                  <MessageCircle className="w-4 h-4" />
                  Text 988
                </a>
              </div>
            </div>

            {/* Crisis Text Line */}
            <div className="p-8 rounded-3xl bg-white border border-border hover:border-emerald-500/30 transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <MessageCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  {/* H3 - serif heading */}
                  <h3 className="font-heading text-xl font-bold mb-1 text-primary">Crisis Text Line</h3>
                  <p className="text-sm text-muted font-body">Text HOME to 741741</p>
                </div>
              </div>
              <p className="text-secondary text-sm mb-6 leading-relaxed font-body">
                Free 24/7 support via text message. Connect with a trained crisis counselor who can help you work through difficult emotions.
              </p>
              <a
                href="sms:741741&body=HOME"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white font-ui uppercase tracking-wide"
                aria-label="Text HOME to 741741 to connect with Crisis Text Line"
              >
                <MessageCircle className="w-4 h-4" />
                Text HOME to 741741
              </a>
            </div>

            {/* 988 Chat */}
            <div className="p-8 rounded-3xl bg-white border border-border hover:border-primary/30 transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  {/* H3 - serif heading */}
                  <h3 className="font-heading text-xl font-bold mb-1 text-primary">988 Online Chat</h3>
                  <p className="text-sm text-muted font-body">Confidential web support</p>
                </div>
              </div>
              <p className="text-secondary text-sm mb-6 leading-relaxed font-body">
                Prefer to chat online? The 988 Lifeline offers web chat support for individuals in emotional distress or suicidal crisis.
              </p>
              <a
                href="https://988lifeline.org/chat/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white font-ui uppercase tracking-wide"
                aria-label="Start an online chat with 988 Lifeline (opens in new tab)"
              >
                <Heart className="w-4 h-4" />
                Start Chat
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>

            {/* International Resources */}
            <div className="p-8 rounded-3xl bg-white border border-border hover:border-accent/30 transition-all group">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
                  <ExternalLink className="w-6 h-6 text-accent" />
                </div>
                <div>
                  {/* H3 - serif heading */}
                  <h3 className="font-heading text-xl font-bold mb-1 text-primary">International Resources</h3>
                  <p className="text-sm text-muted font-body">Global crisis support</p>
                </div>
              </div>
              <p className="text-secondary text-sm mb-6 leading-relaxed font-body">
                If you are outside the United States, find crisis support hotlines available in your country.
              </p>
              <a
                href="https://findahelpline.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-surface hover:bg-border text-primary rounded-xl font-medium transition-all border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white font-ui uppercase tracking-wide"
                aria-label="Find international crisis resources (opens in new tab)"
              >
                Find International Resources
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="pb-32 container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 text-xs text-muted justify-center font-body">
            <Lock className="w-3 h-3" />
            <span>Your safety matters to us. If you are in immediate danger, please call your local emergency services.</span>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pb-20 container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-secondary mb-6 font-body">When you are ready, we are here.</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-xl shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white font-ui uppercase tracking-wide"
          >
            Explore Support Services
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center space-x-3 grayscale opacity-50">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold tracking-tight text-xl text-primary font-heading">HSSS</span>
            </div>

            <div className="max-w-xl text-[10px] text-muted leading-relaxed space-y-2 font-body">
              <p>
                HSSS provides coaching and peer support only. We are not a medical provider and do not provide medical advice or emergency care.
                For immediate crisis help, call or text <a href="tel:988" className="text-accent hover:text-accent-dark transition-colors">988</a> (USA) or contact your local emergency services.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
