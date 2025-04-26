"use client"

import { useEffect, useState, useRef } from "react"

export function CountUp({ end, duration = 2000, prefix = "", suffix = "", className = "" }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
      },
    )

    const currentRef = countRef.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime
    let animationFrame

    const startAnimation = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      // Calculate the current count based on progress
      const percentage = Math.min(progress / duration, 1)
      // Use easeOutQuad for smoother animation
      const eased = 1 - (1 - percentage) * (1 - percentage)
      const currentCount = Math.floor(eased * end)

      setCount(currentCount)

      if (progress < duration) {
        animationFrame = requestAnimationFrame(startAnimation)
      } else {
        setCount(end) // Ensure we end at the exact target
      }
    }

    animationFrame = requestAnimationFrame(startAnimation)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isVisible])

  return (
    <span ref={countRef} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
