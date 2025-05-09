import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'

interface ReadingPreferencesProps {
  /**
   * 自定义类名
   */
  className?: string
}

// 字体大小选项
const fontSizeOptions = [
  { label: '小', value: 'small', className: 'text-xs' },
  { label: '中', value: 'medium', className: 'text-sm' },
  { label: '大', value: 'large', className: 'text-base' },
]

export function ReadingPreferences({ className }: ReadingPreferencesProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [mounted, setMounted] = useState(false)

  // 应用字体大小设置
  const applyFontSize = (size: string) => {
    setFontSize(size)

    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large')
      document.documentElement.classList.add(`font-size-${size}`)
    }

    // 保存用户偏好
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('fontSize', size)
    }
  }

  // 初始化
  useEffect(() => {
    setMounted(true)

    // 从本地存储中恢复设置
    if (typeof localStorage !== 'undefined' && typeof document !== 'undefined') {
      const savedFontSize = localStorage.getItem('fontSize') || 'medium'
      setFontSize(savedFontSize)

      document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large')
      document.documentElement.classList.add(`font-size-${savedFontSize}`)
    }

    // 点击外部关闭设置面板
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && event.target instanceof Element) {
        const panel = document.querySelector('.reading-preferences-panel')
        if (panel && !panel.contains(event.target)) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  if (!mounted) {
    return <div className={cn('size-10', className)} />
  }

  return (
    <div className="relative">
      {/* 切换按钮 */}
      <motion.button
        type="button"
        className={cn(
          'flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-md transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-primary-800 dark:hover:bg-gray-700 dark:hover:text-primary-400',
          className,
          isOpen && 'border-primary-200 bg-primary-50 text-primary-600 dark:border-primary-800 dark:bg-gray-700 dark:text-primary-400',
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="阅读偏好设置"
        title="阅读偏好设置"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon icon="ph:text-aa-duotone" className="size-5" />
      </motion.button>

      {/* 弹出设置面板 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="reading-preferences-panel absolute bottom-full right-0 mb-3 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/30"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">阅读设置</h3>
            <motion.button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="关闭设置面板"
              whileHover={{ scale: 1.1 }}
            >
              <Icon icon="ri:close-line" className="size-5" />
            </motion.button>
          </div>

          {/* 字体大小设置 */}
          <div>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">字体大小</p>
            <div className="flex gap-2">
              {fontSizeOptions.map(option => (
                <motion.button
                  key={option.value}
                  className={cn(
                    'flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-center',
                    option.className,
                    fontSize === option.value
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
                  )}
                  onClick={() => applyFontSize(option.value)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
