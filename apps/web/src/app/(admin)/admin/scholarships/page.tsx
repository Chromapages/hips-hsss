"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFetchWithTimeout } from "@/hooks/useFetchWithTimeout";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

type Scholarship = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | string;
  requestedCents: number;
  note?: string;
  createdAt: string;
  user: { email: string };
};

export default function AdminScholarshipsPage() {
  const { data, isLoading, refetch } = useFetchWithTimeout<Scholarship[]>('/api/admin/scholarships');
  const { getToken } = useAuth();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const scholarships = Array.isArray(data) ? data : [];

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'DENIED', approvedCents?: number) => {
    setUpdatingId(id);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    try {
      const token = await getToken();
      if (!token) throw new Error('Unauthorized');
      const res = await fetch(`/api/admin/scholarships/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, approvedCents }),
        signal: controller.signal,
      });
      if (res.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      clearTimeout(timeoutId);
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Scholarship Management</h1>
        <p className="text-sm text-muted-foreground mt-2">Review and process financial assistance requests.</p>
      </header>

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
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scholarships.map((s) => (
                <tr key={s.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{s.user.email}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(s.createdAt), 'MMM d, yyyy')}</p>
                  </td>
                  <td className="px-6 py-4 text-foreground font-mono">
                    ${s.requestedCents / 100}
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-muted-foreground line-clamp-2 text-xs italic">"{s.note}"</p>
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
                  <td className="px-6 py-4">
                    {s.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'APPROVED', s.requestedCents)}
                          disabled={updatingId === s.id}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                          title="Approve Full Amount"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'DENIED')}
                          disabled={updatingId === s.id}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all disabled:opacity-50"
                          title="Deny"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {scholarships.length === 0 && (
            <div className="p-20 text-center text-muted-foreground">
              <AlertCircle className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No scholarship applications found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
