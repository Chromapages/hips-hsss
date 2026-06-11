import { EmptyState } from "@/components/ui/empty-state"

export default function AdminBookingsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Bookings Queue</h1>
      </div>

      <div className="bg-card border border-border rounded-lg h-[600px] flex items-center justify-center shadow-lg">
        <EmptyState
          title="No Upcoming Bookings"
          description="There are currently no active bookings in the system for this filter period."
        />
      </div>
    </div>
  )
}
