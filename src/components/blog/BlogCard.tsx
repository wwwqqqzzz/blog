import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from '@docusaurus/Link'
import { Icon } from '@iconify/react'
import Image from '@theme/IdealImage'
import { Card } from '@site/src/components/ui'
import { BlogPostData } from '@site/src/types/blog'

export interface BlogCardProps {
  /**
   * 博客文章数据
   */
  post: BlogPostData
  /**
   * 卡片尺寸
   * @default "default"
   */
  size?: 'default' | 'small' | 'large'
  /**
   * 是否为特色卡片（有更显眼的样式）
   * @default false
   */
  featured?: boolean
  /**
   * 展示模式
   * @default "card"
   */
  mode?: 'card' | 'horizontal' | 'minimal'
  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 博客卡片组件 - 支持多种尺寸和展示模式的响应式卡片
 */
export function BlogCard({
  post,
  size = 'default',
  featured = false,
  mode = 'card',
  className,
}: BlogCardProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false)
  const { title, link, date, tags, description, image, pinned } = post

  // 处理日期格式
  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    year: featured ? 'numeric' : undefined,
    month: 'short',
    day: 'numeric',
  })

  // 根据模式设置图片高度
  const imageHeight = {
    card: {
      small: 'h-32',
      default: 'h-40',
      large: 'h-48',
    },
    horizontal: {
      small: 'h-24',
      default: 'h-32',
      large: 'h-40',
    },
    minimal: {
      small: 'h-0',
      default: 'h-0',
      large: 'h-0',
    },
  }

  // 水平模式的布局
  if (mode === 'horizontal') {
    return (
      <motion.div
        className={`relative flex h-full overflow-hidden rounded-lg bg-card shadow-sm ${className || ''}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        {/* 文章图片 */}
        {image && (
          <div className={`relative overflow-hidden ${imageHeight.horizontal[size]} w-1/3`}>
            <Image
              src={image}
              alt={title}
              img=""
              className="size-full object-cover transition-transform duration-300 ease-in-out"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          </div>
        )}

        {/* 文章内容 */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            {pinned && (
              <div className="mb-2 flex items-center">
                <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  <Icon icon="ri:pushpin-fill" className="mr-1 text-xs" />
                  置顶
                </span>
              </div>
            )}
            <h4 className="mb-2 line-clamp-1 text-base font-medium">
              <Link href={link} className="text-card-foreground transition-colors hover:text-primary hover:no-underline">
                {title}
              </Link>
            </h4>

            {size !== 'small' && (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {description}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {tags?.slice(0, size === 'small' ? 1 : 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  {typeof tag === 'string' ? tag : (tag as any).label}
                </span>
              ))}
            </div>

            <span className="text-muted-foreground text-xs">
              {formattedDate}
            </span>
          </div>
        </div>
      </motion.div>
    )
  }

  // 极简模式
  if (mode === 'minimal') {
    return (
      <motion.div
        className={`relative h-full rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className || ''}`}
        whileHover={{ x: 3, transition: { duration: 0.2 } }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {pinned && (
              <span className="mr-2 inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                <Icon icon="ri:pushpin-fill" className="mr-1 text-xs" />
                置顶
              </span>
            )}
            <h4 className="line-clamp-1 text-base font-medium">
              <Link href={link} className="text-card-foreground transition-colors hover:text-primary hover:no-underline">
                {title}
              </Link>
            </h4>
          </div>
          <span className="text-muted-foreground ml-4 shrink-0 text-xs">
            {formattedDate}
          </span>
        </div>

        {size !== 'small' && (
          <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
            {description}
          </p>
        )}
      </motion.div>
    )
  }

  // 卡片模式（默认）
  return (
    <motion.div
      className={`h-full overflow-hidden rounded-lg bg-card shadow-sm ${className || ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* 博客图片 */}
      {image && (
        <div className={`relative w-full overflow-hidden ${imageHeight.card[size]}`}>
          <Image
            src={image}
            alt={title}
            img=""
            className="size-full object-cover transition-transform duration-300 ease-in-out"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* 标签 */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            {tags?.slice(0, featured ? 2 : 1).map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full bg-primary/80 px-2.5 py-0.5 text-xs font-medium text-white"
              >
                {typeof tag === 'string' ? tag : (tag as any).label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 文章内容 */}
      <div className="p-4">
        {pinned && (
          <div className="mb-2 flex items-center">
            <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              <Icon icon="ri:pushpin-fill" className="mr-1 text-xs" />
              置顶
            </span>
          </div>
        )}
        <h4 className={`mb-2 line-clamp-2 ${featured ? 'text-xl font-bold' : 'text-base font-medium'}`}>
          <Link href={link} className="text-card-foreground transition-colors hover:text-primary hover:no-underline">
            {title}
          </Link>
        </h4>

        <p className="text-muted-foreground line-clamp-2 text-sm">
          {description}
        </p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 flex items-center justify-between"
        >
          <Link
            href={link}
            className="inline-flex items-center text-xs font-medium text-primary hover:underline"
          >
            阅读全文
            {featured && <Icon icon="ri:arrow-right-s-line" className="ml-1" />}
          </Link>

          <span className="text-muted-foreground text-xs">
            {formattedDate}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 特色博客卡片（大尺寸、突出显示的版本）
export function FeaturedBlogCard({
  post,
  className,
}: {
  post: BlogPostData
  className?: string
}): React.ReactElement {
  return (
    <BlogCard
      post={post}
      size="large"
      featured={true}
      className={className}
    />
  )
}

export default BlogCard
