"use client";

import { useState } from "react";

const slots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:00 PM",
  "3:30 PM",
  "5:00 PM",
  "6:30 PM",
];

export function TimeSlotGrid({
  date,
  onSelect,
}: {
  date: string;
  onSelect: (slot: string) => void;
}) {
  const [selected, setSelected] = useState("");

  if (!date) {
    return (
      <section className="rounded-lg border border-white/10 bg-gray-950 p-5 text-gray-400">
        Select a date to see available times.
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-white/10 bg-gray-950 p-5">
      <h2 className="text-xl font-semibold">Choose a time</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {slots.map((slot, index) => {
          const booked = index === 3 || index === 7;
          return (
            <button
              aria-pressed={selected === slot}
              className={[
                "min-h-11 rounded-md border text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400",
                booked
                  ? "cursor-not-allowed border-white/5 text-gray-600"
                  : "cursor-pointer border-indigo-500/40 text-white hover:bg-indigo-500/15",
                selected === slot ? "bg-indigo-500 text-white" : "",
              ].join(" ")}
              disabled={booked}
              key={slot}
              onClick={() => {
                setSelected(slot);
                onSelect(slot);
              }}
              type="button"
            >
              {slot}
            </button>
          );
        })}
      </div>
    </section>
  );
}
