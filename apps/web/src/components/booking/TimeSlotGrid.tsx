"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Moon } from "lucide-react";

export interface TimeSlot {
  startsAt: string;
  endsAt: string;
}

export function TimeSlotGrid({
  date,
  serviceId,
  onSelect,
}: {
  date: string;
  serviceId: string;
  onSelect: (slot: string) => void;
}) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (!date || !serviceId) return;

    async function fetchSlots() {
      setLoading(true);
      try {
        const res = await fetch(`/api/sessions/availability?serviceId=${serviceId}`);
        const allSlots = await res.json();
        
        // Filter slots for the selected date (YYYY-MM-DD)
        const filtered = allSlots.filter((s: TimeSlot) => s.startsAt.startsWith(date));
        setSlots(filtered);
      } catch (error) {
        console.error('Failed to fetch slots:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [date, serviceId]);

  if (!date) {
    return (
      <section className="rounded-[2rem] border border-white/5 bg-zinc-950/50 p-10 flex flex-col items-center justify-center text-center min-h-[300px] border-dashed">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Calendar className="w-6 h-6 text-zinc-600" />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-600">
          Select a date to view<br />available session times
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="rounded-[2rem] border border-white/5 bg-zinc-950 p-8">
        <div className="h-6 w-32 bg-white/5 rounded-full mb-8 animate-pulse" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-white/5 bg-zinc-950 p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px]" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h2 className="text-2xl font-black tracking-tighter text-white">Select Time</h2>
        <p className="text-xs font-bold text-zinc-500">{slots.length} Slots</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 relative z-10">
        {slots.length > 0 ? (
          slots.map((slot) => {
            const timeStr = format(parseISO(slot.startsAt), 'h:mm a');
            const isActive = selected === slot.startsAt;
            return (
              <button
                key={slot.startsAt}
                aria-pressed={isActive}
                aria-label={`Select ${format(parseISO(slot.startsAt), 'EEEE, MMMM d \'at\' h:mm a')} ${isActive ? '(selected)' : ''}`}
                onClick={() => {
                  setSelected(slot.startsAt);
                  onSelect(slot.startsAt);
                }}
                className={[
                  "flex items-center justify-center h-14 rounded-2xl border font-bold text-sm transition-all duration-300",
                  isActive 
                    ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40 scale-105" 
                    : "bg-white/5 border-white/5 text-zinc-400 hover:border-indigo-500/50 hover:bg-white/10"
                ].join(" ")}
                type="button"
              >
                {timeStr}
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center opacity-50">
            <Moon className="w-8 h-8 text-zinc-600 mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Fully Booked</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Peer guide availability synced live
        </p>
      </div>
    </section>
  );
}
