import Link from "next/link"
import { LayoutDashboard, Calendar, Users, ShieldAlert, Settings, LogOut } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-gray-950 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-bold text-lg tracking-tight">H.I.P.S. Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md bg-indigo-600/10 text-indigo-400">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Bookings</span>
          </Link>
          <Link href="/admin/organizations" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Organizations</span>
          </Link>
          <Link href="/admin/safety" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">
            <ShieldAlert className="w-5 h-5" />
            <span className="font-medium">Safety Alerts</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        {children}
      </main>
    </div>
  )
}
