"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { Settings, Loader2, AlertTriangle, Check, Save } from "lucide-react";
import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";
import { toast } from "sonner";

type Settings = {
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  scholarshipDeadline: string | null;
  rateLimitFlag: boolean;
};

export default function AdminSettingsPage() {
  const { getToken } = useAuth();
  const { data, isLoading, error, refetch } = useFetchWithTimeout<{ settings: Settings }>('/api/admin/settings');
  const [draft, setDraft] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmingMaintenance, setConfirmingMaintenance] = useState(false);

  useEffect(() => {
    if (data?.settings && !draft) {
      setDraft(data.settings);
    }
  }, [data, draft]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    if (!draft) return;
    setDraft({ ...draft, [key]: value });
  };

  const save = async () => {
    if (!draft) return;
    if (draft.maintenanceMode && !confirmingMaintenance) {
      setConfirmingMaintenance(true);
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Unauthorized');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Save failed');
      }
      toast.success('Settings saved');
      setConfirmingMaintenance(false);
      refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !draft) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Settings className="inline w-4 h-4 mr-2" />
            System
          </p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Maintenance mode, scholarship deadline, and rate-limiting controls.
          </p>
        </div>
      </header>

      <AdminErrorBanner error={error} onRetry={refetch} context="settings" />

      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Maintenance Mode</h2>
              <p className="text-sm text-muted-foreground">
                When enabled, non-admin users see a maintenance page. Admins keep full access.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={draft.maintenanceMode}
              onClick={() => update('maintenanceMode', !draft.maintenanceMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                draft.maintenanceMode ? 'bg-destructive' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  draft.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {draft.maintenanceMode && (
            <div className="space-y-2">
              <label htmlFor="maintenance-message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Message shown to non-admin visitors
              </label>
              <textarea
                id="maintenance-message"
                rows={3}
                value={draft.maintenanceMessage ?? ''}
                onChange={(e) => update('maintenanceMessage', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                placeholder="We'll be back online shortly. Thank you for your patience."
              />
            </div>
          )}

          {confirmingMaintenance && draft.maintenanceMode && (
            <div role="alert" className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Confirm maintenance mode</p>
                <p className="mt-1 text-xs">
                  This will surface a maintenance page to all non-admin users. Click Save again to confirm.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Scholarship Application Deadline</h2>
            <p className="text-sm text-muted-foreground">
              When set, the public form shows an &quot;Applications closed&quot; banner and rejects submissions past this time.
            </p>
          </div>
          <input
            type="datetime-local"
            value={draft.scholarshipDeadline ? new Date(draft.scholarshipDeadline).toISOString().slice(0, 16) : ''}
            onChange={(e) => update('scholarshipDeadline', e.target.value ? new Date(e.target.value).toISOString() : null)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary/50 outline-none"
          />
          {draft.scholarshipDeadline && (
            <p className="text-xs text-muted-foreground">
              Currently set to {new Date(draft.scholarshipDeadline).toLocaleString()}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Aggressive Rate Limiting</h2>
              <p className="text-sm text-muted-foreground">
                When enabled, public endpoints drop to 1 request per 10 seconds per IP. Useful during abuse events.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={draft.rateLimitFlag}
              onClick={() => update('rateLimitFlag', !draft.rateLimitFlag)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                draft.rateLimitFlag ? 'bg-destructive' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  draft.rateLimitFlag ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => { refetch(); setDraft(data!.settings); setConfirmingMaintenance(false); }}
            disabled={saving}
            className="px-4 h-10 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="px-4 h-10 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
