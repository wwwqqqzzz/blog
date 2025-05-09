import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { cn } from '@site/src/lib/utils'

/**
 * 滚动进入视图时的动画组件
 */
export function ScrollReveal({
  children,
  className,
  threshold = 0.1,
  direction = 'up',
  distance = 50,
  delay = 0,
  duration = 0.5,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  threshold?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  delay?: number
  duration?: number
  once?: boolean
}): React.ReactElement {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once,
    amount: threshold, // 使用amount替代threshold
  })

  // 根据方向设置动画初始位置
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: distance }
      case 'down': return { opacity: 0, y: -distance }
      case 'left': return { opacity: 0, x: distance }
      case 'right': return { opacity: 0, x: -distance }
      default: return { opacity: 0, y: distance }
    }
  }

  // 最终动画位置
  const finalPosition = { opacity: 1, y: 0, x: 0 }

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isInView ? finalPosition : getInitialPosition()}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * 渐进显示列表项的组件
 */
export function ScrollStagger({
  children,
  className,
  staggerDelay = 0.1,
  itemDelay = 0.2,
  threshold = 0.1,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  itemDelay?: number
  threshold?: number
  once?: boolean
}): React.ReactElement {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once,
    amount: threshold, // 使用amount替代threshold
  })

  // 为子元素添加动画
  const childArray = React.Children.toArray(children)
  const animatedChildren = childArray.map((child, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: itemDelay + index * staggerDelay,
        ease: 'easeOut',
      }}
    >
      {child}
    </motion.div>
  ))

  return (
    <div ref={ref} className={className}>
      {animatedChildren}
    </div>
  )
}

/**
 * 视差滚动效果组件
 */
export function ScrollParallax({
  children,
  className,
  speed = 0.2, // 正值向下移动，负值向上移动
  direction = 'vertical',
}: {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: 'vertical' | 'horizontal'
}): React.ReactElement {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // 根据方向应用变换
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'vertical' ? ['-10%', `${speed * 100}%`] : ['0%', '0%'],
  )

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'horizontal' ? ['-10%', `${speed * 100}%`] : ['0%', '0%'],
  )

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={{ y, x }}>
        {children}
      </motion.div>
    </div>
  )
}

/**
 * 滚动进度指示器
 */
export function ScrollProgressIndicator({
  showPercentage = false,
  barClassName,
  textClassName,
}: {
  showPercentage?: boolean
  barClassName?: string
  textClassName?: string
}): React.ReactElement {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      // 计算滚动进度
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      setProgress(Math.min(100, Math.max(0, (scrollPosition / totalHeight) * 100)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-2">
      <div className="h-40 w-1 rounded-full bg-gray-200 dark:bg-gray-800">
        <motion.div
          className={cn('w-full rounded-full bg-primary-500', barClassName)}
          initial={{ height: '0%' }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      {showPercentage && (
        <div className={cn('text-xs font-medium', textClassName)}>
          {Math.round(progress)}
          %
        </div>
      )}
    </div>
  )
}

/**
 * 元素淡入淡出组件 - 基于滚动位置
 */
export function FadeByScroll({
  children,
  className,
  startFade = 0.3, // 开始淡出的滚动进度 (0-1)
  endFade = 0.8, // 完全淡出的滚动进度 (0-1)
  reverse = false, // 是否反转效果（淡入而非淡出）
  threshold = 0.1,
}: {
  children: React.ReactNode
  className?: string
  startFade?: number
  endFade?: number
  reverse?: boolean
  threshold?: number
}): React.ReactElement {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // 基于滚动位置的不透明度
  const opacity = useTransform(
    scrollYProgress,
    [startFade, endFade],
    reverse ? [0, 1] : [1, 0],
  )

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * 固定在视图中的元素，可以添加透明度变化
 */
export function StickyScroll({
  children,
  className,
  topOffset = 0,
  fadeStart = 0,
  fadeEnd = 0,
}: {
  children: React.ReactNode
  className?: string
  topOffset?: number
  fadeStart?: number // 开始淡出的滚动位置
  fadeEnd?: number // 结束淡出的滚动位置
}): React.ReactElement {
  const ref = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 计算不透明度
  const opacity = (() => {
    if (fadeStart === 0 && fadeEnd === 0) return 1 // 不应用淡出效果

    if (scrollPosition < fadeStart) return 1
    if (scrollPosition > fadeEnd) return 0

    return 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart)
  })()

  return (
    <div
      ref={ref}
      className={cn('sticky', className)}
      style={{
        top: topOffset,
        opacity: opacity,
      }}
    >
      {children}
    </div>
  )
}
