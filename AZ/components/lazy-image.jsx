"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function LazyImage({ src, alt, width, height, className, placeholderClassName, priority = false, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }, // Start loading when image is 200px from viewport
    )

    const currentElement = document.getElementById(`lazy-image-${src}`)
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [src, priority])

  return (
    <div
      id={`lazy-image-${src}`}
      className={cn("relative overflow-hidden", className)}
      style={{ width: width || "100%", height: height || "auto" }}
    >
      {(!isInView || !isLoaded) && (
        <div className={cn("absolute inset-0 bg-gray-200 animate-pulse rounded", placeholderClassName)} />
      )}

      {isInView && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          className={cn("transition-opacity duration-500", isLoaded ? "opacity-100" : "opacity-0", className)}
          {...props}
        />
      )}
    </div>
  )
}
