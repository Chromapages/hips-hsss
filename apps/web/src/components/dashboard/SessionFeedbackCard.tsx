"use client";

import { useState } from "react";
import { Star, Send, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SessionFeedbackCardProps {
  sessionId: string;
  serviceName: string;
  getToken: () => Promise<string | null>;
  onSubmitted: () => void;
}

export function SessionFeedbackCard({ sessionId, serviceName, getToken, onSubmitted }: SessionFeedbackCardProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating of 1 to 5 stars");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");

      const res = await fetch("/api/sessions/feedback", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, rating, comments }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      localStorage.setItem(`hips-feedback-submitted-${sessionId}`, "true");
      setSubmitted(true);
      toast.success("Thank you for your anonymous feedback!");
      
      // Delay call to onSubmitted to let the success animation finish
      setTimeout(() => {
        onSubmitted();
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit feedback";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <article className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-600">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <h3 className="font-heading text-lg font-bold text-emerald-800">Feedback Submitted</h3>
        <p className="text-xs text-emerald-700 max-w-md mx-auto font-body">
          Thank you! Your ratings and notes were successfully stored anonymously. Your responses help us improve H.I.P.S. support services.
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-accent/20 bg-accent/5 p-6 space-y-4 shadow-soft">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h3 className="text-md font-bold text-text-primary font-heading">How was your session?</h3>
        </div>
        <p className="text-xs text-text-secondary font-body">
          Please share your experience for <span className="font-semibold text-text-primary">{serviceName}</span>. Your feedback is 100% anonymous.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-secondary font-ui uppercase tracking-wide mr-2">Rating:</span>
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rate your session">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 hover:scale-110 active:scale-95 transition-all outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Star
                  className={`w-6 h-6 transition-all ${
                    (hoverRating || rating) >= star
                      ? "fill-accent text-accent"
                      : "text-text-muted hover:text-accent/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Box */}
        <div className="space-y-1.5">
          <label htmlFor="comments" className="text-xs font-bold text-text-secondary font-ui uppercase tracking-wide">
            Comments <span className="text-text-muted font-normal font-body italic">(optional)</span>
          </label>
          <textarea
            id="comments"
            rows={2}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Help us understand what went well or how we can improve..."
            className="w-full text-xs p-3 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-body resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-pill bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-5 text-xs font-bold font-ui uppercase tracking-wide transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap shadow-soft"
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              Submit Feedback
              <Send className="w-3 h-3" />
            </>
          )}
        </button>
      </form>
    </article>
  );
}
