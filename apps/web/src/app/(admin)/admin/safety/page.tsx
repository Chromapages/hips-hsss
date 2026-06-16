"use client";

import { useState } from "react";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { ShieldAlert, Loader2, Eye, X, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";
import { useAuth } from "@/components/auth/AuthProvider";

type SafetyAlert = {
  id: string;
  sessionId: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;
  category?: string;
  isResolved?: boolean;
  createdAt: string;
};

type ReviewState = {
  alert: SafetyAlert;
  action: 'resolve' | 'reopen' | 'escalate' | null;
  reason: string;
  submitting: boolean;
  error: string | null;
};

export default function AdminSafetyQueuePage() {
  const { data, isLoading, error, refetch } = useFetchWithTimeout<SafetyAlert[]>('/api/admin/safety-alerts');
  const { getToken } = useAuth();
  const [review, setReview] = useState<ReviewState | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const alerts = Array.isArray(data) ? data : [];

  const openReview = (alert: SafetyAlert) => {
    setReview({
      alert,
      action: alert.isResolved ? 'reopen' : 'resolve',
      reason: '',
      submitting: false,
      error: null,
    });
  };

  const closeReview = () => {
    if (submitting) return;
    setReview(null);
  };

  const submitAction = async () => {
    if (!review) return;
    if (review.reason.trim().length < 3) {
      setReview({ ...review, error: 'Please enter a justification of at least 3 characters.' });
      return;
    }
    setReview({ ...review, submitting: true, error: null });
    setSubmitting(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      if (review.action === 'escalate') {
        const res = await fetch(`/api/admin/safety-alerts/${review.alert.id}/escalate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ reason: review.reason }),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error || 'Escalation failed');
        }
      } else {
        const res = await fetch(`/api/admin/safety-alerts/${review.alert.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            status: review.action === 'reopen' ? 'OPEN' : 'RESOLVED',
            reason: review.reason,
          }),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error || 'Update failed');
        }
      }
      setReview(null);
      refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setReview((r) => (r ? { ...r, submitting: false, error: message } : r));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Safety
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">
          Human-reviewed escalation queue
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Flags appear by anonymous session reference. Crisis protocol and
          vault access require reviewer justification.
        </p>
      </header>

      <AdminErrorBanner
        error={error}
        onRetry={refetch}
        context="Safety feed unavailable — do not interpret empty queue as healthy"
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/20 text-muted-foreground uppercase text-xs font-semibold tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Session Ref</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {alert.sessionId}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      alert.severity === 'CRITICAL' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      alert.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground font-medium">{alert.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      alert.isResolved
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {alert.isResolved ? 'RESOLVED' : 'OPEN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(alert.createdAt), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => openReview(alert)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all text-xs font-bold"
                    >
                      <Eye className="w-3 h-3" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {alerts.length === 0 && (
            <div className="p-20 text-center text-muted-foreground">
              <ShieldAlert className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No safety alerts detected.</p>
            </div>
          )}
        </div>
      )}

      {review && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="safety-review-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeReview}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 id="safety-review-title" className="text-lg font-bold text-foreground">
                  Review safety alert
                </h2>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  {review.alert.sessionId}
                </p>
              </div>
              <button
                type="button"
                onClick={closeReview}
                disabled={submitting}
                aria-label="Close review dialog"
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Severity</p>
                <p className="text-sm font-semibold text-foreground">{review.alert.severity}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Category</p>
                <p className="text-sm font-semibold text-foreground">{review.alert.category}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Created</p>
                <p className="text-sm font-semibold text-foreground">
                  {format(new Date(review.alert.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Action</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setReview({ ...review, action: 'resolve', error: null })}
                  disabled={review.alert.isResolved}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all disabled:opacity-30 ${
                    review.action === 'resolve'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'border-border text-foreground hover:bg-muted'
                  }`}
                >
                  Resolve
                </button>
                <button
                  type="button"
                  onClick={() => setReview({ ...review, action: 'reopen', error: null })}
                  disabled={!review.alert.isResolved}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all disabled:opacity-30 ${
                    review.action === 'reopen'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-border text-foreground hover:bg-muted'
                  }`}
                >
                  Reopen
                </button>
                <button
                  type="button"
                  onClick={() => setReview({ ...review, action: 'escalate', error: null })}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    review.action === 'escalate'
                      ? 'bg-destructive text-white border-destructive'
                      : 'border-border text-foreground hover:bg-muted'
                  }`}
                >
                  Escalate
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="review-reason" className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
                Justification (recorded in audit log)
              </label>
              <textarea
                id="review-reason"
                value={review.reason}
                onChange={(e) => setReview({ ...review, reason: e.target.value, error: null })}
                rows={4}
                disabled={submitting}
                placeholder="Describe the basis for this decision (3-500 chars)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary/50 outline-none resize-none disabled:opacity-50"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                {review.reason.length}/500 characters
              </p>
            </div>

            {review.error && (
              <div role="alert" className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {review.error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeReview}
                disabled={submitting}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitAction}
                disabled={submitting || !review.action}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
