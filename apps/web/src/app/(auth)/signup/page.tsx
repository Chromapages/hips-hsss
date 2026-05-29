"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const dynamic = "force-dynamic";import { auth } from "@/lib/firebase-client";

export const dynamic = "force-dynamic";import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";import Link from "next/link";

export const dynamic = "force-dynamic";import { Loader2, Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PARTICIPANT" | "ORGBUYER">("PARTICIPANT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!auth) throw new Error("Firebase auth not initialized");
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      
      // Note: Custom claims (role) are usually set via a backend function (Phase 2.3)
      // For now, we sync with the Commerce DB which will assign the default role
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, role }),
      });

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);

      // Handle specific Firebase error codes
      if (err.code === 'auth/unauthorized-domain') {
        setError("Sign-up is not available from this domain. Please try again later.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">New Sanctuary.</h1>
        <p className="text-sm font-medium text-zinc-500">Begin your journey with hard anonymity protection.</p>
      </div>

      <div className="flex p-1 rounded-2xl bg-white/5 border border-white/5">
        <button
          onClick={() => setRole("PARTICIPANT")}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            role === "PARTICIPANT" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
          }`}
        >
          Participant
        </button>
        <button
          onClick={() => setRole("ORGBUYER")}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            role === "ORGBUYER" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
          }`}
        >
          Partner/Org
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1" htmlFor="signup-display-name">Display Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
            <input
              id="signup-display-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous Voyager"
              className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1" htmlFor="signup-email">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1" htmlFor="signup-password">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
            <input
              id="signup-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
            Your credentials are used solely for billing and account management. 
            Session data remains strictly decoupled and anonymous.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center animate-in shake-in duration-300">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="group relative w-full h-16 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white font-black tracking-tighter text-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-10" />
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">Create Account</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-xs font-medium text-zinc-500">
          Already have a sanctuary?{" "}
          <Link href="/login" className="text-white font-bold hover:text-indigo-400 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
