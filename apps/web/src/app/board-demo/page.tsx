'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  ChevronDown, 
  User, 
  Activity, 
  ShieldAlert, 
  HelpCircle,
  Video,
  Briefcase,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/polish/Navbar';

interface BoardDemoCredential {
  role: 'PARTICIPANT' | 'FACILITATOR' | 'ADMIN';
  roleName: string;
  email: string;
  targetDashboard: string;
  description: string;
}

const BOARD_CREDS: BoardDemoCredential[] = [
  {
    role: 'PARTICIPANT',
    roleName: 'Participant (Peer)',
    email: 'board-participant@hips-demo.dev',
    targetDashboard: '/dashboard',
    description: 'Experience self-service session booking, package purchasing with Stripe bypass, and joining an avatar voice room.'
  },
  {
    role: 'FACILITATOR',
    roleName: 'Facilitator / Host',
    email: 'board-facilitator@hips-demo.dev',
    targetDashboard: '/facilitator',
    description: 'Inspect facilitation schedules, join live voice calls, and view peer connection matches.'
  },
  {
    role: 'ADMIN',
    roleName: 'System Administrator',
    email: 'board-admin@hips-demo.dev',
    targetDashboard: '/admin',
    description: 'Monitor live platform analytics, review safety logs and terms violations, and audit/approve scholarships.'
  }
];

interface ScenarioStep {
  id: string;
  text: string;
}

interface RoleScenario {
  role: 'PARTICIPANT' | 'FACILITATOR' | 'ADMIN';
  title: string;
  summary: string;
  steps: ScenarioStep[];
}

const SCENARIOS: RoleScenario[] = [
  {
    role: 'PARTICIPANT',
    title: 'Participant Scenario Walkthrough',
    summary: 'Test the end-to-end peer support loop, including intake, booking, and entering the virtual room.',
    steps: [
      { id: 'p1', text: 'Copy the Participant email (board-participant@hips-demo.dev) and click the Sign In button.' },
      { id: 'p2', text: 'Enter the password (HIPSDemo2025!) and complete sign in.' },
      { id: 'p3', text: 'Go to the Services tab, select a package, and click "Purchase".' },
      { id: 'p4', text: 'Fill in the simulated credit card, check terms, and click "Pay Demo Amount". Checkout is fully simulated (no real cards needed).' },
      { id: 'p5', text: 'After payment, you are redirected to the Participant Dashboard. Click "Try Demo Session" in the Quick Actions sidebar.' },
      { id: 'p6', text: 'Allow audio permissions, check your microphone connection, and enter the WebRTC voice space with our interactive avatar.' }
    ]
  },
  {
    role: 'FACILITATOR',
    title: 'Facilitator / Host Scenario Walkthrough',
    summary: 'Explore scheduling, peer session management, and live workspace controls.',
    steps: [
      { id: 'f1', text: 'Sign out from any active session, and copy the Facilitator email (board-facilitator@hips-demo.dev).' },
      { id: 'f2', text: 'Log in with password (HIPSDemo2025!) to enter the Facilitator portal.' },
      { id: 'f3', text: 'Review the appointment calendar, check pre-seeded match schedules, and explore the peer history list.' },
      { id: 'f4', text: 'Experience the Host interface by logging out and signing in as board-host@hips-demo.dev to see specialized room tools.' }
    ]
  },
  {
    role: 'ADMIN',
    title: 'Administrator Scenario Walkthrough',
    summary: 'Audit platform growth metrics, terms violations, and scholarship request queues.',
    steps: [
      { id: 'a1', text: 'Sign out and copy the Administrator email (board-admin@hips-demo.dev).' },
      { id: 'a2', text: 'Log in with password (HIPSDemo2025!) to load the system Admin dashboard.' },
      { id: 'a3', text: 'Inspect the 30-day growth and session charts. Verify that user registration and call volume data render correctly.' },
      { id: 'a4', text: 'Go to the Scholarship tab, filter requests by "Pending", and review details. Try approving a request.' },
      { id: 'a5', text: 'Examine the Safety Log alerts. Note how AI keyword match flags terms violations (e.g. self-harm, harassment) with transcript snippets.' }
    ]
  }
];

export default function BoardDemoPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PARTICIPANT' | 'FACILITATOR' | 'ADMIN'>('PARTICIPANT');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Load checked steps from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hips-demo-steps');
      if (saved) {
        setCheckedSteps(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse saved steps:', e);
    }
  }, []);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleStep = (stepId: string) => {
    const nextSteps = {
      ...checkedSteps,
      [stepId]: !checkedSteps[stepId]
    };
    setCheckedSteps(nextSteps);
    try {
      localStorage.setItem('hips-demo-steps', JSON.stringify(nextSteps));
    } catch (e) {
      console.error('Failed to save steps:', e);
    }
  };

  const handleResetChecklist = () => {
    setCheckedSteps({});
    try {
      localStorage.removeItem('hips-demo-steps');
    } catch (e) {
      console.error('Failed to clear steps:', e);
    }
  };

  const handleToggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const activeScenario = SCENARIOS.find(s => s.role === activeTab);

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 overflow-x-hidden pt-24 pb-20">
        
        {/* Decorative Grid and Blur Backgrounds */}
        <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-[10%] -right-[10%] w-[45%] h-[50%] rounded-full bg-accent/15 blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 space-y-16">
          
          {/* Header Hero Section */}
          <section className="text-center max-w-3xl mx-auto space-y-6 pt-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-amber-500 font-ui">
              <Sparkles className="w-3.5 h-3.5" />
              Board Review Mode Active
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              H.I.P.S. Platform <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
                Demonstration & Review
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 font-body leading-relaxed">
              Welcome to the H.I.P.S. Foundation review portal. This environment has been pre-configured 
              with simulated Stripe bypasses, logging fallbacks, and seed metrics to allow complete 
              testing of all user roles without external service dependencies.
            </p>
          </section>

          {/* Credentials and Accounts Table */}
          <section className="space-y-6" aria-labelledby="accounts-heading">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 id="accounts-heading" className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-500" />
                  Pre-Seeded Demo Credentials
                </h2>
                <p className="text-sm text-slate-400 font-body mt-1">
                  Click to copy details or click Login to redirect directly.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Password for all accounts: </span>
                <span className="text-white font-bold select-all ml-1">HIPSDemo2025!</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 font-ui bg-slate-900/40">
                    <th className="py-4 px-6">Role Profile</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Assigned Path</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-sm font-body">
                  {BOARD_CREDS.map((cred) => {
                    const emailCopyKey = `email_${cred.role}`;
                    const allCopyKey = `all_${cred.role}`;

                    return (
                      <tr key={cred.role} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-5 px-6">
                          <div className="font-semibold text-white">{cred.roleName}</div>
                          <div className="text-xs text-slate-400 mt-1 max-w-[280px]">
                            {cred.description}
                          </div>
                        </td>
                        <td className="py-5 px-6 font-mono text-slate-300">
                          {cred.email}
                        </td>
                        <td className="py-5 px-6 text-slate-400 font-mono">
                          {cred.targetDashboard}
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleCopyText(cred.email, emailCopyKey)}
                              className="inline-flex h-9 items-center gap-1.5 px-3 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs text-slate-300 transition-all outline-none focus:ring-1 focus:ring-amber-500"
                              aria-label={`Copy email for ${cred.roleName}`}
                            >
                              {copiedKey === emailCopyKey ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  Copy Email
                                </>
                              )}
                            </button>
                            <Link
                              href="/login"
                              className="inline-flex h-9 items-center gap-1.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-ui uppercase tracking-wide transition-all outline-none focus:ring-2 focus:ring-amber-500/50"
                              aria-label={`Login as ${cred.roleName}`}
                            >
                              Login
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Interactive Scenario Walkthrough Checklist */}
          <section className="space-y-6" aria-labelledby="scenarios-heading">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 id="scenarios-heading" className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  Interactive Audit Scenarios
                </h2>
                <p className="text-sm text-slate-400 font-body mt-1">
                  Select a workflow profile below to follow detailed audit actions step-by-step.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetChecklist}
                className="w-fit inline-flex h-9 items-center px-4 rounded-lg border border-slate-800 hover:bg-slate-900 text-xs text-slate-400 hover:text-white transition-all font-ui"
              >
                Reset Checklists
              </button>
            </div>

            {/* Scenario Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 border-b lg:border-b-0 lg:border-r border-slate-800 pr-0 lg:pr-6 shrink-0">
                {SCENARIOS.map((sc) => {
                  const isActive = activeTab === sc.role;
                  return (
                    <button
                      key={sc.role}
                      type="button"
                      onClick={() => setActiveTab(sc.role)}
                      className={cn(
                        "flex-1 lg:flex-initial text-left px-5 py-4 rounded-xl font-ui transition-all flex items-center gap-3 outline-none whitespace-nowrap lg:whitespace-normal",
                        isActive 
                          ? "bg-slate-900 border border-amber-500/30 text-white shadow-md shadow-amber-500/2" 
                          : "hover:bg-slate-900/40 text-slate-400 hover:text-white"
                      )}
                    >
                      <User className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-amber-500" : "text-slate-500")} />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider">
                          {sc.role === 'PARTICIPANT' ? 'Participant' : sc.role === 'FACILITATOR' ? 'Facilitator' : 'Admin'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-body hidden lg:block mt-0.5">
                          {sc.role === 'PARTICIPANT' ? 'Intake, Booking, & WebRTC' : sc.role === 'FACILITATOR' ? 'Schedules & Voice Control' : 'Analytics & Safety Logs'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Checklist Container */}
              <article className="lg:col-span-8 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-6">
                {activeScenario && (
                  <>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-white">
                        {activeScenario.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 font-body mt-1">
                        {activeScenario.summary}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {activeScenario.steps.map((step, index) => {
                        const isChecked = !!checkedSteps[step.id];
                        return (
                          <div 
                            key={step.id}
                            className={cn(
                              "flex gap-4 p-4 rounded-xl border transition-all duration-200",
                              isChecked 
                                ? "border-amber-500/20 bg-amber-500/[0.02]" 
                                : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                            )}
                          >
                            <label className="flex gap-4 cursor-pointer w-full group">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleStep(step.id)}
                                className="mt-1 h-5 w-5 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 cursor-pointer"
                              />
                              <div className="space-y-1 select-none">
                                <span className={cn(
                                  "text-xs font-semibold uppercase tracking-widest font-ui",
                                  isChecked ? "text-amber-500/70" : "text-slate-500"
                                )}>
                                  Step {index + 1}
                                </span>
                                <p className={cn(
                                  "text-sm font-body leading-relaxed transition-colors",
                                  isChecked ? "text-slate-400 line-through decoration-slate-650" : "text-slate-200 group-hover:text-white"
                                )}>
                                  {step.text}
                                </p>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </article>
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section className="space-y-6" aria-labelledby="faq-heading">
            <div>
              <h2 id="faq-heading" className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                Frequently Asked Review Questions
              </h2>
              <p className="text-sm text-slate-400 font-body mt-1">
                Technical details regarding simulated environments and server variables.
              </p>
            </div>

            <div className="space-y-3 max-w-4xl">
              {[
                {
                  q: "How does the Stripe checkout bypass function?",
                  a: "When the NEXT_PUBLIC_DEMO_MODE environment variable is set to true, the checkout intent generation API routes intercept Stripe request parameters and directly issue simulated client secrets (starting with 'demo_'). The frontend automatically replaces Stripe elements with our custom DemoPaymentForm component, which simulates processing and confirms transactions directly against our Firestore collection updates without contacting Stripe servers."
                },
                {
                  q: "Where do emails go if Resend is not configured?",
                  a: "If the Resend API key is missing, our transaction systems revert to developer-friendly mock mode. Confirmation emails (booking invoices, package receipts, scholarship updates) are formatted cleanly and written directly to the server terminal stdout console. This lets audit teams verify message payloads and trigger conditions on the server logs."
                },
                {
                  q: "Why are all links relative?",
                  a: "Since the platform is hosted on a VPS server and accessed via its IP address without a domain mapping, all redirect callbacks, success links, and internal routes are programmatically dynamic. They either use relative page targets or capture the browser window.origin dynamically to avoid domain resolve errors."
                },
                {
                  q: "How secure is this demo state?",
                  a: "Our simulated checkout API endpoint (/api/checkout/demo-confirm) is restricted to demo variables and requires token verification when authenticated. In production environments, setting NEXT_PUBLIC_DEMO_MODE=false automatically hard-disables all demo routes, card forms, and seed features."
                }
              ].map((faq, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <article 
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(index)}
                      className="w-full flex items-center justify-between p-5 text-left outline-none font-heading font-semibold text-white hover:bg-slate-900/20 transition-all"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base">{faq.q}</span>
                      <ChevronDown 
                        className={cn("w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4", isOpen && "rotate-180")} 
                      />
                    </button>
                    <div 
                      className={cn(
                        "px-5 pb-5 text-sm text-slate-400 font-body leading-relaxed border-t border-slate-850/50 pt-3",
                        isOpen ? "block animate-in fade-in duration-300" : "hidden"
                      )}
                    >
                      {faq.a}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Quick Support Link Footer Panel */}
          <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[30%] h-full bg-amber-500/5 blur-[50px] pointer-events-none" />
            <div className="space-y-2">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                Ready to Begin the Audit?
              </h3>
              <p className="text-sm text-slate-400 font-body max-w-xl">
                Proceed directly to the login portal. You can copy the profile emails from the table above for quick credential access.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex h-12 items-center gap-2 px-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-ui uppercase tracking-wide transition-all shadow-lg shadow-amber-500/10 shrink-0 hover:scale-[1.01] active:scale-[0.99] outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              Start Demonstration
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

        </div>
      </main>
    </>
  );
}
