import Image from "next/image"
import { FadeIn } from "@/components/animations/fade-in"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About AZ INTERNATIONAL</h1>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="mb-8 overflow-hidden rounded-lg">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="AZ International Team"
                width={800}
                height={400}
                className="rounded-lg w-full h-auto transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </FadeIn>

        <div className="space-y-6">
          <FadeIn delay={300} direction="up">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Company Overview</h2>
              <p className="text-gray-700">
                AZ International specializes in engineering inspection, technical consultancy, and engineering training
                services, adhering to the highest international standards in Non-Destructive Testing (NDT), quality
                assurance, and welding. Founded in 2012 by distinguished university professors and industry experts with
                extensive local and international experience.
              </p>
            </section>
          </FadeIn>

          <FadeIn delay={400} direction="up">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
              <p className="text-gray-700">
                To become a leading provider of inspection and technical training services in the Arab world and
                actively contribute to developing engineering competencies.
              </p>
            </section>
          </FadeIn>

          <FadeIn delay={500} direction="up">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-gray-700">
                To provide a training and consulting environment based on knowledge and experience that supports market
                requirements and improves the quality of operations and products.
              </p>
            </section>
          </FadeIn>

          <FadeIn delay={600} direction="up">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Expertise</h2>
              <p className="text-gray-700">
                AZ is a third-party inspection and capacity-building organization established in 2012, specializing in
                increasing the competencies of engineers and technicians involved in metal construction, oil and gas
                sectors. We provide high-quality Non-Destructive Testing (NDT), quality control, and inspection
                services.
              </p>
            </section>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
