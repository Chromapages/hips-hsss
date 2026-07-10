"use client";

export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { Mail, Loader2, AlertCircle, MessageSquare, Send, X, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";

type ContactInquiry = {
  id: string;
  submitterName: string;
  submitterEmail: string;
  inquiryType: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | string;
  subject: string;
  body: string;
  status: string;
  assigneeId?: string | null;
  assigneeEmail?: string | null;
  slaDueAt?: string | null;
  isOverdue?: boolean;
  createdAt: string;
};

type Paginated = { data: ContactInquiry[]; total: number; take: number; skip: number };
type Note = { id: string; authorEmail: string; body: string; createdAt: string };
type ResponseEntry = { id: string; authorEmail: string; body: string; createdAt: string; deliveredTo?: string | null };

const STATUSES = ['NEW', 'IN_PROGRESS', 'CONTACTED', 'QUALIFIED', 'RESOLVED', 'CLOSED'] as const;
const PRIORITIES = ['URGENT', 'HIGH', 'NORMAL', 'LOW'] as const;
const TYPES = ['ALL', 'GENERAL', 'SUPPORT', 'PARTNERSHIP', 'BILLING', 'PRESS', 'SECURITY'] as const;

export default function AdminContactInquiriesPage() {
  const { data, isLoading, error, refetch } = useFetchWithTimeout<Paginated>('/api/admin/contact-inquiries');
  const { getToken } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ inquiry: ContactInquiry; notes: Note[]; responses: ResponseEntry[] } | null>(null);
  const [actionState, setActionState] = useState<{ id: string; action: string; submitting: boolean; error: string | null } | null>(null);

  const inquiries = useMemo(() => {
    const all = data?.data ?? [];
    return all.filter((q) => {
      if (statusFilter !== 'ALL' && q.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && q.priority !== priorityFilter) return false;
      if (typeFilter !== 'ALL' && q.inquiryType !== typeFilter) return false;
      if (search.trim()) {
        const needle = search.trim().toLowerCase();
        return (
          q.subject.toLowerCase().includes(needle) ||
          q.submitterName.toLowerCase().includes(needle) ||
          q.submitterEmail.toLowerCase().includes(needle) ||
          q.body.toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [data, statusFilter, priorityFilter, typeFilter, search]);

  const loadDetail = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`/api/admin/contact-inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      setDetail({ inquiry: json.inquiry, notes: json.inquiry.notes ?? [], responses: json.inquiry.responses ?? [] });
    } catch (err) {
      console.error('Failed to load inquiry detail:', err);
    }
  };

  const onExpand = (id: string) => {
    if (expanded === id) {
      setExpanded(null);
      setDetail(null);
    } else {
      setExpanded(id);
      void loadDetail(id);
    }
  };

  const performAction = async (id: string, action: 'assign' | 'respond' | 'note' | 'resolve' | 'reopen' | 'priority', payload: Record<string, unknown>) => {
    setActionState({ id, action, submitting: true, error: null });
    try {
      const token = await getToken();
      if (!token) throw new Error('Unauthorized');
      let url = `/api/admin/contact-inquiries/${id}`;
      if (action === 'assign') url += '/assign';
      else if (action === 'respond') url += '/responses';
      else if (action === 'note') url += '/notes';
      else if (action === 'resolve') url += '/resolve';
      else if (action === 'reopen') url += '/reopen';
      else if (action === 'priority') {
        // PATCH /api/admin/contact-inquiries/:id
      }
      const method = action === 'priority' ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || `${action} failed`);
      }
      setActionState(null);
      refetch();
      if (expanded === id) await loadDetail(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Action failed';
      setActionState((s) => (s ? { ...s, submitting: false, error: message } : s));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Contact Inquiries</h1>
        <p className="text-muted-foreground mt-2">Public contact form submissions, with SLA tracking and assignment.</p>
      </header>

      <AdminErrorBanner error={error} onRetry={refetch} context="contact inquiries" />

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subject, body, email..."
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
        >
          <option value="ALL">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
        >
          <option value="ALL">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
        >
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((q) => {
            const isExpanded = expanded === q.id;
            return (
              <article key={q.id} className={`rounded-xl border bg-card shadow-sm overflow-hidden ${q.isOverdue ? 'border-amber-500/40' : 'border-border'}`}>
                <div className="p-5 flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onExpand(q.id)}
                    className="flex-1 text-left flex items-start gap-3"
                    aria-expanded={isExpanded}
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-foreground truncate">{q.subject}</p>
                        {q.isOverdue && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                            <AlertTriangle className="w-3 h-3" /> OVERDUE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {q.submitterName} &bull; {q.submitterEmail} &bull; {q.inquiryType}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })} &middot; SLA {q.slaDueAt ? new Date(q.slaDueAt).toLocaleString() : '—'}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      q.priority === 'URGENT' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      q.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      q.priority === 'NORMAL' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      'bg-muted text-muted-foreground border-border'
                    }`}>
                      {q.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      q.status === 'RESOLVED' || q.status === 'CLOSED'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : q.status === 'NEW'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {q.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => onExpand(q.id)}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      className="p-1.5 rounded text-muted-foreground hover:bg-muted"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border bg-muted/5 p-5 space-y-4">
                    <div className="rounded-lg bg-background border border-border p-4">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Submitted message</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{q.body}</p>
                    </div>

                    <InquiryDetailPanel
                      inquiry={q}
                      detail={detail}
                      onAction={performAction}
                      actionState={actionState}
                    />
                  </div>
                )}
              </article>
            );
          })}

          {inquiries.length === 0 && (
            <div className="p-20 text-center text-muted-foreground rounded-xl border border-dashed border-border">
              <AlertCircle className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No inquiries match the current filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InquiryDetailPanel({
  inquiry,
  detail,
  onAction,
  actionState,
}: {
  inquiry: ContactInquiry;
  detail: { inquiry: ContactInquiry; notes: Note[]; responses: ResponseEntry[] } | null;
  onAction: (id: string, action: 'assign' | 'respond' | 'note' | 'resolve' | 'reopen' | 'priority', payload: Record<string, unknown>) => void;
  actionState: { id: string; action: string; submitting: boolean; error: string | null } | null;
}) {
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [responseBody, setResponseBody] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [resolutionNote, setResolutionNote] = useState('');
  const [priority, setPriority] = useState<string>(inquiry.priority);

  const isThisAction = (action: string) => actionState?.id === inquiry.id && actionState.action === action;
  const thisError = (action: string) => (isThisAction(action) ? actionState?.error : null);
  const thisLoading = (action: string) => Boolean(isThisAction(action) && actionState?.submitting);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Assignment & priority</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={assigneeEmail}
            onChange={(e) => setAssigneeEmail(e.target.value)}
            placeholder="Assignee email"
            className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm"
          />
          <button
            type="button"
            disabled={!assigneeEmail.trim() || thisLoading('assign')}
            onClick={() => onAction(inquiry.id, 'assign', { assigneeId: assigneeEmail.trim(), assigneeEmail: assigneeEmail.trim() })}
            className="px-3 h-9 rounded-lg bg-primary text-white text-xs font-semibold disabled:opacity-50"
          >
            {thisLoading('assign') ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Assign'}
          </button>
        </div>

        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm"
          >
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button
            type="button"
            disabled={priority === inquiry.priority || thisLoading('priority')}
            onClick={() => onAction(inquiry.id, 'priority', { priority })}
            className="px-3 h-9 rounded-lg border border-border text-xs font-semibold disabled:opacity-50"
          >
            {thisLoading('priority') ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Update'}
          </button>
        </div>

        {inquiry.assigneeEmail && (
          <p className="text-xs text-muted-foreground">
            Assigned to <span className="font-mono text-foreground">{inquiry.assigneeEmail}</span>
          </p>
        )}

        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold pt-3">Resolve or re-open</p>
        <textarea
          value={resolutionNote}
          onChange={(e) => setResolutionNote(e.target.value)}
          rows={2}
          placeholder="Resolution note (optional)"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            disabled={thisLoading('resolve')}
            onClick={() => onAction(inquiry.id, 'resolve', { resolutionNote: resolutionNote || undefined })}
            className="flex-1 h-9 rounded-lg bg-emerald-600 text-white text-xs font-semibold disabled:opacity-50"
          >
            {thisLoading('resolve') ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark resolved'}
          </button>
          {(inquiry.status === 'RESOLVED' || inquiry.status === 'CLOSED') && (
            <button
              type="button"
              disabled={thisLoading('reopen')}
              onClick={() => onAction(inquiry.id, 'reopen', {})}
              className="flex-1 h-9 rounded-lg border border-border text-xs font-semibold disabled:opacity-50"
            >
              {thisLoading('reopen') ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Re-open'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Reply to submitter</p>
        <textarea
          value={responseBody}
          onChange={(e) => setResponseBody(e.target.value)}
          rows={3}
          placeholder="Reply message..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
        />
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
          Also email the submitter
        </label>
        <button
          type="button"
          disabled={responseBody.trim().length === 0 || thisLoading('respond')}
          onClick={() => {
            onAction(inquiry.id, 'respond', { body: responseBody, sendEmailToSubmitter: sendEmail });
            setResponseBody('');
          }}
          className="w-full h-9 rounded-lg bg-primary text-white text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {thisLoading('respond') ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          Send response
        </button>

        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold pt-3">Internal note</p>
        <textarea
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
          rows={2}
          placeholder="Note (not visible to submitter)..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
        />
        <button
          type="button"
          disabled={noteBody.trim().length === 0 || thisLoading('note')}
          onClick={() => {
            onAction(inquiry.id, 'note', { body: noteBody });
            setNoteBody('');
          }}
          className="w-full h-9 rounded-lg border border-border text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {thisLoading('note') ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquare className="w-3 h-3" />}
          Add note
        </button>

        {thisError('assign') || thisError('respond') || thisError('note') || thisError('resolve') || thisError('reopen') || thisError('priority') ? (
          <div role="alert" className="p-2 rounded bg-destructive/10 border border-destructive/20 text-xs text-destructive">
            {thisError('assign') || thisError('respond') || thisError('note') || thisError('resolve') || thisError('reopen') || thisError('priority')}
          </div>
        ) : null}
      </div>

      <div className="md:col-span-2 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Activity</p>
        {detail && (detail.notes.length > 0 || detail.responses.length > 0) ? (
          <ul className="space-y-2">
            {[...detail.notes.map((n) => ({ ...n, kind: 'NOTE' as const })), ...detail.responses.map((r) => ({ ...r, kind: 'RESPONSE' as const }))]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((entry) => (
                <li key={`${entry.kind}-${entry.id}`} className={`rounded-lg border p-3 ${entry.kind === 'NOTE' ? 'border-amber-500/20 bg-amber-500/5' : 'border-primary/20 bg-primary/5'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      {entry.kind === 'NOTE' ? 'Internal note' : 'Reply'} &middot; <span className="text-muted-foreground font-mono normal-case">{entry.authorEmail}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(entry.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">{entry.body}</p>
                  {entry.kind === 'RESPONSE' && entry.deliveredTo && (
                    <p className="text-[10px] text-muted-foreground mt-1">Delivered to {entry.deliveredTo}</p>
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">No activity yet.</p>
        )}
      </div>
    </div>
  );
}
