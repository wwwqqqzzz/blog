import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants, useInView } from 'framer-motion'
import { cn } from '@site/src/lib/utils'

/**
 * 淡入组件 - 元素从下方淡入
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  from = 'bottom',
  distance = 20,
  threshold = 0.1,
  once = true,
  ...props
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  from?: 'bottom' | 'top' | 'left' | 'right'
  distance?: number
  threshold?: number
  once?: boolean
  [key: string]: any
}) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })

  // 根据方向设置初始和动画值
  const getDirectionValues = () => {
    const directions = {
      top: { y: -distance, x: 0 },
      bottom: { y: distance, x: 0 },
      left: { x: -distance, y: 0 },
      right: { x: distance, y: 0 },
    }
    return directions[from]
  }

  const { x, y } = getDirectionValues()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x, y }
      }
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * 淡入淡出组件 - 元素淡入淡出显示
 */
export function Fade({
  show,
  children,
  className,
  ...props
}: {
  show: boolean
  children: React.ReactNode
  className?: string
  [key: string]: any
}) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * 滑动组件 - 元素从一个方向滑入
 */
export function Slide({
  show,
  children,
  from = 'right',
  className,
  ...props
}: {
  show: boolean
  children: React.ReactNode
  from?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
  [key: string]: any
}) {
  const directions = {
    top: { y: '-100%', x: 0 },
    right: { x: '100%', y: 0 },
    bottom: { y: '100%', x: 0 },
    left: { x: '-100%', y: 0 },
  }

  const { x, y } = directions[from]

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ x, y, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ x, y, opacity: 0 }}
          className={className}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * 放大组件 - 元素放大出现
 */
export function Scale({
  show,
  children,
  origin = 'center',
  className,
  ...props
}: {
  show: boolean
  children: React.ReactNode
  origin?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  className?: string
  [key: string]: any
}) {
  const originMap = {
    center: 'center',
    top: 'top center',
    bottom: 'bottom center',
    left: 'center left',
    right: 'center right',
  }

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          style={{ transformOrigin: originMap[origin] }}
          className={className}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * 列表动画组件 - 为列表项添加连续动画
 */
export function AnimatedList({
  children,
  className,
  staggerDelay = 0.1,
  ...props
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  [key: string]: any
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // 为每个子元素添加动画变体
  const childrenWithVariants = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child

    return React.cloneElement(child as React.ReactElement<any>, {
      variants: itemVariants,
    })
  })

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      {...props}
    >
      {childrenWithVariants}
    </motion.div>
  )
}

/**
 * 波纹按钮效果组件
 */
export function RippleEffect({
  children,
  color = 'rgba(255, 255, 255, 0.3)',
  className,
  disabled = false,
  ...props
}: {
  children: React.ReactNode
  color?: string
  className?: string
  disabled?: boolean
  [key: string]: any
}) {
  const [ripples, setRipples] = useState<{ x: number, y: number, key: number }[]>([])
  const [counter, setCounter] = useState(0)

  // 创建波纹效果
  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    const newRipple = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      key: counter,
    }

    setRipples([...ripples, newRipple])
    setCounter(counter + 1)
  }

  // 移除波纹
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ripples.length > 0) {
        setRipples(ripples.slice(1))
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [ripples])

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onClick={createRipple}
      {...props}
    >
      {children}
      {ripples.map(({ x, y, key }) => (
        <motion.span
          key={key}
          className="absolute rounded-full"
          style={{
            left: x,
            top: y,
            backgroundColor: color,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 500, height: 500, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/**
 * 打字机效果组件
 */
export function TypewriterEffect({
  text,
  speed = 50,
  delay = 0,
  className,
  ...props
}: {
  text: string
  speed?: number
  delay?: number
  className?: string
  [key: string]: any
}) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!text) return

    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0)
        setDisplayText('')
      }, delay)

      return () => clearTimeout(delayTimer)
    }
  }, [text, delay])

  useEffect(() => {
    if (currentIndex >= text.length) return

    const timer = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex])
      setCurrentIndex(prev => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [currentIndex, speed, text])

  return (
    <div className={className} {...props}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="ml-0.5 inline-block h-4 w-0.5 bg-current align-middle"
      />
    </div>
  )
}

/**
 * 滚动进度指示器组件
 */
export function ScrollProgress({
  color = 'bg-primary-500',
  height = 'h-1',
  className,
  ...props
}: {
  color?: string
  height?: string
  className?: string
  [key: string]: any
}) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn('fixed left-0 top-0 z-50 w-full bg-gray-200 dark:bg-gray-800', height, className)}
      {...props}
    >
      <motion.div
        className={cn('h-full', color)}
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: '0%' }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1 }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

/**
 * 视差滚动效果组件
 */
export function ParallaxScroll({
  children,
  speed = 0.2,
  className,
  ...props
}: {
  children: React.ReactNode
  speed?: number
  className?: string
  [key: string]: any
}) {
  const [offsetY, setOffsetY] = useState(0)
  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        const viewportCenterY = window.innerHeight / 2
        setOffsetY((centerY - viewportCenterY) * speed)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
      <motion.div
        style={{ y: offsetY }}
        transition={{ duration: 0 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * 悬浮效果组件
 */
export function HoverEffect({
  children,
  className,
  scale = 1.05,
  rotate = 0,
  y = -5,
  shadow = 'shadow-md hover:shadow-lg',
  ...props
}: {
  children: React.ReactNode
  className?: string
  scale?: number
  rotate?: number
  y?: number
  shadow?: string
  [key: string]: any
}) {
  return (
    <motion.div
      className={cn('transition-shadow', shadow, className)}
      whileHover={{
        scale,
        rotate,
        y,
        transition: { type: 'spring', stiffness: 400, damping: 10 },
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export * from 'framer-motion'
