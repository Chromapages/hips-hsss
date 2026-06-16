"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { Mail, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";

type Inquiry = {
  id: string;
  orgName: string;
  contactName: string;
  email: string;
  message?: string;
  status: string;
  createdAt: string;
};

type PaginatedInquiries = {
  data: Inquiry[];
  total: number;
  take: number;
  skip: number;
};

export default function AdminInquiriesPage() {
  const { data: response, isLoading, error, refetch } = useFetchWithTimeout<PaginatedInquiries>('/api/admin/inquiries');
  const { getToken } = useAuth();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const inquiries = response?.data ?? [];

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    try {
      const token = await getToken();
      if (!token) throw new Error('Unauthorized');
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Update failed');
      }
      refetch();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      clearTimeout(timeoutId);
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizational Inquiries</h1>
          <p className="text-muted-foreground mt-2">Manage partnership leads and training requests.</p>
        </div>
      </header>

      <AdminErrorBanner error={error} onRetry={refetch} context="inquiries" />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-xl border border-border bg-card p-6 hover:border-border-strong hover:shadow-md transition-all shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{inquiry.orgName}</h2>
                      <p className="text-sm text-muted-foreground">{inquiry.contactName} &bull; {inquiry.email}</p>
                    </div>
                  </div>
                  {inquiry.message && (
                    <div className="p-4 rounded-lg bg-muted/30 border border-border">
                      <p className="text-sm text-foreground leading-relaxed italic">"{inquiry.message}"</p>
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Received {format(new Date(inquiry.createdAt), 'MMMM d, yyyy')}</p>
                </div>

                <div className="flex flex-col gap-4 min-w-[200px]">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Lead Status</label>
                    <select
                      value={inquiry.status}
                      disabled={updatingId === inquiry.id}
                      onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      <option value="NEW">New Lead</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="QUALIFIED">Qualified</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="flex items-center justify-center gap-2 w-full bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-primary-hover transition-colors"
                  >
                    Send Email <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
          {inquiries.length === 0 && (
            <div className="p-20 text-center text-muted-foreground rounded-xl border border-dashed border-border">
              <AlertCircle className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No organizational inquiries found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
