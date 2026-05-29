'use client';

import dynamic from 'next/dynamic';
import { Shield, Users, HeartPulse, Zap, CheckCircle2 } from 'lucide-react';

const DashboardLayout = dynamic(
  () => import('@/components/dashboard/DashboardLayout'),
  { ssr: false }
);

const PACKAGES = [
  {
    id: 'SINGLE',
    name: 'Single Session',
    price: 50,
    description: 'Perfect for a one-time crisis or a trial of the sanctuary experience.',
    features: ['1 Live Session', 'Voice Masking included', 'Standard Support'],
    icon: Zap,
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'ESSENTIAL',
    name: 'Essential Pack',
    price: 225,
    sessions: 5,
    description: 'Our most popular choice for ongoing peer-to-peer healing.',
    features: ['5 Live Sessions', 'Voice Masking included', 'Priority Matching', '10% Savings'],
    popular: true,
    icon: Users,
    color: 'from-indigo-500/20 to-purple-500/20',
  },
  {
    id: 'SANCTUARY',
    name: 'Sanctuary Pack',
    price: 400,
    sessions: 10,
    description: 'The complete commitment to your safety and long-term recovery.',
    features: ['10 Live Sessions', 'Voice Masking included', 'White-glove Support', '20% Savings'],
    icon: Shield,
    color: 'from-emerald-500/20 to-teal-500/20',
  },
];

const SERVICES = [
  {
    title: 'Peer-to-Peer Sanctuary',
    description: 'Connect with trained peers who understand your lived experience in a safe, anonymous environment.',
    icon: Users,
  },
  {
    title: 'Crisis Escalation',
    description: 'Immediate access to high-level support if your safety or the safety of others is at risk.',
    icon: HeartPulse,
  },
  {
    title: 'Anonymous Mentorship',
    description: 'Long-term guidance from those who have successfully navigated similar paths.',
    icon: Shield,
  },
];

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Sanctuary <span className="text-indigo-500">Access</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Secure your sessions in the Virtual Sanctuary. All packages include our proprietary Hard Anonymity Protocol and real-time voice masking.
          </p>
        </header>

        {/* Pricing Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-3xl p-8 ring-1 ring-white/10 transition-all hover:ring-indigo-500/50 ${
                pkg.popular ? 'bg-white/5 ring-indigo-500' : 'bg-zinc-900/50'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-black uppercase tracking-wider text-white">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-x-4">
                <div className={`rounded-xl bg-gradient-to-br ${pkg.color} p-3`}>
                  <pkg.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-400">{pkg.description}</p>

              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-black tracking-tight text-white">${pkg.price}</span>
                <span className="text-sm font-semibold leading-6 text-zinc-500">USD</span>
              </p>

              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-zinc-300">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckCircle2 className="h-6 w-5 flex-none text-indigo-400" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 block rounded-xl px-3 py-3 text-center text-sm font-black transition-all bg-white/10 text-white">
                Get Started
              </div>
            </div>
          ))}
        </div>

        {/* Feature Blocks */}
        <div className="mt-32 border-t border-white/5 pt-16">
          <h2 className="text-2xl font-bold text-white">Included with every session</h2>
          <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div key={service.title} className="group relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                  <service.icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      </DashboardLayout>
  );
}