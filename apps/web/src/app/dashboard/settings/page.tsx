"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  User,
  ShieldCheck,
  Lock,
  LogOut,
  RefreshCw,
  EyeOff,
  Bell,
  MicOff,
  UserRound
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function SettingsPage() {
  const { user, role, logout } = useAuth();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const idToken = await user?.getIdToken(true);
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      toast.success("Identity profile synchronized with Firestore");
    } catch (error) {
      toast.error("Failed to sync profile");
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-4xl px-6 py-12 pb-32">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-6">
            <ShieldCheck className="w-3 h-3" />
            Privacy Integrity: Active
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">System Settings.</h1>
          <p className="mt-4 text-zinc-500 max-w-xl">
            Configure your anonymity preferences and manage your secure connection to the Hard Anonymity Protocol.
          </p>
        </header>

        <div className="space-y-10">
          {/* Identity Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-600 px-2">Identity Guard</h3>
            <div className="rounded-[2rem] border border-white/5 bg-zinc-950 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                  <UserRound className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xl font-bold text-white">{user?.email}</p>
                  <p className="text-sm text-zinc-500">Protocol Assigned Role: <span className="text-indigo-400 font-mono">{role || 'PARTICIPANT'}</span></p>
                  <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Encrypted Session Link Active
                  </div>
                </div>
                <button 
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  Sync Profile
                </button>
              </div>
            </div>
          </section>

          {/* Anonymity Protocol Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-600 px-2">Anonymity Protocols</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { 
                  title: "Voice Masking", 
                  desc: "Enable real-time voice anonymization in sessions.", 
                  icon: MicOff,
                  active: true 
                },
                { 
                  title: "Avatar Projection", 
                  desc: "Replace camera feed with a generated silhouette.", 
                  icon: EyeOff,
                  active: true 
                },
                { 
                  title: "Ghost Routing", 
                  desc: "Obfuscate IP metadata during live interactions.", 
                  icon: ShieldCheck,
                  active: true 
                },
                { 
                  title: "Silent Notifications", 
                  desc: "Mute all platform alerts during deep work.", 
                  icon: Bell,
                  active: false 
                },
              ].map((protocol) => (
                <div key={protocol.title} className="group p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${protocol.active ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-800/50 text-zinc-600'}`}>
                      <protocol.icon className="w-5 h-5" />
                    </div>
                    <div className={`h-6 w-10 rounded-full border border-white/10 relative cursor-pointer p-1 transition-colors ${protocol.active ? 'bg-indigo-600 border-indigo-400' : 'bg-zinc-900'}`}>
                      <div className={`h-full aspect-square rounded-full bg-white shadow-sm transition-transform ${protocol.active ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  <h4 className="font-bold text-white mb-1">{protocol.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{protocol.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Account Security */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-600 px-2">Security & Access</h3>
            <div className="divide-y divide-white/5 rounded-[2rem] border border-white/5 bg-zinc-950 overflow-hidden">
              <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all text-left">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/5">
                    <Lock className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Reset Credentials</p>
                    <p className="text-xs text-zinc-500">Update your account password and keys.</p>
                  </div>
                </div>
                <div className="text-zinc-600">→</div>
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-6 hover:bg-red-500/5 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-red-500/10">
                    <LogOut className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-bold text-red-400">Terminate Session</p>
                    <p className="text-xs text-red-900/60">Securely sign out of the HSSS environment.</p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </div>

        <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
            Hard Anonymity Protocol v1.0.4-stable
          </p>
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
            Last Sync: {new Date().toLocaleTimeString()}
          </p>
        </footer>
      </section>
    </DashboardLayout>
  );
}
