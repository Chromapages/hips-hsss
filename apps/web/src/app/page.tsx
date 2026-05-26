import { Navbar } from "@/components/polish/Navbar"
import { ImpactStats } from "@/components/polish/ImpactStats"
import { Shield, Lock, EyeOff, Heart, ChevronRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-52 overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15)_0%,transparent_70%)] -z-10" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10 animate-pulse" />
        
        <div className="container mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-1.5 text-xs font-bold text-indigo-400 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            LIVE PEER SUPPORT NETWORK
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.9] bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Support Without <br /> the Spotlight.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            Expert peer support, coaching, and workshops in a completely anonymous, camera-free virtual environment. Built on hard-anonymity protocols.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Button asChild className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-zinc-200 text-lg font-bold shadow-[0_0_40px_rgba(255,255,255,0.1)] group">
              <Link href="/services">
                Browse Services
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="ghost" asChild className="h-16 px-10 rounded-2xl border border-white/10 text-white hover:bg-white/5 text-lg font-bold">
              <Link href="/organizations">
                For Organizations
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="pb-32 container mx-auto px-6">
        <ImpactStats />
      </section>

      {/* Features Grid */}
      <section className="py-32 border-t border-white/5 bg-zinc-950/20 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Designed for True Anonymity.</h2>
              <p className="text-zinc-500 leading-relaxed">
                HSSS isn&apos;t just camera-free. Our entire architecture is built to separate your identity from your interaction.
              </p>
            </div>
            <Link href="/about" className="text-sm font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-2 group transition-all">
              Learn about our protocol
              <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Identity Vault",
                desc: "Your PII is stored in an isolated, encrypted vault that never touches session servers.",
                color: "text-indigo-400",
                bg: "bg-indigo-500/10",
                border: "border-indigo-500/20"
              },
              {
                icon: EyeOff,
                title: "Avatar Native",
                desc: "No cameras. You are represented by a curated 3D abstract avatar that protects your visual identity.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20"
              },
              {
                icon: Shield,
                title: "Safety Engine",
                desc: "Human-in-the-loop safety monitoring detects distress without compromising anonymity.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20"
              }
            ].map((feature) => (
              <div key={feature.title} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110", feature.bg, feature.border)}>
                  <feature.icon className={cn("h-7 w-7", feature.color)} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Quotes */}
      <section className="py-32 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black tracking-tighter mb-4">What people are saying.</h2>
          <p className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.3em]">Verified Anonymous Feedback</p>
        </div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {[
            "Finally a space where I don't have to perform or hide my face to get support.",
            "The 3D environment makes it feel like a real meeting room, but without the anxiety of being seen.",
            "As a professional, the hard anonymity was the only reason I felt safe joining a group session.",
            "The facilitators are incredible. They focus on the voice, the heart, and the story.",
            "I've never seen a platform take security this seriously while still feeling so human.",
            "The scholarship program changed my life. I couldn't have afforded this otherwise."
          ].map((quote, i) => (
            <div key={i} className="break-inside-avoid p-8 rounded-3xl bg-zinc-950 border border-white/5 hover:border-white/10 transition-all italic text-zinc-300 leading-relaxed relative group">
              <span className="absolute -top-4 -left-2 text-6xl text-indigo-500/20 font-serif group-hover:text-indigo-500/40 transition-colors">“</span>
              {quote}
            </div>
          ))}
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-32 relative overflow-hidden container mx-auto px-6">
        <div className="rounded-[3rem] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <Heart className="w-12 h-12 text-indigo-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">Help Us Keep the <br /> Lights Off.</h2>
            <p className="text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed">
              HSSS is a registered 501(c)(3) nonprofit. Your contributions fund our scholarship program, enabling anonymous support for those in financial distress.
            </p>
            <Button asChild className="h-16 px-12 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 text-lg font-bold shadow-2xl shadow-indigo-900/40">
              <Link href="/donate">
                Sponsor a Session
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-20 text-center relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center space-x-3 grayscale opacity-50">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                <EyeOff className="w-4 h-4 text-white" />
              </div>
              <span className="font-black tracking-tighter text-xl text-white">HSSS</span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>

            <div className="max-w-2xl text-[10px] text-zinc-700 leading-relaxed space-y-4">
              <p>Copyright &copy; 2026 Hiding in Plain Sight Foundation. All rights reserved.</p>
              <p>
                HSSS provides coaching and peer support only. We are not a medical provider and do not provide medical advice or emergency care.
                For immediate crisis help, call or text <a href="tel:988" className="text-zinc-500 hover:text-white transition-colors">988</a> (USA) or contact your local emergency services.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
