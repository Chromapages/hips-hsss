"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  CalendarDays,
  Clock,
  User,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Loader2,
  Play,
  DollarSign,
} from "lucide-react";
import { WellbeingCheckIn } from "@/components/host/WellbeingCheckIn";
import { HostAvailabilitySlots } from "@/components/host/HostAvailabilitySlots";

export const dynamic = "force-dynamic";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppointmentStatus = "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface Appointment {
  id: string;
  clientHandle: string;
  serviceName: string;
  startsAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
}

// ─── Mock data (replace with real Firestore fetch later) ──────────────────────

const getMockAppointments = (): Appointment[] => {
  const today = new Date();
  const fmt = (h: number, m = 0): string => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  return [
    {
      id: "appt-001",
      clientHandle: "Brave-Owl-3",
      serviceName: "Emotional Support Session",
      startsAt: fmt(10, 0),
      durationMinutes: 50,
      status: "UPCOMING",
    },
    {
      id: "appt-002",
      clientHandle: "Silent-River-9",
      serviceName: "Peer Mentoring",
      startsAt: fmt(13, 30),
      durationMinutes: 50,
      status: "UPCOMING",
    },
    {
      id: "appt-003",
      clientHandle: "Gentle-Fox-2",
      serviceName: "Crisis Intervention",
      startsAt: fmt(15, 0),
      durationMinutes: 30,
      status: "UPCOMING",
    },
  ];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const statusStyles: Record<AppointmentStatus, string> = {
  UPCOMING: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  IN_PROGRESS: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  COMPLETED: "bg-bg-subtle text-muted-foreground border-border",
  CANCELLED: "bg-destructive text-destructive border-destructive",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function HostDashboard() {
  const { user, getToken } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarConfigured, setAvatarConfigured] = useState(false);

  useEffect(() => {
    // Check if avatar has been configured (stored in localStorage)
    const savedAvatar = typeof window !== "undefined"
      ? localStorage.getItem("hips-host-avatar")
      : null;
    setAvatarConfigured(!!savedAvatar);

    const loadAppointments = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch("/api/host/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, [getToken]);

  const firstName = user?.displayName?.split(" ")[0] ?? "Host";
  const todayCount = appointments.filter((a) => a.status === "UPCOMING" || a.status === "IN_PROGRESS").length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* ── Header ── */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-accent" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent font-ui">
            Host Console
          </span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-text">
          {getGreeting()}, {firstName}.
        </h1>
        <p className="mt-2 text-text-muted font-body">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* ── Avatar Setup CTA (shows when not configured) ── */}
      {!avatarConfigured && !loading && (
        <div className="mb-8 rounded-2xl border-2 border-accent/40 bg-gradient-to-r from-accent/8 to-white p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-accent" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-text font-ui text-sm">Complete your avatar setup</p>
              <p className="text-xs text-text-muted font-body mt-0.5">
                Configure your 3D avatar and voice settings before hosting sessions.
              </p>
            </div>
          </div>
          <Link
            href="/host/avatar-setup"
            aria-label="Set up your host avatar"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-bold uppercase tracking-wider font-ui hover:bg-accent transition-colors"
          >
            Set Up Now
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      )}

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          {
            label: "Today's Sessions",
            value: loading ? "—" : String(todayCount),
            icon: CalendarDays,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
          },
          {
            label: "Total Past Sessions",
            value: "148",
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Avatar Status",
            value: avatarConfigured ? "Ready" : "Setup needed",
            icon: User,
            color: avatarConfigured ? "text-accent" : "text-text",
            bg: avatarConfigured ? "bg-accent/10" : "bg-bg-subtle",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold font-ui">
                  {label}
                </p>
                <p className="text-2xl font-bold text-text font-heading">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid: Appointments + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <section className="lg:col-span-2" aria-label="Today's appointments">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-bold text-text flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" aria-hidden="true" />
              Today&apos;s Appointments
            </h2>
            <Link
              href="/host/appointments"
              className="text-xs font-medium text-text hover:text-accent transition-colors font-ui"
              aria-label="View all appointments"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 rounded-2xl border border-border bg-surface">
              <Loader2 className="w-6 h-6 animate-spin text-text/40" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-border bg-surface text-center px-6">
              <CalendarDays className="w-10 h-10 text-text-muted mb-3" aria-hidden="true" />
              <p className="font-bold text-text text-sm">No sessions today</p>
              <p className="text-xs text-text-muted mt-1 font-body">
                Your schedule is clear. Enjoy your day.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <article
                  key={appt.id}
                  className="group flex items-center justify-between p-5 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  aria-label={`Appointment with ${appt.clientHandle}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Anonymous avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-text/40" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-bold text-text text-sm font-ui">
                        {appt.clientHandle}
                      </p>
                      <p className="text-xs text-text-muted font-body">{appt.serviceName}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-text-muted flex items-center gap-1 font-ui">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {formatTime(appt.startsAt)} · {appt.durationMinutes} min
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border font-ui ${statusStyles[appt.status]}`}
                        >
                          {appt.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/session/host-${appt.id}`}
                    aria-label={`Join session with ${appt.clientHandle}`}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold font-ui hover:bg-primary-active transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    Join Room
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Right sidebar */}
        <aside className="space-y-5" aria-label="Quick actions">
          {/* Wellbeing pulse */}
          <WellbeingCheckIn />

          {/* Availability schedule */}
          <HostAvailabilitySlots getToken={getToken} />

          {/* Earnings Summary card */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="font-ui text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">
              Earnings Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1.5 border-b border-border">
                <span className="text-xs text-text-muted font-body">Session Rate</span>
                <span className="text-sm font-bold text-text">$35.00</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border">
                <span className="text-xs text-text-muted font-body">Completed Sessions</span>
                <span className="text-sm font-bold text-text">
                  {appointments.filter(a => a.status === 'COMPLETED').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border">
                <span className="text-xs text-text-muted font-body">Total Paid</span>
                <span className="text-sm font-bold text-text">
                  ${(appointments.filter(a => a.status === 'COMPLETED').length * 35).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs text-text-muted font-body">Pending Payout</span>
                <span className="text-sm font-bold text-accent">$70.00</span>
              </div>
            </div>
          </div>

          {/* Avatar & Voice Setup card */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-ui text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">
              Avatar &amp; Voice
            </h3>
            <div className="w-full aspect-square max-h-36 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-text/30" aria-hidden="true" />
            </div>
            <Link
              href="/host/avatar-setup"
              aria-label="Configure your avatar and voice"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-accent text-accent text-xs font-bold uppercase tracking-wider font-ui hover:bg-accent hover:text-white transition-all duration-200"
            >
              <User className="w-4 h-4" aria-hidden="true" />
              {avatarConfigured ? "Edit Avatar" : "Set Up Avatar"}
            </Link>
          </div>

          {/* Practice Session card */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-ui text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
              Practice Mode
            </h3>
            <p className="text-xs text-text-muted font-body mb-4">
              Run a solo session to test your avatar, voice settings, and controls before going live.
            </p>
            <Link
              href="/host/practice"
              aria-label="Start a practice session"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/8 border border-primary/20 text-text text-xs font-bold uppercase tracking-wider font-ui hover:bg-primary hover:text-white transition-all duration-200"
            >
              <Zap className="w-4 h-4" aria-hidden="true" />
              Start Practice Session
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
