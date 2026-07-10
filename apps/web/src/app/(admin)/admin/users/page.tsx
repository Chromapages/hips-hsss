'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFetchWithTimeout } from '@/hooks/useFetchWithTimeout';
import { Users, Search, Shield, ShieldAlert, ShieldCheck, ShieldOff, Download, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { AdminErrorBanner } from '@/components/admin/AdminErrorBanner';
import { useRole } from '@/hooks/useRole';

type AdminUser = {
  id: string;
  email?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FACILITATOR' | 'PARTICIPANT' | string;
  suspendedAt?: string | null;
  suspensionReason?: string | null;
  createdAt?: string;
};

type SuspendModal = {
  user: AdminUser;
  action: 'suspend' | 'unsuspend';
  reason: string;
  notifyUser: boolean;
  submitting: boolean;
  error: string | null;
};

export default function UserManagementPage() {
  const { data, isLoading, error, refetch } = useFetchWithTimeout<{ users: AdminUser[] }>('/api/admin/users');
  const { getToken } = useAuth();
  const { role: actorRole } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [modal, setModal] = useState<SuspendModal | null>(null);
  const [exporting, setExporting] = useState(false);

  const users = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return users;
    return users.filter(u =>
      u.email?.toLowerCase().includes(needle) ||
      u.id.toLowerCase().includes(needle) ||
      u.role.toLowerCase().includes(needle)
    );
  }, [users, searchTerm]);

  const updateRole = async (userId: string, newRole: string) => {
    if (!window.confirm(`Change this user's role to ${newRole}? They will be signed out immediately.`)) return;

    setUpdatingId(userId);
    try {
      const token = await getToken();
      if (!token) throw new Error('Unauthorized');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const result = await res.json().catch(() => ({}));
      if (result.error) throw new Error(result.error);

      toast.success(`User updated to ${newRole}`);
      refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const openSuspend = (user: AdminUser) => {
    setModal({
      user,
      action: user.suspendedAt ? 'unsuspend' : 'suspend',
      reason: '',
      notifyUser: true,
      submitting: false,
      error: null,
    });
  };

  const closeModal = () => {
    if (modal?.submitting) return;
    setModal(null);
  };

  const submitSuspend = async () => {
    if (!modal) return;
    if (modal.reason.trim().length < 5) {
      setModal({ ...modal, error: 'Please provide a reason (5+ characters).' });
      return;
    }
    setModal({ ...modal, submitting: true, error: null });
    setUpdatingId(modal.user.id);
    try {
      const token = await getToken();
      if (!token) throw new Error('Unauthorized');
      const res = await fetch(`/api/admin/users/${modal.user.id}/${modal.action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: modal.reason, notifyUser: modal.notifyUser }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || result.error) {
        throw new Error(result.error || `${modal.action} failed`);
      }
      if (result.emailStatus === 'failed') {
        toast.warning(`${modal.action === 'suspend' ? 'Suspended' : 'Reactivated'} but email failed to send. Check the audit log.`);
      } else {
        toast.success(modal.action === 'suspend' ? 'User suspended' : 'User reactivated');
      }
      setModal(null);
      refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Action failed';
      setModal((m) => (m ? { ...m, submitting: false, error: message } : m));
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Unauthorized');
      const res = await fetch('/api/admin/exports/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Export failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Export failed';
      toast.error(message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-12 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-4xl font-extrabold text-foreground">
            User <span className="text-accent">Operations</span>
          </h1>
          <p className="mt-4 text-muted-foreground">Manage platform permissions, suspend abusers, and verify lead credentials.</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={exporting}
          className="flex items-center gap-2 px-3 h-10 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Export CSV
        </button>
      </header>

      <AdminErrorBanner error={error} onRetry={refetch} context="users" />

      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by email, ID, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-border rounded-2xl py-3 pl-12 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map(user => {
                const isSuspended = Boolean(user.suspendedAt);
                return (
                  <tr key={user.id} className="group hover:bg-muted/5 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{user.email || 'Anonymous'}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{user.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === 'SUPER_ADMIN' ? <ShieldAlert className="h-4 w-4 text-purple-500" /> :
                          user.role === 'ADMIN' ? <ShieldAlert className="h-4 w-4 text-rose-500" /> :
                          user.role === 'FACILITATOR' ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> :
                          <Shield className="h-4 w-4 text-muted-foreground" />}
                        <span className={`text-xs font-bold ${
                          user.role === 'SUPER_ADMIN' ? 'text-purple-500' :
                          user.role === 'ADMIN' ? 'text-rose-500' :
                          user.role === 'FACILITATOR' ? 'text-emerald-500' : 'text-foreground'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isSuspended
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      }`}>
                        {isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                      </span>
                      {isSuspended && user.suspensionReason && (
                        <p className="text-[10px] text-muted-foreground mt-1 italic max-w-[200px] truncate" title={user.suspensionReason}>
                          {user.suspensionReason}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          disabled={
                            updatingId === user.id
                            || user.role === 'SUPER_ADMIN'
                            || isSuspended
                            || (actorRole !== 'SUPER_ADMIN' && user.role === 'ADMIN')
                          }
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className="bg-background border border-border rounded-lg text-xs font-bold text-foreground px-3 py-1.5 outline-none focus:border-primary transition-all cursor-pointer disabled:opacity-30"
                        >
                          {user.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">SUPER_ADMIN</option>}
                          <option value="PARTICIPANT">PARTICIPANT</option>
                          <option value="FACILITATOR">FACILITATOR</option>
                          {actorRole === 'SUPER_ADMIN' && <option value="ADMIN">ADMIN</option>}
                        </select>
                        {user.role !== 'SUPER_ADMIN' && (
                          <button
                            type="button"
                            onClick={() => openSuspend(user)}
                            disabled={updatingId === user.id}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                              isSuspended
                                ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                                : 'border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white'
                            } transition-all disabled:opacity-50`}
                            title={isSuspended ? 'Reactivate' : 'Suspend'}
                          >
                            {isSuspended ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                            {isSuspended ? 'Unsuspend' : 'Suspend'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="suspend-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 id="suspend-title" className="text-lg font-bold text-foreground">
                {modal.action === 'suspend' ? 'Suspend user' : 'Reactivate user'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                disabled={modal.submitting}
                aria-label="Close"
                className="p-1.5 rounded text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              {modal.action === 'suspend'
                ? 'This will revoke all active sessions and log the user out. They will not be able to sign in until reactivated.'
                : 'This will restore sign-in access for this user.'}
              <br />
              Target: <span className="font-mono text-foreground">{modal.user.email || modal.user.id}</span>
            </p>

            <div className="mb-4">
              <label htmlFor="suspend-reason" className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
                Reason (recorded in audit log)
              </label>
              <textarea
                id="suspend-reason"
                rows={3}
                value={modal.reason}
                onChange={(e) => setModal({ ...modal, reason: e.target.value, error: null })}
                disabled={modal.submitting}
                placeholder="Describe the reason (5-1000 characters)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary/50 outline-none resize-none disabled:opacity-50"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{modal.reason.length}/1000</p>
            </div>

            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <input
                type="checkbox"
                checked={modal.notifyUser}
                onChange={(e) => setModal({ ...modal, notifyUser: e.target.checked })}
                disabled={modal.submitting}
              />
              Send notification email to the user
            </label>

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
                onClick={submitSuspend}
                disabled={modal.submitting}
                className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 ${
                  modal.action === 'suspend' ? 'bg-destructive hover:bg-destructive/90' : 'bg-emerald-600 hover:bg-emerald-700'
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
