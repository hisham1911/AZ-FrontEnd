"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function OptimizedImage({ src, alt, width, height, className, priority = false }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative">
      {/* Simple loading placeholder */}
      {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" style={{ width, height }} />}

      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0", className)}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}
