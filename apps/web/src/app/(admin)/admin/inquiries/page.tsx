"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Mail, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/admin/inquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [getToken]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = await getToken();
      await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      loadInquiries();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Organizational Inquiries</h1>
          <p className="text-gray-400 mt-2">Manage partnership leads and training requests.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid gap-6">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-xl border border-white/10 bg-gray-900 p-6 hover:border-white/20 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Mail className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{inquiry.orgName}</h2>
                      <p className="text-sm text-gray-400">{inquiry.contactName} &bull; {inquiry.email}</p>
                    </div>
                  </div>
                  {inquiry.message && (
                    <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-sm text-gray-300 leading-relaxed italic">"{inquiry.message}"</p>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold">Received {format(new Date(inquiry.createdAt), 'MMMM d, yyyy')}</p>
                </div>

                <div className="flex flex-col gap-4 min-w-[200px]">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Lead Status</label>
                    <select 
                      value={inquiry.status}
                      onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="NEW">New Lead</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="QUALIFIED">Qualified</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <a 
                    href={`mailto:${inquiry.email}`}
                    className="flex items-center justify-center gap-2 w-full bg-white text-black rounded-lg px-4 py-2 text-sm font-bold hover:bg-gray-200 transition-colors"
                  >
                    Send Email <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
          {inquiries.length === 0 && (
            <div className="p-20 text-center text-gray-500 rounded-xl border border-dashed border-white/10">
              <AlertCircle className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>No organizational inquiries found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
