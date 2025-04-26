import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { FadeIn } from "@/components/animations/fade-in"
import { RevealText } from "@/components/animations/reveal-text"
import { WaveAnimation } from "@/components/animations/wave_animation"

export default function Hero() {
  return (
    <div className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/engineer-industrial.png"
          alt="Engineer at industrial facility"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-32 w-32 mb-6">
            <Image
              src="/images/az-logo.png"
              alt="AZ International Logo"
              width={128}
              height={128}
              priority
              className="animate-pulse"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <RevealText text="Engineering Excellence & Technical Expertise" />
          </h1>

          <FadeIn delay={500} duration={800}>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Providing high-quality inspection, testing, and technical consulting services since 2012. Trusted by
              industry leaders across the Middle East.
            </p>
          </FadeIn>

          <FadeIn delay={800} duration={800}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/services">Explore Our Services</Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Wave Animation - Positioned at the bottom but inverted */}
      <div className="absolute bottom-0 left-0 right-0 z-[1] h-16 md:h-24">
        <WaveAnimation className="w-full h-full" data-inverted="true" />
      </div>
    </div>
  )
}
