'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFetchWithTimeout } from '@/hooks/useFetchWithTimeout';
import { Users, Search, Shield, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type AdminUser = {
  id: string;
  email?: string;
  role: 'ADMIN' | 'FACILITATOR' | 'PARTICIPANT' | string;
  createdAt?: string;
};

export default function UserManagementPage() {
  const { data, isLoading, refetch } = useFetchWithTimeout<{ users: AdminUser[] }>('/api/admin/users');
  const { getToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const users = data?.users ?? [];

  const updateRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    try {
      const token = await getToken();
      if (!token) throw new Error('Unauthorized');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
        signal: controller.signal,
      });
      const result = await res.json().catch(() => ({}));
      if (result.error) throw new Error(result.error);

      toast.success(`User updated to ${newRole}`);
      refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      toast.error(message);
    } finally {
      clearTimeout(timeoutId);
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-12">
        <h1 className="font-heading text-4xl font-extrabold text-white">User <span className="text-[#173B57]">Operations</span></h1>
        <p className="mt-4 text-zinc-400">Manage platform permissions and verify lead credentials.</p>
      </header>

      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by email or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-[#173B57] focus:ring-1 focus:ring-[#173B57] outline-none transition-all"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#173B57]" /></div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-zinc-500">
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(user => (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{user.email || 'Anonymous'}</span>
                      <span className="text-[10px] font-mono text-zinc-600">{user.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'ADMIN' ? (
                        <ShieldAlert className="h-4 w-4 text-rose-400" />
                      ) : user.role === 'FACILITATOR' ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Shield className="h-4 w-4 text-zinc-500" />
                      )}
                      <span className={`text-xs font-bold ${
                        user.role === 'ADMIN' ? 'text-rose-400' :
                        user.role === 'FACILITATOR' ? 'text-emerald-400' : 'text-zinc-400'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      disabled={updatingId === user.id}
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className="bg-black border border-white/10 rounded-lg text-xs font-bold text-white px-2 py-1 outline-none focus:border-[#173B57] transition-all cursor-pointer"
                    >
                      <option value="PARTICIPANT">PARTICIPANT</option>
                      <option value="FACILITATOR">FACILITATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
