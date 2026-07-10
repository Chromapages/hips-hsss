"use client";

import { useState, useEffect } from "react";
import { Calendar, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { WeekDay, Slot, WeeklyAvailability } from "@/lib/availability";

interface HostAvailabilitySlotsProps {
  getToken: () => Promise<string | null>;
}

const daysList: { key: WeekDay; label: string }[] = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

const slotsList: { key: Slot; label: string; hours: string }[] = [
  { key: "morning", label: "Morning", hours: "9am - 12pm" },
  { key: "afternoon", label: "Afternoon", hours: "12pm - 4pm" },
  { key: "evening", label: "Evening", hours: "4pm - 8pm" },
];

export function HostAvailabilitySlots({ getToken }: HostAvailabilitySlotsProps) {
  const [grid, setGrid] = useState<WeeklyAvailability>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch("/api/host/availability", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.availability) {
          setGrid(data.availability);
        }
      } catch (error) {
        console.error("Failed to load availability:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAvailability();
  }, [getToken]);

  const toggleSlot = (day: WeekDay, slot: Slot) => {
    setGrid((prev) => {
      const active = prev[day];
      const next = active.includes(slot)
        ? active.filter((s) => s !== slot)
        : [...active, slot];
      return { ...prev, [day]: next };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");

      const res = await fetch("/api/host/availability", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ availability: grid }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to save");

      toast.success("Availability preferences updated!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
        <span className="text-xs text-text-muted mt-2">Loading calendar settings...</span>
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-heading text-lg font-bold text-text flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Availability Slots
        </h3>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-3 text-xs font-bold font-ui uppercase tracking-wide transition-all shadow-soft"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-text-muted font-body">
          Toggle the time frames you are open to take scheduled support sessions.
        </p>

        {/* Calendar Grid */}
        <div className="space-y-3">
          {daysList.map((day) => (
            <div key={day.key} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
              <span className="text-xs font-bold text-text font-ui w-12">{day.label}</span>
              <div className="flex-1 flex gap-2 justify-end">
                {slotsList.map((slot) => {
                  const isActive = grid[day.key]?.includes(slot.key);
                  return (
                    <button
                      key={slot.key}
                      type="button"
                      onClick={() => toggleSlot(day.key, slot.key)}
                      aria-label={`Toggle ${slot.label} availability on ${day.label}`}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold font-ui transition-all ${
                        isActive
                          ? "bg-accent/15 text-accent border-accent/40"
                          : "bg-surface text-text-muted border-border hover:border-accent/30"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
