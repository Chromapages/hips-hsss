"use client";

import { useMemo, useState } from "react";

function iso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function AvailabilityCalendar({
  onSelect,
}: {
  onSelect: (date: string) => void;
}) {
  const [selected, setSelected] = useState<string>("");
  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index + 1);
      const available = date.getDay() !== 0 && date.getDay() !== 6;
      return { date, available, value: iso(date) };
    });
  }, []);

  return (
    <section className="rounded-lg border border-white/10 bg-gray-950 p-5">
      <h2 className="text-xl font-semibold">Choose a date</h2>
      <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-7">
        {dates.map((item) => (
          <button
            aria-pressed={selected === item.value}
            className={[
              "min-h-14 rounded-md border text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400",
              item.available
                ? "cursor-pointer border-indigo-500/40 text-white hover:bg-indigo-500/15"
                : "cursor-not-allowed border-white/5 text-gray-600",
              selected === item.value ? "bg-indigo-500 text-white" : "",
            ].join(" ")}
            disabled={!item.available}
            key={item.value}
            onClick={() => {
              setSelected(item.value);
              onSelect(item.value);
            }}
            type="button"
          >
            <span className="block text-xs text-gray-400">
              {item.date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="block font-semibold">{item.date.getDate()}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
