"use client";

import { useState, useEffect } from "react";
import { Heart, Check, Smile, Compass, AlertTriangle, Coffee } from "lucide-react";
import { toast } from "sonner";

type MoodType = "good" | "okay" | "tired" | "stressed" | "burnout";

interface MoodOption {
  type: MoodType;
  label: string;
  icon: typeof Smile;
  color: string;
  bg: string;
  message: string;
}

const moodOptions: MoodOption[] = [
  {
    type: "good",
    label: "Good",
    icon: Smile,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    message: "Wonderful! We're glad you feel supported. Have a great session!",
  },
  {
    type: "okay",
    label: "Okay",
    icon: Compass,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    message: "Thank you for sharing. Remember to move at your own pace today.",
  },
  {
    type: "tired",
    label: "Tired",
    icon: Coffee,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    message: "Understood. Take an extra 5 minutes between sessions to stretch or grab water.",
  },
  {
    type: "stressed",
    label: "Stressed",
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    message: "Deep breaths. If a session gets intense, you can trigger safety backup flags.",
  },
  {
    type: "burnout",
    label: "Overwhelmed",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    message: "Please prioritize your wellbeing. You can toggle off availability slots or notify lead dispatch.",
  },
];

export function WellbeingCheckIn() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  useEffect(() => {
    // Check if host already checked in today
    const checkinDate = localStorage.getItem("hips-host-wellbeing-date");
    const savedMood = localStorage.getItem("hips-host-wellbeing-mood") as MoodType | null;
    const todayStr = new Date().toDateString();

    if (checkinDate === todayStr && savedMood) {
      setSelectedMood(savedMood);
    }
  }, []);

  const handleMoodSelect = (mood: MoodType) => {
    localStorage.setItem("hips-host-wellbeing-date", new Date().toDateString());
    localStorage.setItem("hips-host-wellbeing-mood", mood);
    setSelectedMood(mood);
    toast.success("Wellbeing check-in recorded. Thank you for taking care of yourself!");
  };

  const activeOption = moodOptions.find((o) => o.type === selectedMood);

  return (
    <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
        <h3 className="font-heading text-lg font-bold text-text">Host Wellbeing Check-in</h3>
      </div>

      {!selectedMood ? (
        <div className="space-y-3">
          <p className="text-xs text-text-muted font-body">
            Supporter wellness is core to peer care. How are you feeling today?
          </p>
          <div className="grid grid-cols-5 gap-2" role="group" aria-label="Feeling checklist">
            {moodOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleMoodSelect(opt.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-surface hover:border-accent/40 active:scale-95 transition-all duration-150 group`}
                  aria-label={`Mark feeling as ${opt.label}`}
                >
                  <div className={`p-2 rounded-lg ${opt.bg} ${opt.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-text-muted font-ui mt-2">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-bg-subtle border border-border space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeOption?.bg} ${activeOption?.color}`}>
              {activeOption && <activeOption.icon className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold text-text font-ui">Checked In: {activeOption?.label}</p>
              <p className="text-[10px] text-text-muted font-body mt-0.5">Thank you for updating your wellbeing pulse.</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("hips-host-wellbeing-date");
                localStorage.removeItem("hips-host-wellbeing-mood");
                setSelectedMood(null);
              }}
              className="ml-auto text-[10px] text-accent hover:underline font-bold font-ui uppercase"
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-text-muted font-body italic pt-1 border-t border-border">
            &ldquo;{activeOption?.message}&rdquo;
          </p>
        </div>
      )}
    </article>
  );
}
