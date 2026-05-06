'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Clock, Users } from 'lucide-react'
import { Badge, Button, Card, CardContent } from '@hips/ui'

const CATEGORY_LABELS: Record<string, string> = {
  PEER_SUPPORT: 'Peer Support',
  COACHING: 'Coaching',
  LEADERSHIP: 'Leadership Development',
  ORGANIZATIONAL: 'Organizational',
  RETREATS: 'Retreats',
  CRISIS: 'Crisis Support',
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/v1/services')
        if (!res.ok) throw new Error('Failed to load services')
        const data = await res.json()
        setServices(data.services)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const grouped = services.reduce((acc, service) => {
    const cat = service.category || 'OTHER'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(service)
    return acc
  }, {} as Record<string, any[]>)

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-6">
                <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-64 bg-neutral-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <p className="text-neutral-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-sans text-4xl font-bold text-neutral-900 mb-4">Our Services</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Accessible support for every stage of your journey. Scholarships available for those who need financial assistance.
          </p>
        </div>

        {Object.entries(grouped).map(([category, categoryServices]) => (
          <section key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-sans text-2xl font-semibold text-neutral-900">
                {CATEGORY_LABELS[category] || category}
              </h2>
              <Badge variant="default">{categoryServices.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categoryServices.map((service) => (
                <Card key={service.id} className="flex flex-col">
                  <CardContent className="flex flex-col flex-1 p-6">
                    <div className="flex-1">
                      <h3 className="font-sans text-lg font-semibold text-neutral-900 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500">Price</span>
                        <span className="font-semibold text-neutral-900">
                          {formatPrice(service.standardPrice)}
                        </span>
                      </div>
                      {service.durationMins && (
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Clock className="w-4 h-4" />
                          <span>{service.durationMins} minutes</span>
                        </div>
                      )}
                      {service.maxSeats && service.maxSeats > 0 && (
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Users className="w-4 h-4" />
                          <span>Max {service.maxSeats} per session</span>
                        </div>
                      )}
                      {service.scholarshipMin > 0 && (
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Scholarships available</span>
                        </div>
                      )}
                      <Button
                        className="w-full mt-4"
                        onClick={() => router.push(`/checkout?serviceId=${service.id}`)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {services.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-neutral-600">No services available at this time.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}