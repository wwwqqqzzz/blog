import React, { useEffect } from 'react'
import { ReadingProgressBar } from '@site/src/components/ui'
import PageTransition from '@site/src/components/PageTransition'
import { useLocation } from '@docusaurus/router'

// Root组件：用于在应用程序外层添加全局功能
export default function Root({ children }): React.ReactElement {
  const location = useLocation()

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

      {/* 页面过渡动画 */}
      <PageTransition type="fade">
        {children}
      </PageTransition>
    </>
  )
}
