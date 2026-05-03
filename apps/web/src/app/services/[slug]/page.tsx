import Link from "next/link";
import { ShieldAlert, ArrowLeft, CheckCircle2, Lock, EyeOff, MessageSquare } from "lucide-react";
import { SERVICES_CATALOG } from "@/lib/services-data";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/polish/Navbar";
import { PricingSwitcher } from "@/components/polish/PricingSwitcher";
import { Button } from "@/components/ui/button";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES_CATALOG.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const steps = [
    {
      icon: Lock,
      title: "Anonymous Entry",
      desc: "Join using your unique session token. Your real identity remains decoupled from your presence.",
    },
    {
      icon: EyeOff,
      title: "Avatar Native",
      desc: "Represent yourself with a curated 3D abstract avatar. No cameras, no prejudice, no exposure.",
    },
    {
      icon: MessageSquare,
      title: "Support Focus",
      desc: "Engage in meaningful, voice-based support led by experts who focus on your story, not your appearance.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white pb-32 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-24 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_70%)] -z-10" />
        <div className="container mx-auto px-6 max-w-6xl">
          <Link 
            href="/services" 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white mb-10 transition-colors"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <service.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">{service.category}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed">
                {service.description}
              </p>
            </div>
            
            <div className="flex gap-4 md:mb-2">
              <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-zinc-400">
                {service.duration}
              </div>
              <div className="px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available Now
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 max-w-6xl py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-20">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-black tracking-tighter mb-8">About this session</h2>
              <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                {service.longDescription}
              </p>
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                Commitment to Anonymity
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                {[
                  "Mathematically decoupled PII",
                  "No camera hardware allowed",
                  "3D abstract representation",
                  "Voice-only interactions",
                  "Secure session tokens",
                  "Human-in-the-loop safety"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-500 text-sm p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* How it Works Timeline */}
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-12">How it works.</h2>
              <div className="space-y-12 relative">
                <div className="absolute left-[27px] top-4 bottom-4 w-[1px] bg-white/5" />
                {steps.map((step, i) => (
                  <div key={step.title} className="flex gap-8 relative group">
                    <div className="h-14 w-14 rounded-full bg-black border border-white/10 flex items-center justify-center shrink-0 z-10 transition-all group-hover:border-indigo-500/50 group-hover:bg-indigo-600/5">
                      <step.icon className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div className="pt-2">
                      <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crisis Warning */}
            <div className="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-6 animate-in fade-in slide-in-from-bottom-4">
              <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div className="space-y-2">
                <h4 className="font-bold text-amber-200">Important Disclaimer</h4>
                <p className="text-sm text-amber-200/60 leading-relaxed">
                  HSSS provides peer support, coaching, and support navigation. It is not emergency care. We do not provide psychiatric evaluation or medical advice. If you are experiencing a medical emergency or active crisis, please call or text <a href="tel:988" className="text-amber-500 font-bold hover:underline">988</a> (USA) or contact your local emergency services.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <PricingSwitcher standardPrice={service.price} />
              
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Questions?</span>
                  <span className="text-sm font-bold text-white">Anonymous Support Chat</span>
                </div>
                <Button size="sm" variant="ghost" className="rounded-xl text-indigo-400 hover:text-indigo-300">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
