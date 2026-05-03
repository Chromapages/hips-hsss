"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

export function BookingSummaryBar({
  serviceId,
  serviceName,
  date,
  time,
}: {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
}) {
  const [isBooking, setIsBooking] = useState(false);
  const { getToken } = useAuth();
  const router = useRouter();

  if (!date || !time) {
    return null;
  }

  const handleBook = async () => {
    setIsBooking(true);
    try {
      const token = await getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/sessions/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          startsAt: time, // time is already ISO string from TimeSlotGrid
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/checkout/${data.session.id}`);
      } else {
        alert(data.error || "Booking failed");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book session. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <aside className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="rounded-3xl border border-white/10 bg-black/60 p-4 shadow-2xl shadow-indigo-500/10 backdrop-blur-3xl ring-1 ring-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center text-xl">
              ✨
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-0.5">Selected Session</p>
              <p className="text-sm font-black tracking-tight text-white">
                {serviceName} • {format(parseISO(time), 'eee, MMM d @ h:mm a')}
              </p>
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={isBooking}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-2xl bg-white px-8 font-black tracking-tighter text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-10" />
            {isBooking ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Continue to Checkout</span>
                <span className="text-lg">→</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
