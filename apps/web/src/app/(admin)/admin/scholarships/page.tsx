"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const loadScholarships = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/admin/scholarships', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setScholarships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, [getToken]);

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'DENIED', approvedCents?: number) => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/admin/scholarships/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, approvedCents }),
      });
      if (res.ok) {
        loadScholarships(); // Refresh list
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Scholarship Management</h1>
        <p className="text-sm text-zinc-400 mt-2">Review and process financial assistance requests.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Requested</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scholarships.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{s.user.email}</p>
                    <p className="text-xs text-zinc-500">{format(new Date(s.createdAt), 'MMM d, yyyy')}</p>
                  </td>
                  <td className="px-6 py-4 text-white font-mono">
                    ${s.requestedCents / 100}
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-zinc-400 line-clamp-2 text-xs italic">"{s.note}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      s.status === 'PENDING' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                      s.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                      'bg-red-500/10 text-red-300 border-red-500/20'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {s.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(s.id, 'APPROVED', s.requestedCents)}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                          title="Approve Full Amount"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(s.id, 'DENIED')}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          title="Deny"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-zinc-600 text-xs">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {scholarships.length === 0 && (
            <div className="p-20 text-center text-zinc-500">
              <AlertCircle className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No scholarship applications found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
