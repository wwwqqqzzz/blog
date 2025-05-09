import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

interface ThemeToggleProps {
  className?: string
}

/**
 * 主题切换按钮组件
 * 带有平滑过渡动画效果
 */
export function ThemeToggle({ className }: ThemeToggleProps): React.ReactElement {
  const {
    siteConfig: { themeConfig },
  } = useDocusaurusContext()
  const [theme, setTheme] = useState<string>()
  const [mounted, setMounted] = useState(false)

  // 切换主题
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', nextTheme)
    document.documentElement.style.colorScheme = nextTheme
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }

  // 在客户端渲染时初始化
  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return
    }

    setMounted(true)
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light'
    setTheme(initialTheme)
  }, [])

  // 避免服务端渲染不匹配
  if (!mounted) {
    return <div className={cn('size-10', className)} />
  }

  return (
    <motion.button
      type="button"
      className={cn(
        'flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-md transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-primary-800 dark:hover:bg-gray-700 dark:hover:text-primary-400',
        className,
      )}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative size-5">
        {/* 太阳图标 */}
        <motion.div
          initial={{ opacity: theme === 'dark' ? 0 : 1, rotate: theme === 'dark' ? -45 : 0 }}
          animate={{
            opacity: theme === 'dark' ? 0 : 1,
            rotate: theme === 'dark' ? -45 : 0,
            scale: theme === 'dark' ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon icon="ph:sun-duotone" className="size-5" />
        </motion.div>

        {/* 月亮图标 */}
        <motion.div
          initial={{ opacity: theme === 'dark' ? 1 : 0, rotate: theme === 'dark' ? 0 : 45 }}
          animate={{
            opacity: theme === 'dark' ? 1 : 0,
            rotate: theme === 'dark' ? 0 : 45,
            scale: theme === 'dark' ? 1 : 0.5,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon icon="ph:moon-stars-duotone" className="size-5" />
        </motion.div>
      </div>
    </motion.button>
  )
}
