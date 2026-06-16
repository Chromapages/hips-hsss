'use client';

import { useState, useEffect } from 'react';

export function BreathingCalmer() {
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
    <div
      className="w-full py-12 bg-surface rounded-3xl border border-border"
      role="region"
      aria-label="Guided breathing exercise for calming"
    >
      <div className="flex flex-col items-center space-y-6">
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
  );
}
