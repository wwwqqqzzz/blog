import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { TypewriterEffect } from './ui/animations'
import { cn } from '@site/src/lib/utils'

interface AnimatedHeadingProps {
  title: string
  subtitle?: string
  gradient?: boolean
  typewriter?: boolean
  className?: string
}

/**
 * 高级动画标题组件
 * 支持多种动画效果，包括打字机效果和渐变文字
 */
export default function AnimatedHeading({
  title,
  subtitle,
  gradient = false,
  typewriter = false,
  className,
}: AnimatedHeadingProps): React.ReactElement {
  const titleControls = useAnimation()
  const subtitleControls = useAnimation()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // 标题动画序列
    titleControls.start({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        duration: 0.8,
      },
    })

    // 副标题动画序列（延迟启动）
    subtitleControls.start({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        delay: 0.3,
        duration: 0.8,
      },
    })
  }, [titleControls, subtitleControls])

  return (
    <div className={cn('text-center', className)}>
      {/* 标题部分 */}
      <motion.h1
        className={cn(
          'text-3xl font-bold sm:text-4xl md:text-5xl',
          gradient && 'bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent',
        )}
        initial={{ opacity: 0, y: 50 }}
        animate={titleControls}
      >
        {typewriter && isMounted
          ? <TypewriterEffect text={title} speed={60} />
          : title}
      </motion.h1>

      {/* 副标题部分（如果有） */}
      {subtitle && (
        <motion.p
          className="mt-4 text-base text-gray-600 dark:text-gray-400 sm:text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={subtitleControls}
        >
          {subtitle}
        </motion.p>
      )}

      {/* 装饰性元素 */}
      <motion.div
        className="mx-auto mt-6 h-1 w-20 bg-primary-500"
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </div>
  )
}
