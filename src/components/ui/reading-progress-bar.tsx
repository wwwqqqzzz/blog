import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@site/src/lib/utils'

interface ReadingProgressBarProps {
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 是否显示进度百分比
   * @default false
   */
  showPercentage?: boolean
  /**
   * 进度条位置
   * @default "top"
   */
  position?: 'top' | 'bottom'
  /**
   * 进度条高度
   * @default 3
   */
  height?: number
  /**
   * 进度条颜色
   * @default "var(--ifm-color-primary)"
   */
  color?: string
}

/**
 * 高级阅读进度条组件
 */
export function ReadingProgressBar({
  className,
  showPercentage = false,
  position = 'top',
  height = 3,
  color = 'var(--ifm-color-primary)',
}: ReadingProgressBarProps): React.ReactElement | null {
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  // 计算阅读进度
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    setMounted(true)

    const updateProgress = () => {
      // 获取页面滚动位置
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      // 获取页面总高度（减去窗口高度）
      const docHeight
        = document.documentElement.scrollHeight
          - document.documentElement.clientHeight

      // 计算滚动百分比
      const scrollPercent = scrollTop / docHeight

      // 更新进度
      setProgress(Math.min(100, scrollPercent * 100))

      // 当页面滚动超过 100px 时显示进度条
      setVisible(scrollTop > 100)
    }

    // 添加滚动监听
    window.addEventListener('scroll', updateProgress, {
      passive: true,
    })

    // 初始更新
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  if (!mounted) return null

  // 位置样式
  const positionStyles = {
    top: 'top-0',
    bottom: 'bottom-0',
  }

  return (
    <>
      <motion.div
        className={cn(
          'fixed left-0 z-50 w-full',
          positionStyles[position],
          className,
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ height: `${height}px` }}
      >
        <motion.div
          className="h-full"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      {showPercentage && (
        <motion.div
          className={cn(
            'fixed right-4 z-50 rounded-full bg-white/80 px-2 py-1 text-xs font-medium text-gray-800 backdrop-blur-sm dark:bg-gray-800/80 dark:text-gray-200',
            position === 'top' ? 'top-6' : 'bottom-6',
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(progress)}
          %
        </motion.div>
      )}
    </>
  )
}
