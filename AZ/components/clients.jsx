import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { FadeIn } from "@/components/animations/fade-in"
import { LazyImage } from "@/components/lazy-image"

export default function Clients() {
  const clients = [
    {
      name: "Siemens Energy",
      logo: "/placeholder.svg?height=80&width=160",
      description: "Welding & vibration analysis",
    },
    { name: "Orascom", logo: "/placeholder.svg?height=80&width=160", description: "Third-party inspection" },
    { name: "Sinoma-CDI", logo: "/placeholder.svg?height=80&width=160", description: "PMI & phased array services" },
    { name: "Al Ezz Flat Steel", logo: "/placeholder.svg?height=80&width=160", description: "RT, PT, MT, UT" },
    { name: "Boysen Egypt", logo: "/placeholder.svg?height=80&width=160", description: "DT & NDT services" },
    {
      name: "Egyptian Chinese Drilling Co",
      logo: "/placeholder.svg?height=80&width=160",
      description: "Technical consulting",
    },
    {
      name: "Elsewedy Cement Company",
      logo: "/placeholder.svg?height=80&width=160",
      description: "Inspection of manufacturing equipment",
    },
    {
      name: "German University in Cairo",
      logo: "/placeholder.svg?height=80&width=160",
      description: "Radiation protection cladding",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Clients</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're proud to work with leading organizations across various industries, providing them with reliable
            engineering and inspection services.
          </p>
        </FadeIn>

        <FadeIn delay={200}>
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {clients.map((client, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="relative h-20 w-40 mb-4">
                        <LazyImage
                          src={client.logo || "/placeholder.svg"}
                          alt={`${client.name} logo`}
                          width={160}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{client.name}</h3>
                      <p className="text-gray-600 text-center text-sm">{client.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </FadeIn>
      </div>
    </section>
  )
}
