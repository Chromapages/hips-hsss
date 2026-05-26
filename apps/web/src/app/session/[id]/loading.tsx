export default function SessionLoading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8 bg-black text-white">
      <style>{`
        @keyframes sanctuary-breathe {
          0%, 100% { transform: scale(1);   opacity: 0.35; }
          50%       { transform: scale(1.6); opacity: 0.08; }
        }
        @keyframes sanctuary-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.6; }
          50%       { transform: scale(1.22); opacity: 1; }
        }
        @keyframes sanctuary-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .breathe-ring {
          animation: sanctuary-breathe 4s ease-in-out infinite;
        }
        .pulse-dot {
          animation: sanctuary-pulse 4s ease-in-out infinite;
        }
        .fade-in {
          animation: sanctuary-fade-in 1.2s ease-out forwards;
        }
        .fade-in-delay {
          opacity: 0;
          animation: sanctuary-fade-in 1.2s ease-out 0.6s forwards;
        }
      `}</style>

      {/* Breathing animation */}
      <div className="relative flex items-center justify-center">
        {/* Outer expanding ring */}
        <div
          className="breathe-ring absolute h-32 w-32 rounded-full border border-indigo-500/30"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="breathe-ring absolute h-24 w-24 rounded-full border border-indigo-400/20"
          style={{ animationDelay: '0.4s' }}
        />
        {/* Inner glowing dot */}
        <div className="pulse-dot h-10 w-10 rounded-full bg-indigo-500/70 shadow-[0_0_28px_8px_rgba(99,102,241,0.35)]" />
      </div>

      {/* Text */}
      <div className="fade-in flex flex-col items-center gap-2 text-center">
        <p className="text-base font-bold tracking-widest text-indigo-300 uppercase">
          Entering your sanctuary
        </p>
      </div>

      <div className="fade-in-delay flex flex-col items-center gap-1 text-center">
        <p className="text-xs font-medium text-zinc-500">Your voice will be anonymized</p>
        <p className="text-xs text-zinc-600">You are safe here</p>
      </div>
    </div>
  );
}
