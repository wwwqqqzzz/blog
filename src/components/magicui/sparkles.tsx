import React, { useEffect, useRef } from 'react'
import { cn } from '@site/src/lib/utils'

interface SparklesCoreProps {
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  particleColor?: string
  className?: string
  darkMode?: boolean
}

export const SparklesCore = ({
  background = 'transparent',
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  particleColor = 'auto',
  className,
  darkMode,
}: SparklesCoreProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Array<{ x: number, y: number, size: number, speedX: number, speedY: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    const createParticles = () => {
      const { width, height } = canvas
      particles.current = []
      const particleCount = Math.floor((width * height) / (10000 / particleDensity))

      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: Math.random() * 0.2 - 0.1,
          speedY: Math.random() * 0.2 - 0.1,
        })
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const color = particleColor === 'auto'
        ? (darkMode ? '#ffffff' : '#000000')
        : particleColor

      particles.current.forEach((particle) => {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      })

      requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    animate()

    window.addEventListener('resize', () => {
      resizeCanvas()
      createParticles()
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [background, maxSize, minSize, particleColor, particleDensity, darkMode])

  return (
    <canvas
      ref={canvasRef}
      className={cn('h-full w-full', className)}
    />
  )
}
