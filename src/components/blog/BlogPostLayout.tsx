import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'

interface BlogPostLayoutProps {
  /**
   * 文章标题
   */
  title: string
  /**
   * 文章元信息（日期、阅读时间等）
   */
  meta?: React.ReactNode
  /**
   * 封面图片URL
   */
  coverImage?: string
  /**
   * 目录
   */
  tableOfContents?: React.ReactNode
  /**
   * 是否在移动设备上隐藏目录
   * @default true
   */
  hideTocOnMobile?: boolean
  /**
   * 文章主体内容
   */
  children: React.ReactNode
  /**
   * 文章底部内容（相关文章、评论等）
   */
  footer?: React.ReactNode
  /**
   * 是否启用沉浸式阅读模式
   * @default false
   */
  enableImmersiveMode?: boolean
  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 博客文章布局组件 - 提供响应式设计和最佳阅读体验
 */
export default function BlogPostLayout({
  title,
  meta,
  coverImage,
  tableOfContents,
  hideTocOnMobile = true,
  children,
  footer,
  enableImmersiveMode = false,
  className,
}: BlogPostLayoutProps): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false)
  const [isTocOpen, setIsTocOpen] = useState(false)
  const [immersiveMode, setImmersiveMode] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // 检测屏幕宽度变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 996)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 监听滚动事件，计算阅读进度
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

  // 切换沉浸式阅读模式
  const toggleImmersiveMode = () => {
    setImmersiveMode(!immersiveMode)
  }

  // 切换目录显示
  const toggleToc = () => {
    setIsTocOpen(!isTocOpen)
  }

  return (
    <div className={cn('relative', className)}>
      {/* 阅读进度条 */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-primary-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={scrollProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* 工具栏 - 使用较低的z-index，避免与全局功能按钮冲突 */}
      {enableImmersiveMode && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2">
          <motion.button
            className="flex size-10 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg"
            onClick={toggleImmersiveMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={immersiveMode ? '退出沉浸式模式' : '进入沉浸式模式'}
          >
            <Icon icon={immersiveMode ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-line'} className="text-xl" />
          </motion.button>

          {isMobile && tableOfContents && (
            <motion.button
              className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-lg dark:bg-gray-800 dark:text-gray-300"
              onClick={toggleToc}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isTocOpen ? '关闭目录' : '打开目录'}
            >
              <Icon icon="ri:list-unordered" className="text-xl" />
            </motion.button>
          )}
        </div>
      )}

      {/* 封面图片 */}
      {coverImage && (
        <div className="relative mb-8 h-72 w-full overflow-hidden rounded-xl sm:h-96 md:h-[400px]">
          <img
            src={coverImage}
            alt={title}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h1>
            {meta && (
              <div className="mt-2 text-sm text-white/90">{meta}</div>
            )}
          </div>
        </div>
      )}

      <div className={cn(
        'mx-auto max-w-none px-4 transition-all duration-300 md:px-8',
        immersiveMode
          ? 'max-w-4xl' // 沉浸式模式下更窄的内容宽度
          : 'max-w-7xl',
      )}
      >
        {/* 标题区（无封面图片时显示） */}
        {!coverImage && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h1>
            {meta && (
              <div className="mt-2 text-gray-600 dark:text-gray-400">{meta}</div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* 正文内容 */}
          <div className={cn(
            'prose prose-lg mx-auto w-full max-w-none dark:prose-invert lg:col-span-8',
            immersiveMode && 'lg:col-span-12',
          )}
          >
            {children}
          </div>

          {/* 侧边栏（目录） */}
          {tableOfContents && !immersiveMode && (
            <aside className={cn(
              'sticky top-20 h-fit lg:col-span-4',
              hideTocOnMobile && 'hidden lg:block',
            )}
            >
              {tableOfContents}
            </aside>
          )}

          {/* 移动端目录弹出层 */}
          {isMobile && tableOfContents && (
            <motion.div
              className={cn(
                'fixed bottom-0 left-0 right-0 top-0 z-40 bg-white p-4 dark:bg-gray-900',
                !isTocOpen && 'hidden',
              )}
              initial={{ x: '100%' }}
              animate={{ x: isTocOpen ? 0 : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-lg font-medium">目录</h2>
                <button
                  onClick={toggleToc}
                  className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="关闭目录"
                >
                  <Icon icon="ri:close-line" className="text-xl" />
                </button>
              </div>
              {tableOfContents}
            </motion.div>
          )}
        </div>

        {/* 文章底部区域 */}
        {footer && (
          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
