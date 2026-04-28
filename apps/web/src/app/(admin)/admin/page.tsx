import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DollarSign, Users, Activity, CreditCard } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$45,231.89</div>
            <p className="text-xs text-emerald-400 mt-1">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Sessions</CardTitle>
            <Activity className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+2350</div>
            <p className="text-xs text-emerald-400 mt-1">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Scholarships Funded</CardTitle>
            <CreditCard className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,203</div>
            <p className="text-xs text-emerald-400 mt-1">+19% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Orgs</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">42</div>
            <p className="text-xs text-gray-500 mt-1">No change since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="col-span-4 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Revenue History</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t border-gray-800 mt-4">
            <p className="text-gray-500">Chart component placeholder</p>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Safety Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
               {/* Placeholder for alerts list */}
               <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                 <div>
                   <p className="text-sm font-medium text-red-400">Severity: HIGH</p>
                   <p className="text-xs text-gray-500">Session ID: ***89A2</p>
                 </div>
                 <span className="text-xs text-gray-400">10 min ago</span>
               </div>
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-amber-400">Severity: MEDIUM</p>
                   <p className="text-xs text-gray-500">Session ID: ***2B41</p>
                 </div>
                 <span className="text-xs text-gray-400">2 hrs ago</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
