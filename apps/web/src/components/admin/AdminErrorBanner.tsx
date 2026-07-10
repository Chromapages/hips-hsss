import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

type AdminErrorBannerProps = {
  error: Error | null;
  onRetry?: () => void;
  context?: string;
};

export const AdminErrorBanner: React.FC<AdminErrorBannerProps> = ({
  error,
  onRetry,
  context = "data",
}) => {
  if (!error) return null;

  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 mb-6 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
        <div>
          <h3 className="font-bold text-sm leading-none">
            Error loading {context}
          </h3>
          <p className="text-xs opacity-90 mt-1 font-medium">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          aria-label={`Retry loading ${context}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
};
