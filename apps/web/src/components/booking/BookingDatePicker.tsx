"use client";

import { useMemo, useState } from "react";

function iso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function BookingDatePicker({
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
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];

  return (
    <section className="rounded-[2rem] border border-white/5 bg-zinc-950 p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-[40px]" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h2 className="font-heading text-2xl font-bold tracking-tighter text-white">Select Date</h2>
        <div className="px-3 py-1 rounded-full bg-surface/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Weekday Only
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 relative z-10">
        {dates.map((item) => (
          <button
            key={item.value}
            aria-pressed={selected === item.value}
            disabled={!item.available}
            onClick={() => {
              setSelected(item.value);
              onSelect(item.value);
            }}
            className={[
              "relative flex flex-col items-center justify-center min-h-[70px] rounded-2xl border transition-all duration-300",
              item.available
                ? "cursor-pointer border-white/5 hover:border-primary/50 hover:bg-primary/10 hover:scale-[1.05]"
                : "cursor-not-allowed border-transparent opacity-20",
              selected === item.value 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/40 scale-105" 
                : "text-text",
            ].join(" ")}
            type="button"
          >
            <span className={[
              "text-[9px] font-bold uppercase tracking-widest mb-1 transition-colors",
              selected === item.value ? "text-[E8EEF3]" : "text-text group-hover:text-text"
            ].join(" ")}>
              {item.date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="text-lg font-bold tracking-tighter">{item.date.getDate()}</span>
            
            {selected === item.value && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-surface shadow-[0_0_10px_white]" />
            )}
          </button>
        ))}
      </div>
      
      <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-text text-center">
        Sessions are 50 minutes
        {firstDate && lastDate
          ? ` • ${firstDate.date.toLocaleDateString('en-US', { month: 'long' })} / ${lastDate.date.toLocaleDateString('en-US', { month: 'long' })}`
          : null}
      </p>
    </section>
  );
}
