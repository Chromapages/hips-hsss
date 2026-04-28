import { Navbar } from "@/components/polish/Navbar"
import { Shield, Lock, EyeOff, Heart } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-10" />
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Shield className="mr-2 h-4 w-4" />
            Hard Anonymity Guaranteed
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Support Without <br className="hidden md:block" /> the Spotlight.
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Hiding in Plain Sight provides expert peer support, coaching, and workshops in a completely anonymous, secure, and judgment-free virtual environment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Link
              className="inline-flex h-14 w-full items-center justify-center rounded-md bg-white px-8 text-lg font-medium text-black hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
              href="/services"
            >
              Browse Services
            </Link>
            <Link
              className="inline-flex h-14 w-full items-center justify-center rounded-md border border-gray-700 px-8 text-lg font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
              href="/organizations"
            >
              For Organizations
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Mission */}
      <section className="py-24 border-t border-white/5 bg-gray-950/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-start">
              <div className="h-12 w-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Zero Identity Leakage</h3>
              <p className="text-gray-400 leading-relaxed">
                Your real name and contact information are mathematically separated from your session data. Even our facilitators don&apos;t know who you are.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                <EyeOff className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Camera-Free Zones</h3>
              <p className="text-gray-400 leading-relaxed">
                All sessions utilize our immersive 3D abstract avatars. No cameras, no prejudice, just your voice and the support you need.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Safety</h3>
              <p className="text-gray-400 leading-relaxed">
                Our invisible Safety Engine monitors session transcripts in real-time to detect distress and automatically escalate to human crisis responders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20" />
        <div className="container mx-auto px-6 relative text-center">
          <h2 className="text-4xl font-bold mb-6">Help Us Keep the Lights Off.</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            H.I.P.S. is a registered nonprofit. Your donations fund our scholarship program, allowing individuals in financial distress to access our services for free.
          </p>
          <Link
            className="inline-flex h-14 items-center justify-center rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-10 text-lg font-medium text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:from-indigo-400 hover:to-purple-500"
            href="/donate"
          >
            Make a Donation
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 text-center text-sm text-gray-500">
        <p>Copyright &copy; 2026 Hiding in Plain Sight Foundation. All rights reserved.</p>
        <p className="mt-2 text-xs">H.I.P.S. provides coaching and peer support only. For immediate crisis help, call or text <a href="tel:988" className="text-gray-400 underline hover:text-white">988</a>.</p>
      </footer>
    </main>
  )
}
