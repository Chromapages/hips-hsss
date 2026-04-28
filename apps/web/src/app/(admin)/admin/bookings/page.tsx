import { EmptyState } from "@/components/ui/empty-state"
import { CalendarX2 } from "lucide-react"

export default function AdminBookingsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Bookings Queue</h1>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg h-[600px] flex items-center justify-center">
        <EmptyState 
          icon={CalendarX2}
          title="No Upcoming Bookings"
          description="There are currently no active bookings in the system for this filter period."
        />
      </div>
    </div>
  )
}
