"use client";

export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { Check, X, Loader2, AlertCircle, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { format } from "date-fns";
import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";

type Scholarship = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | string;
  requestedCents: number;
  approvedCents: number | null;
  note?: string;
  createdAt: string;
  user: { email: string };
};

type PaginatedScholarships = {
  data: Scholarship[];
  total: number;
  take: number;
  skip: number;
};

type DecisionModal = {
  scholarship: Scholarship;
  action: 'APPROVED' | 'DENIED' | 'PENDING';
  approvedCents?: number | undefined;
  decisionNote: string;
  submitting: boolean;
  error: string | null;
};

export default function AdminScholarshipsPage() {
  const { data: response, isLoading, error, refetch } = useFetchWithTimeout<PaginatedScholarships>('/api/admin/scholarships');
  const { getToken } = useAuth();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'DENIED'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState<DecisionModal | null>(null);

  const scholarships = useMemo(() => {
    const all = response?.data ?? [];
    if (statusFilter === 'ALL') return all;
    return all.filter((s) => s.status === statusFilter);
  }, [response, statusFilter]);

  const openDecision = (s: Scholarship, action: 'APPROVED' | 'DENIED' | 'PENDING') => {
    setModal({
      scholarship: s,
      action,
      approvedCents: action === 'APPROVED' ? s.requestedCents : undefined,
      decisionNote: '',
      submitting: false,
      error: null,
    });
  };

  const closeModal = () => {
    if (modal?.submitting) return;
    setModal(null);
  };

  const submitDecision = async () => {
    if (!modal) return;
    if (modal.decisionNote.trim().length < 3) {
      setModal({ ...modal, error: 'Please provide a decision note (3-2000 chars).' });
      return;
    }
    if (modal.action === 'APPROVED' && (modal.approvedCents === undefined || modal.approvedCents < 0)) {
      setModal({ ...modal, error: 'Approved amount must be a non-negative number of cents.' });
      return;
    }
    setModal({ ...modal, submitting: true, error: null });
    setUpdatingId(modal.scholarship.id);
    try {
      const token = await getToken();
      if (!token) throw new Error('Unauthorized');
      const res = await fetch(`/api/admin/scholarships/${modal.scholarship.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          status: modal.action,
          approvedCents: modal.action === 'APPROVED' ? modal.approvedCents : undefined,
          decisionNote: modal.decisionNote,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Update failed');
      }
      setModal(null);
      refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      setModal((m) => (m ? { ...m, submitting: false, error: message } : m));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scholarship Management</h1>
          <p className="text-sm text-muted-foreground mt-2">Review and process financial assistance requests.</p>
        </div>

        <div className="flex gap-2">
          {(['ALL', 'PENDING', 'APPROVED', 'DENIED'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                statusFilter === f
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-foreground hover:bg-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <AdminErrorBanner error={error} onRetry={refetch} context="scholarships" />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/20 text-muted-foreground uppercase text-xs font-semibold tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Requested</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scholarships.map((s) => {
                const isExpanded = expandedId === s.id;
                return (
                  <tr key={s.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Mail className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{s.user.email}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">{s.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground font-mono">
                      ${(s.requestedCents / 100).toFixed(2)}
                      {s.approvedCents != null && s.approvedCents !== s.requestedCents && (
                        <p className="text-[10px] text-emerald-600 mt-0.5">approved: ${(s.approvedCents / 100).toFixed(2)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        s.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        s.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {format(new Date(s.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : s.id)}
                          aria-label={isExpanded ? 'Hide details' : 'Show details'}
                          aria-expanded={isExpanded}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {s.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              onClick={() => openDecision(s, 'APPROVED')}
                              disabled={updatingId === s.id}
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openDecision(s, 'DENIED')}
                              disabled={updatingId === s.id}
                              className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all disabled:opacity-50"
                              title="Deny"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {(s.status === 'APPROVED' || s.status === 'DENIED') && (
                          <button
                            type="button"
                            onClick={() => openDecision(s, 'PENDING')}
                            disabled={updatingId === s.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground hover:bg-muted transition-all disabled:opacity-50"
                            title="Re-open for review"
                          >
                            Re-open
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {scholarships.map((s) =>
            expandedId === s.id ? (
              <div key={`${s.id}-detail`} className="border-t border-border bg-muted/5 p-6 space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Application content</p>
                <pre className="text-xs text-foreground whitespace-pre-wrap break-words font-mono bg-background border border-border rounded-lg p-4">
                  {s.note || '(no application content)'}
                </pre>
              </div>
            ) : null
          )}

          {scholarships.length === 0 && (
            <div className="p-20 text-center text-muted-foreground">
              <AlertCircle className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No scholarship applications match this filter.</p>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scholarship-decision-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="scholarship-decision-title" className="text-lg font-bold text-foreground mb-1">
              {modal.action === 'APPROVED' ? 'Approve' : modal.action === 'DENIED' ? 'Deny' : 'Re-open'} scholarship
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Applicant: <span className="font-mono text-foreground">{modal.scholarship.user.email}</span>
              <br />
              Requested: <span className="font-mono text-foreground">${(modal.scholarship.requestedCents / 100).toFixed(2)}</span>
            </p>

            {modal.action === 'APPROVED' && (
              <div className="mb-4">
                <label htmlFor="approved-cents" className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
                  Approved amount (cents)
                </label>
                <input
                  id="approved-cents"
                  type="number"
                  min={0}
                  step={1}
                  value={modal.approvedCents ?? ''}
                  onChange={(e) => setModal({ ...modal, approvedCents: e.target.value === '' ? undefined : Number(e.target.value), error: null })}
                  disabled={modal.submitting}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary/50 outline-none"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Defaults to the full requested amount. Reduce for partial awards.
                </p>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="decision-note" className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
                Decision note (required, recorded in audit log + sent to applicant)
              </label>
              <textarea
                id="decision-note"
                value={modal.decisionNote}
                onChange={(e) => setModal({ ...modal, decisionNote: e.target.value, error: null })}
                rows={4}
                disabled={modal.submitting}
                placeholder="Justify the decision in 3-2000 characters"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary/50 outline-none resize-none disabled:opacity-50"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{modal.decisionNote.length}/2000</p>
            </div>

            {modal.error && (
              <div role="alert" className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {modal.error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={modal.submitting}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitDecision}
                disabled={modal.submitting}
                className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 ${
                  modal.action === 'DENIED'
                    ? 'bg-destructive hover:bg-destructive/90'
                    : modal.action === 'APPROVED'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {modal.submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
