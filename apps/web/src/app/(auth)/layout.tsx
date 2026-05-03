import React from "react";
import { Navbar } from "@/components/polish/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-hidden">
      <Navbar />
      
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="rounded-[2.5rem] border border-white/5 bg-zinc-950/50 p-8 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              {children}
            </div>
          </div>

          <div className="mt-8 text-center animate-in fade-in duration-1000 delay-500">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              Secured by Hard Anonymity Protocol
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
