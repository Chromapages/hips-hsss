"use client";

import { useState, useEffect, useRef } from "react";

const colors = ["#6366F1", "#9333EA", "#10B981", "#FBBF24", "#EF4444", "#06B6D4"];

export function AvatarSelectorModal() {
  const [open, setOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      sessionStorage.getItem("hips-avatar-color") === null,
  );
  const [selected, setSelected] = useState(colors[0] ?? "#6366F1");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Initial focus on first color button
  useEffect(() => {
    if (open) {
      firstFocusRef.current?.focus();
    }
  }, [open]);

  // Escape key and click-outside handlers
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-6 text-white backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="avatar-title">
      <section className="max-w-lg rounded-lg border border-white/10 bg-zinc-950 p-6" ref={wrapperRef}>
        <h2 className="text-2xl font-bold" id="avatar-title">Choose your avatar color</h2>
        <p className="mt-3 text-zinc-400">Your avatar color is stored only for this browser session.</p>
        <div className="mt-6 grid grid-cols-6 gap-3">
          {colors.map((color) => (
            <button
              aria-label={`Select avatar color ${color}`}
              aria-pressed={selected === color}
              className="h-12 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-white"
              key={color}
              onClick={() => setSelected(color)}
              style={{ backgroundColor: color, borderColor: selected === color ? "white" : "transparent" }}
              ref={color === colors[0] ? firstFocusRef : undefined}
              type="button"
            />
          ))}
        </div>
        <button
          className="mt-8 min-h-11 w-full rounded-xl bg-indigo-500 px-4 font-semibold transition hover:bg-indigo-400"
          onClick={() => {
            sessionStorage.setItem("hips-avatar-color", selected);
            setOpen(false);
          }}
          type="button"
        >
          Lock avatar and join
        </button>
      </section>
    </div>
  );
}
