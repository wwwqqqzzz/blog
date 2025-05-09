import React, { useEffect, useState } from 'react'
import { ThemeToggle, ImmersiveToggle, ReadingPreferences, ReadingProgressBar } from '@site/src/components/ui'
import PageTransition from '@site/src/components/PageTransition'
import { useLocation } from '@docusaurus/router'

// Root组件：用于在应用程序外层添加全局功能
export default function Root({ children }): React.ReactElement {
  const location = useLocation()
  const [showImmersiveButton, setShowImmersiveButton] = useState(false)

  // 检查当前页面是否为博客或文档页面
  useEffect(() => {
    const path = location.pathname
    // 扩大匹配范围，包括更多可能的阅读页面
    const isBlogOrDocPage
      = path.includes('/blog')
        || path.includes('/docs')
        || path.includes('/project')
        || path.includes('/about')
        || path.includes('/friends')
        || path.includes('/archive')

    setShowImmersiveButton(isBlogOrDocPage)

    // 调试信息，帮助排查按钮不显示的问题
    if (typeof window !== 'undefined' && window.localStorage.getItem('debug') === 'true') {
      console.log('当前路径:', path)
      console.log('显示沉浸式阅读按钮:', isBlogOrDocPage)
    }
  }, [location])

  // 添加主题切换动画类
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-transition')

      // 处理主题变化时的过渡动画
      const handleTransitionEnd = () => {
        document.documentElement.classList.remove('theme-transition-active')
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            document.documentElement.classList.add('theme-transition-active')
          }
        })
      })

      observer.observe(document.documentElement, { attributes: true })
      document.documentElement.addEventListener('transitionend', handleTransitionEnd)

      return () => {
        observer.disconnect()
        document.documentElement.removeEventListener('transitionend', handleTransitionEnd)
      }
    }
  }, [])

  return (
    <>
      {/* 全局阅读进度条 */}
      <ReadingProgressBar showPercentage position="top" height={3} />

      {/* 功能按钮组 - 包含主题切换、阅读偏好和沉浸式阅读按钮 */}
      <div
        id="feature-buttons-group"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 rounded-lg bg-white/80 p-3 shadow-xl backdrop-blur-md dark:bg-gray-800/80"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {showImmersiveButton && (
          <div id="immersive-toggle-container">
            <ImmersiveToggle />
          </div>
        )}
        <ReadingPreferences />
        <ThemeToggle />
      </div>

      {/* 页面过渡动画 */}
      <PageTransition type="fade">
        {children}
      </PageTransition>
    </>
  )
}
