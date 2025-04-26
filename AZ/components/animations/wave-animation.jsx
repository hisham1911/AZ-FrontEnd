"use client"

import { useEffect, useRef } from "react"

export function WaveAnimation({ className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    let animationFrameId
    let width = canvas.width
    let height = canvas.height

    // Set canvas dimensions to match its display size
    const resizeCanvas = () => {
      const { width: displayWidth, height: displayHeight } = canvas.getBoundingClientRect()
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
        width = displayWidth
        height = displayHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Wave parameters
    const waves = [
      { y: height * 0.2, length: 0.5, amplitude: 20, speed: 0.03, color: "rgba(59, 130, 246, 0.3)" }, // Blue wave 1
      { y: height * 0.3, length: 0.7, amplitude: 15, speed: 0.02, color: "rgba(59, 130, 246, 0.2)" }, // Blue wave 2
      { y: height * 0.4, length: 0.9, amplitude: 10, speed: 0.01, color: "rgba(59, 130, 246, 0.1)" }, // Blue wave 3
    ]

    let time = 0

    // Update the drawWave function to support inverted waves
    const drawWave = (y, length, amplitude, speed, color, inverted = false) => {
      ctx.beginPath()

      if (inverted) {
        // For inverted waves, start at the bottom
        ctx.moveTo(0, height)

        for (let x = 0; x < width; x++) {
          const dx = x / width
          const offsetY = Math.sin((dx * Math.PI * 2) / length + time * speed) * amplitude
          // Draw from bottom up
          ctx.lineTo(x, height - y - offsetY)
        }

        ctx.lineTo(width, height)
      } else {
        // Original non-inverted waves
        ctx.moveTo(0, y)

        for (let x = 0; x < width; x++) {
          const dx = x / width
          const offsetY = Math.sin((dx * Math.PI * 2) / length + time * speed) * amplitude
          ctx.lineTo(x, y + offsetY)
        }

        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
      }

      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    // Update the render function to use the inverted parameter
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Get inverted parameter from canvas dataset
      const isInverted = canvas.dataset.inverted === "true"

      // Draw waves from bottom to top
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i]
        drawWave(wave.y, wave.length, wave.amplitude, wave.speed, wave.color, isInverted)
      }

      time += 0.05
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
