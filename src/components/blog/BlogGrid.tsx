import React from 'react'
import { motion } from 'framer-motion'
import BlogCard, { FeaturedBlogCard } from './BlogCard'
import { BlogPostData } from '@site/src/types/blog'
import { Icon } from '@iconify/react'

export interface BlogGridProps {
  /**
   * 博客文章数据数组
   */
  posts: BlogPostData[]
  /**
   * 网格布局的列数
   * @default "auto"
   */
  columns?: 'auto' | 1 | 2 | 3 | 4
  /**
   * 是否突出显示第一篇文章
   * @default false
   */
  featuredFirst?: boolean
  /**
   * 文章显示模式
   * @default "card"
   */
  mode?: 'card' | 'horizontal' | 'minimal' | 'mixed'
  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 博客文章网格组件 - 支持响应式布局和多种显示模式
 */
export default function BlogGrid({
  posts,
  columns = 'auto',
  featuredFirst = false,
  mode = 'card',
  className,
}: BlogGridProps): React.ReactElement {
  // 如果没有文章，显示空状态
  if (!posts || posts.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <Icon icon="ri:emotion-sad-line" className="mb-4 text-4xl text-gray-400" />
        <p className="text-gray-500">暂无相关文章</p>
      </div>
    )
  }

  // 确定网格列数的CSS类
  const getColumnsClass = () => {
    if (columns === 'auto') {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }

    const colMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    }

    return colMap[columns]
  }

  // 根据不同模式设置网格间距
  const gapClass = mode === 'minimal' ? 'gap-1' : 'gap-5'

  // 分离第一篇文章和其余文章
  const featuredPost = featuredFirst ? posts[0] : null
  const regularPosts = featuredFirst ? posts.slice(1) : posts

  return (
    <div className={className}>
      {/* 特色文章区域 */}
      {featuredFirst && featuredPost && (
        <div className="mb-8">
          <FeaturedBlogCard post={featuredPost} />
        </div>
      )}

      {/* 常规文章网格 */}
      <div className={`grid ${getColumnsClass()} ${gapClass}`}>
        {regularPosts.map((post, index) => {
          // 混合模式：根据位置使用不同的展示模式
          const cardMode = mode === 'mixed'
            ? index % 5 === 0
              ? 'horizontal' // 每5篇文章使用1篇水平卡片
              : index % 7 === 3
                ? 'minimal' // 每7篇文章中的第4篇使用极简模式
                : 'card' // 其余使用默认卡片模式
            : mode

          const cardSize = mode === 'mixed'
            ? index % 4 === 0
              ? 'large' // 每4篇中的第1篇用大尺寸
              : index % 3 === 1
                ? 'small' // 每3篇中的第2篇用小尺寸
                : 'default' // 其余用默认尺寸
            : 'default'

          return (
            <motion.div
              key={post.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <BlogCard
                post={post}
                mode={cardMode}
                size={cardSize}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
