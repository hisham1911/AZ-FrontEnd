"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function RevealText({ text, className, delay = 0, duration = 1000, threshold = 0.1 }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
      },
    )

    const currentRef = ref.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  // Split text into individual characters
  const characters = text.split("")

  return (
    <span ref={ref} className={cn("inline-block overflow-hidden", className)}>
      {characters.map((char, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: `opacity ${duration / 2}ms ease-out, transform ${duration / 2}ms ease-out`,
            transitionDelay: `${delay + index * (duration / characters.length / 4)}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}
