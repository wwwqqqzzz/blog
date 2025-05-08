import React, { useState, useEffect } from 'react'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'

export default function ReadingProgress(): React.ReactElement | null {
  const [progress, setProgress] = useState(0)
  const { isBlogPostPage } = useBlogPost()

  // 仅在博客文章页面显示阅读进度条
  if (!isBlogPostPage) {
    return null
  }

  useEffect(() => {
    const updateProgress = () => {
      // 获取文档高度
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      // 计算当前滚动进度
      const currentProgress = (window.scrollY / totalHeight) * 100
      setProgress(Math.min(100, Math.max(0, currentProgress)))
    }

    // 添加滚动事件监听
    window.addEventListener('scroll', updateProgress)

    // 初始化进度
    updateProgress()

    // 清理事件监听
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full">
      <div
        className="h-full bg-primary-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
