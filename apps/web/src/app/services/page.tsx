import { SERVICES_CATALOG } from "@/lib/services-data"
import { Navbar } from "@/components/polish/Navbar"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <Navbar />
      <header className="pt-24 pb-12 border-b border-white/5 bg-gray-900/30">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-4xl font-bold mb-4">Service Catalog</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Choose the support format that fits your needs. All sessions are strictly anonymous and camera-free.
          </p>
        </div>
      </header>

      {/* Catalog Grid */}
      <section className="container mx-auto px-6 max-w-5xl mt-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_CATALOG.map((service) => {
            const Icon = service.icon
            return (
              <Card key={service.id} className="bg-gray-900 border-gray-800 flex flex-col hover:border-indigo-500/50 transition-colors">
                <CardHeader>
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <CardTitle className="text-white text-lg">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400">{service.duration} • {service.price}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-300 leading-relaxed">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    aria-label={`View details for ${service.title}`}
                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                    href={`/services/${service.slug}`}
                  >
                    View Details
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
