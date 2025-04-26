import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"

export default function CTA() {
  return (
    <section className="py-16 bg-blue-600 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
        <div className="absolute left-10 bottom-10 w-20 h-20 rounded-full bg-blue-400 opacity-10"></div>
        <div className="absolute right-1/4 bottom-0 w-32 h-32 rounded-full bg-blue-700 opacity-15"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Us?</h2>
        </FadeIn>

        <FadeIn delay={200}>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Contact our team today to discuss how AZ INTERNATIONAL can help with your engineering inspection, testing,
            and training needs.
          </p>
        </FadeIn>

        <FadeIn delay={400}>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-300"
            >
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
