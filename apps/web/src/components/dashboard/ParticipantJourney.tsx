"use client";

import { Award, CheckCircle2, ShieldCheck } from "lucide-react";

interface ParticipantJourneyProps {
  completedCount: number;
}

export function ParticipantJourney({ completedCount }: ParticipantJourneyProps) {
  // Define milestones
  const milestones = [
    { name: "First Steps", target: 1, description: "Complete your 1st session" },
    { name: "Committed Member", target: 5, description: "Complete 5 sessions" },
    { name: "Sanctuary Regular", target: 10, description: "Complete 10 sessions" },
  ];

  // Determine current milestone and next milestone
  let currentMilestone = "Beginner";
  let nextMilestone = milestones[0]!;
  let progressPct = 0;
  let currentStep = completedCount;
  let targetStep = 1;

  if (completedCount >= 10) {
    currentMilestone = "Sanctuary Regular";
    nextMilestone = { name: "Journey Master", target: 20, description: "Complete 20 sessions" };
    currentStep = completedCount;
    targetStep = 20;
    progressPct = Math.min(100, (completedCount / 20) * 100);
  } else if (completedCount >= 5) {
    currentMilestone = "Committed Member";
    nextMilestone = milestones[2]!;
    currentStep = completedCount;
    targetStep = 10;
    progressPct = (completedCount / 10) * 100;
  } else if (completedCount >= 1) {
    currentMilestone = "First Steps";
    nextMilestone = milestones[1]!;
    currentStep = completedCount;
    targetStep = 5;
    progressPct = (completedCount / 5) * 100;
  } else {
    currentMilestone = "Newcomer";
    nextMilestone = milestones[0]!;
    currentStep = 0;
    targetStep = 1;
    progressPct = 0;
  }

  return (
    <article className="rounded-xl border border-border bg-surface p-6 shadow-soft space-y-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-lg font-bold tracking-tight text-text-primary font-heading flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          Your Journey
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-ui">
          {currentMilestone}
        </span>
      </div>

      <div className="space-y-4">
        {/* Progress Bar Info */}
        <div className="flex justify-between items-end text-xs">
          <div className="space-y-1">
            <p className="text-text-muted font-bold font-ui text-[10px] uppercase tracking-widest">Next Milestone</p>
            <p className="font-semibold text-text-primary">{nextMilestone.name}</p>
          </div>
          <span className="font-mono text-text-secondary font-bold">
            {currentStep}/{targetStep} Sessions
          </span>
        </div>

        {/* Custom Progress Bar */}
        <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="absolute top-0 left-0 h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Milestone Description */}
        <p className="text-xs text-text-secondary font-body italic">
          &ldquo;{nextMilestone.description}&rdquo;
        </p>

        {/* Completed list */}
        {completedCount > 0 && (
          <div className="pt-2 border-t border-border flex items-center gap-2 text-xs text-emerald-600 font-semibold font-ui">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>You have completed {completedCount} sessions. Keep going!</span>
          </div>
        )}
      </div>
    </article>
  );
}
