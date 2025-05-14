import React from 'react'
import Link from '@docusaurus/Link'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import type { BlogPostData } from '@site/src/types/blog'

interface CollectionNavigationProps {
  /**
   * 当前文章
   */
  currentPost: BlogPostData
  /**
   * 系列中的所有文章
   */
  collectionPosts: BlogPostData[]
  /**
   * 系列名称
   */
  collectionName: string
  /**
   * 系列描述
   */
  collectionDescription?: string
  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 博客系列导航组件
 * 显示系列信息和上一篇/下一篇导航
 */
export default function CollectionNavigation({
  currentPost,
  collectionPosts,
  collectionName,
  collectionDescription,
  className,
}: CollectionNavigationProps): React.ReactNode {
  // 查找当前文章在系列中的索引
  const currentIndex = collectionPosts.findIndex(post => post.link === currentPost.link)
  
  // 如果找不到当前文章或系列中只有一篇文章，不显示导航
  if (currentIndex === -1 || collectionPosts.length <= 1) {
    return null
  }
  
  // 获取上一篇和下一篇文章
  const prevPost = currentIndex > 0 ? collectionPosts[currentIndex - 1] : null
  const nextPost = currentIndex < collectionPosts.length - 1 ? collectionPosts[currentIndex + 1] : null
  
  // 计算当前进度
  const progress = Math.round(((currentIndex + 1) / collectionPosts.length) * 100)
  
  return (
    <div className={cn('my-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800', className)}>
      {/* 系列标题和描述 */}
      <div className="mb-4">
        <Link
          to={`/blog/collections/${encodeURIComponent(collectionName.toLowerCase().replace(/\s+/g, '-'))}`}
          className="mb-1 flex items-center text-lg font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <Icon icon="ri:book-2-line" className="mr-2" />
          {collectionName}
          <Icon icon="ri:arrow-right-s-line" className="ml-1" />
        </Link>
        {collectionDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{collectionDescription}</p>
        )}
      </div>
      
      {/* 进度条 */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            第 {currentIndex + 1} 篇，共 {collectionPosts.length} 篇
          </span>
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
            {progress}% 完成
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-primary-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* 导航链接 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prevPost && (
          <Link
            to={prevPost.link}
            className="flex items-center rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-primary-200 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary-900 dark:hover:bg-primary-900/30"
          >
            <Icon icon="ri:arrow-left-s-line" className="mr-2 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">上一篇</div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{prevPost.title}</div>
            </div>
          </Link>
        )}
        
        {nextPost && (
          <Link
            to={nextPost.link}
            className="flex items-center justify-end rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-primary-200 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary-900 dark:hover:bg-primary-900/30"
          >
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">下一篇</div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{nextPost.title}</div>
            </div>
            <Icon icon="ri:arrow-right-s-line" className="ml-2 text-gray-500 dark:text-gray-400" />
          </Link>
        )}
      </div>
      
      {/* 系列文章列表 */}
      <div className="mt-4">
        <details className="group">
          <summary className="flex cursor-pointer items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
            <Icon icon="ri:list-ordered" className="mr-2" />
            查看系列中的所有文章
            <Icon
              icon="ri:arrow-down-s-line"
              className="ml-1 transition-transform group-open:rotate-180"
            />
          </summary>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 space-y-1 pl-6"
          >
            {collectionPosts.map((post, index) => (
              <Link
                key={post.link}
                to={post.link}
                className={cn(
                  'flex items-center py-1 text-sm hover:text-primary-600 dark:hover:text-primary-400',
                  post.link === currentPost.link
                    ? 'font-medium text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400',
                )}
              >
                <span className="mr-2 inline-block w-5 text-right">{index + 1}.</span>
                {post.title}
              </Link>
            ))}
          </motion.div>
        </details>
      </div>
    </div>
  )
}
