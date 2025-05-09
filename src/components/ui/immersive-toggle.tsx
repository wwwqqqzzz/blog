import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'

interface ImmersiveToggleProps {
  className?: string
}

/**
 * 沉浸式阅读模式切换按钮
 * 点击后移除干扰元素，专注内容阅读
 */
export function ImmersiveToggle({ className }: ImmersiveToggleProps): React.ReactElement {
  const [isImmersive, setIsImmersive] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // 切换沉浸式模式
  const toggleImmersive = () => {
    const nextState = !isImmersive
    setIsImmersive(nextState)

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('immersive-mode', nextState)
    }

    // 保存用户偏好
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('immersiveMode', nextState ? 'true' : 'false')
    }
  }

  // 初始化
  useEffect(() => {
    setMounted(true)

    // 从本地存储中恢复状态
    const savedMode = localStorage.getItem('immersiveMode') === 'true'
    setIsImmersive(savedMode)

    if (savedMode && typeof document !== 'undefined') {
      document.documentElement.classList.add('immersive-mode')
    }
  }, [])

  if (!mounted) {
    return <div className={cn('size-10', className)} />
  }

  return (
    <div className="relative flex items-center">
      <motion.button
        type="button"
        className={cn(
          'flex size-12 items-center justify-center rounded-full border-2 border-primary-300 bg-white text-primary-600 shadow-lg transition-all hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 dark:border-primary-700 dark:bg-gray-800 dark:text-primary-400 dark:hover:border-primary-600 dark:hover:bg-gray-700 dark:hover:text-primary-300',
          className,
          isImmersive && 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-gray-700 dark:text-primary-300',
        )}
        onClick={toggleImmersive}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={isImmersive ? '退出沉浸式阅读' : '进入沉浸式阅读'}
        title={isImmersive ? '退出沉浸式阅读' : '进入沉浸式阅读'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative size-7">
          {/* 全屏阅读图标 */}
          <motion.div
            initial={{ opacity: isImmersive ? 0 : 1, scale: isImmersive ? 0.8 : 1 }}
            animate={{
              opacity: isImmersive ? 0 : 1,
              scale: isImmersive ? 0.8 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Icon icon="ph:book-open-duotone" className="size-7" />
          </motion.div>

          {/* 退出全屏图标 */}
          <motion.div
            initial={{ opacity: isImmersive ? 1 : 0, scale: isImmersive ? 1 : 0.8 }}
            animate={{
              opacity: isImmersive ? 1 : 0,
              scale: isImmersive ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Icon icon="ph:book-bookmark-duotone" className="size-7" />
          </motion.div>
        </div>
      </motion.button>

      {/* 提示文本 - 增强版 */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-3 whitespace-nowrap rounded-md bg-primary-500 px-3 py-2 text-sm font-medium text-white shadow-xl dark:bg-primary-600"
          style={{ zIndex: 10001 }}
        >
          {isImmersive ? '退出沉浸式阅读' : '进入沉浸式阅读'}
          <div className="absolute -left-1 top-1/2 size-3 -translate-y-1/2 rotate-45 bg-primary-500 dark:bg-primary-600"></div>
        </motion.div>
      )}
    </div>
  )
}
