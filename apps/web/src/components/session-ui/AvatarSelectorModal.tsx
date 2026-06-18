"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

const colors = ["#173B57", "#C59A35", "#10B981", "#FBBF24", "#EF4444", "#06B6D4"];

const colorNames: Record<string, string> = {
  "#173B57": "Navy",
  "#C59A35": "Gold",
  "#10B981": "Emerald",
  "#FBBF24": "Amber",
  "#EF4444": "Crimson",
  "#06B6D4": "Cyan",
};

export function AvatarSelectorModal() {
  const [open, setOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      sessionStorage.getItem("hips-avatar-color") === null,
  );
  
  // Hydrate initial selection from sessionStorage if present, otherwise colors[0]
  const [selected, setSelected] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("hips-avatar-color");
      if (stored && colors.includes(stored)) return stored;
    }
    return colors[0] ?? "#173B57";
  });
  
  const [announcement, setAnnouncement] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Initial focus on first color button
  useEffect(() => {
    if (open) {
      firstFocusRef.current?.focus();
    }
  }, [open]);

  // Accessibility: Focus trap & Escape key & click-outside handlers
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }

      if (e.key === "Tab") {
        const focusableElements = wrapperRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        if (!focusableElements) return;
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSave = () => {
    sessionStorage.setItem("hips-avatar-color", selected);
    setAnnouncement(`Avatar color saved as ${colorNames[selected] || "selected color"}.`);
    // Wait briefly for screen reader announcement before closing
    setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-6 text-white backdrop-blur-xl" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="avatar-title"
    >
      {/* Announcement region for accessibility */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      <section 
        className="max-h-[90vh] max-w-lg w-full rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl overflow-y-auto" 
        ref={wrapperRef}
      >
        <h2 className="text-2xl font-bold font-ui" id="avatar-title">Choose your avatar color</h2>
        <p className="mt-3 text-text text-sm font-body">Your avatar color is stored only for this browser session.</p>
        
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-3" role="radiogroup" aria-label="Avatar color presets">
          {colors.map((color) => {
            const isSelected = selected === color;
            const friendlyName = colorNames[color] || "avatar color";
            return (
              <button
                aria-label={`Select ${friendlyName} color`}
                aria-pressed={isSelected}
                role="radio"
                aria-checked={isSelected}
                className={`h-12 w-12 rounded-full flex items-center justify-center border-2 border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 hover:scale-105 active:scale-95`}
                key={color}
                onClick={() => setSelected(color)}
                style={{ 
                  backgroundColor: color,
                  boxShadow: isSelected 
                    ? `0 0 0 2px #09090b, 0 0 0 4px ${color}`
                    : undefined 
                }}
                ref={color === colors[0] ? firstFocusRef : undefined}
                type="button"
              >
                {isSelected && (
                  <Check className="h-5 w-5 text-white drop-shadow-md" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
        
        <button
          className="mt-8 min-h-11 w-full rounded-xl bg-primary px-4 font-semibold text-sm uppercase tracking-wider font-ui transition-all duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:scale-[0.98]"
          onClick={handleSave}
          type="button"
        >
          Lock avatar and join
        </button>
      </section>
    </div>
  );
}
