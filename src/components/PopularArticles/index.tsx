import React, { useEffect, useState } from 'react'
import { usePluginData } from '@docusaurus/useGlobalData'
import Link from '@docusaurus/Link'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import type { BlogPostData } from '@site/src/types/blog'
import { transformBlogItems } from '@site/src/utils/blog'
import { getArticleViewData } from '@site/src/utils/article-view-tracker'

interface PopularArticlesProps {
  /**
   * 显示的文章数量
   * @default 4
   */
  maxArticles?: number
  /**
   * 标题文本
   * @default "热门文章"
   */
  title?: string
  /**
   * 是否使用紧凑模式显示
   * @default false
   */
  compact?: boolean
}

/**
 * 热门文章组件
 * 显示最近访问最频繁或阅读量最高的文章
 */
export default function PopularArticles({
  maxArticles = 4,
  title = '热门文章',
  compact = false,
}: PopularArticlesProps): React.ReactNode {
  // 获取所有博客文章数据
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    blogPosts?: { content: any }[]
  } | undefined

  // 转换为统一格式
  const allPosts: BlogPostData[] = React.useMemo(() => {
    if (!blogData?.blogPosts || !Array.isArray(blogData.blogPosts)) {
      return []
    }
    return transformBlogItems(blogData.blogPosts.map(post => ({ content: post.content })))
  }, [blogData?.blogPosts])

  // 热门文章状态
  const [popularArticles, setPopularArticles] = useState<BlogPostData[]>([])

  // 计算热门文章
  useEffect(() => {
    // 获取文章阅读数据
    const viewData = getArticleViewData()

    // 对文章进行排序
    const articlesWithScore = allPosts.map((post) => {
      // 默认热度分数
      let popularityScore = 0

      // 1. 基于阅读次数 (0-5分)
      const viewCount = viewData[post.link] || 0
      const viewScore = Math.min(5, Math.floor(viewCount / 2))
      popularityScore += viewScore

      // 2. 基于文章是否为特色文章 (3分)
      if (post.featured) {
        popularityScore += 3
      }

      // 3. 基于文章发布时间的新鲜度 (0-3分)
      const publicationDate = new Date(post.date).getTime()
      const now = new Date().getTime()
      const daysSincePublication = Math.floor((now - publicationDate) / (1000 * 60 * 60 * 24))

      // 30天内发布的文章得到额外分数
      let recencyScore = 0
      if (daysSincePublication <= 7) {
        recencyScore = 3 // 一周内
      }
      else if (daysSincePublication <= 14) {
        recencyScore = 2 // 两周内
      }
      else if (daysSincePublication <= 30) {
        recencyScore = 1 // 一个月内
      }
      popularityScore += recencyScore

      return {
        post,
        score: popularityScore,
        views: viewCount,
      }
    })

    // 按热度分数排序并限制数量
    const popular = articlesWithScore
      .sort((a, b) => b.score - a.score)
      .slice(0, maxArticles)
      .map(item => item.post)

    setPopularArticles(popular)
  }, [allPosts, maxArticles])

  // 如果没有文章，返回null
  if (popularArticles.length === 0) {
    return null
  }

  return (
    <div className="my-8">
      <h3 className="mb-4 flex items-center text-xl font-bold text-gray-900 dark:text-gray-100">
        <Icon icon="ri:fire-line" className="mr-2 text-primary-500" />
        {title}
      </h3>

      <div className={compact ? 'space-y-3' : 'grid gap-4 sm:grid-cols-2'}>
        {popularArticles.map((article, index) => (
          compact
            ? (
                <CompactArticleCard key={article.link} article={article} index={index} />
              )
            : (
                <PopularArticleCard key={article.link} article={article} index={index} />
              )
        ))}
      </div>
    </div>
  )
}

// 紧凑型文章卡片（适用于侧边栏）
function CompactArticleCard({ article, index }: { article: BlogPostData, index: number }): React.ReactNode {
  return (
    <motion.div
      className="group flex items-start gap-3"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {article.image
        ? (
            <img
              src={article.image}
              alt={article.title}
              className="size-16 rounded-md object-cover"
            />
          )
        : (
            <div className="flex size-16 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
              <Icon icon="ri:article-line" className="text-xl text-gray-400" />
            </div>
          )}

      <div className="flex-1">
        <Link
          href={article.link}
          className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
        >
          {article.title}
        </Link>

        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{article.date}</span>
          {article.tags && article.tags.length > 0 && (
            <>
              <span>•</span>
              <span>{article.tags[0].label}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// 标准热门文章卡片
function PopularArticleCard({ article, index }: { article: BlogPostData, index: number }): React.ReactNode {
  return (
    <motion.div
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={article.link} className="block hover:no-underline">
        <div className="relative h-36 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          {article.image
            ? (
                <>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </>
              )
            : (
                <div className="flex size-full items-center justify-center">
                  <Icon icon="ri:article-line" className="text-3xl text-gray-400" />
                </div>
              )}

          {/* 热门标签 */}
          <div className="absolute right-2 top-2 rounded-full bg-primary-500 px-2 py-0.5 text-xs font-medium text-white">
            热门
          </div>
        </div>

        <div className="p-3">
          <h4 className="line-clamp-2 text-base font-medium text-gray-900 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
            {article.title}
          </h4>

          <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{article.date}</span>

            {article.tags && article.tags.length > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                {article.tags[0].label}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
