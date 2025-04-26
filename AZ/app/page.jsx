"use client"

import { Suspense, lazy } from "react"
import Hero from "@/components/hero"
// Import critical components normally
import Services from "@/components/services"

// Lazy load non-critical components
const Stats = lazy(() => import("@/components/stats"))
const Clients = lazy(() => import("@/components/clients"))
const CTA = lazy(() => import("@/components/cta"))
const ScrollProgress = lazy(() =>
  import("@/components/animations/scroll-progress").then((mod) => ({
    default: mod.ScrollProgress,
  })),
)

// Simple loading component
const SimpleLoading = () => (
  <div className="py-16 flex justify-center">
    <div className="animate-spin h-8 w-8 border-2 border-blue-600 rounded-full border-t-transparent"></div>
  </div>
)

export default function Home() {
  return (
    <div>
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>
      <Hero />
      <Services />
      <Suspense fallback={<SimpleLoading />}>
        <Stats />
      </Suspense>
      <Suspense fallback={<SimpleLoading />}>
        <Clients />
      </Suspense>
      <Suspense fallback={<SimpleLoading />}>
        <CTA />
      </Suspense>
    </div>
  )
}
