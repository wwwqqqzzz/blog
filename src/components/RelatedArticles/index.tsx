import Link from '@docusaurus/Link'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import { usePluginData } from '@docusaurus/useGlobalData'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import React, { useMemo } from 'react'
import type { BlogPostData } from '@site/src/types/blog'
import { transformBlogItems } from '@site/src/utils/blog'

interface RelatedArticlesProps {
  maxArticles?: number
}

/**
 * 改进的相关文章组件
 * 使用标签匹配、内容相似度和时间相关性进行文章推荐
 */
export default function RelatedArticles({ maxArticles = 3 }: RelatedArticlesProps): React.ReactNode | null {
  // 获取当前文章数据
  const { metadata } = useBlogPost()
  const { tags, title, description, date } = metadata

  // 获取所有博客文章数据
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    blogPosts?: { content: any }[]
  } | undefined

  // 转换为统一格式
  const allPosts: BlogPostData[] = useMemo(() => {
    if (!blogData || !blogData.blogPosts || !Array.isArray(blogData.blogPosts)) {
      return []
    }

    // 过滤掉无效的博客文章
    const validPosts = blogData.blogPosts
      .filter(post => post && post.content)
      .map(post => ({ content: post.content }))

    return transformBlogItems(validPosts)
  }, [blogData?.blogPosts])

  // 寻找相关文章，使用改进的算法
  const relatedArticles = useMemo(() => {
    // 安全检查
    if (!tags || !Array.isArray(tags) || !title || !date) {
      return []
    }

    // 获取当前文章的标签和其他数据
    const currentTags = tags.map(tag => (tag && tag.label ? tag.label.toLowerCase() : ''))
      .filter(label => label !== '') // 过滤掉空标签
    const currentDate = new Date(date)
    const currentTitle = (title || '').toLowerCase()
    const currentDesc = (description || '').toLowerCase()
    const currentKeywords = [...currentTitle.split(' '), ...currentDesc.split(' ')]
      .filter(word => word && word.length > 2) // 忽略太短的词
      .map(word => word.replace(/[,.?!;:'"()\[\]{}]/g, '')) // 移除标点符号

    // 筛选掉当前文章和无效文章
    const otherPosts = allPosts.filter(post => post && post.title && post.title !== title)

    // 计算每篇文章与当前文章的相关性分数
    const postsWithScore = otherPosts.map((post) => {
      let score = 0

      // 1. 标签匹配度 (0-5分)
      const postTags = post.tags && Array.isArray(post.tags)
        ? post.tags
            .filter(tag => tag && tag.label)
            .map(tag => tag.label.toLowerCase())
        : []
      const matchingTags = postTags.filter(tag => currentTags.includes(tag))
      const tagScore = Math.min(5, matchingTags.length * 2)
      score += tagScore

      // 2. 标题相似度 (0-3分)
      const postTitle = (post.title || '').toLowerCase()
      const titleWords = postTitle.split(' ')
        .filter(word => word)
        .map(word => word.replace(/[,.?!;:'"()\[\]{}]/g, ''))
      const matchingTitleWords = titleWords.filter(word =>
        word && word.length > 2 && currentTitle.includes(word),
      )
      const titleScore = Math.min(3, matchingTitleWords.length)
      score += titleScore

      // 3. 内容关键词匹配 (0-3分)
      const postDesc = (post.description || '').toLowerCase()
      const postKeywords = [...postTitle.split(' '), ...postDesc.split(' ')]
        .filter(word => word && word.length > 2)
        .map(word => word.replace(/[,.?!;:'"()\[\]{}]/g, ''))

      const matchingKeywords = postKeywords.filter(word => currentKeywords.includes(word))
      const keywordScore = Math.min(3, matchingKeywords.length * 0.5)
      score += keywordScore

      // 4. 时间接近度 (0-2分)
      let daysDiff = 365 // 默认值
      try {
        const postDate = new Date(post.date || Date.now())
        const timeDiff = Math.abs(postDate.getTime() - currentDate.getTime())
        daysDiff = timeDiff / (1000 * 3600 * 24)
      }
      catch (e) {
        console.error('Error calculating date difference:', e)
      }

      // 发布时间在90天内的文章得分更高
      const timeScore = daysDiff <= 90 ? 2 : daysDiff <= 180 ? 1 : 0
      score += timeScore

      return {
        post,
        score,
        matchData: {
          tagMatches: matchingTags.length,
          titleMatches: matchingTitleWords.length,
          keywordMatches: matchingKeywords.length,
          daysDiff,
        },
      }
    })

    // 按总分排序，并限制数量
    return postsWithScore
      .sort((a, b) => b.score - a.score)
      .slice(0, maxArticles)
      .map(item => item.post)
  }, [tags, title, description, date, allPosts, maxArticles])

  // 如果没有相关文章，返回 null
  if (relatedArticles.length === 0) {
    return null
  }

  return (
    <div className="my-10">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        <Icon icon="ri:links-line" className="mr-2 inline-block" />
        推荐阅读
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedArticles.map((article, index) => (
          <RelatedArticleCard key={article.link} article={article} index={index} />
        ))}
      </div>
    </div>
  )
}

interface RelatedArticleCardProps {
  article: BlogPostData
  index: number
}

function RelatedArticleCard({ article, index }: RelatedArticleCardProps): React.ReactNode {
  // Safety check
  if (!article) {
    return null
  }

  const [isHovered, setIsHovered] = React.useState(false)
  const title = article.title || '无标题'
  const link = article.link || '#'
  const description = article.description || ''
  const date = article.date || ''
  const image = article.image || ''
  const tags = article.tags && Array.isArray(article.tags) ? article.tags : []

  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={link} className="block h-full hover:no-underline">
        <div className="relative h-40 w-full overflow-hidden">
          {image
            ? (
                <>
                  <img
                    src={image}
                    alt={title}
                    className="size-full object-cover transition-transform duration-500 ease-in-out"
                    style={{
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* 标签 */}
                  {tags.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {tags.slice(0, 1).map(tag => tag && tag.label && tag.permalink
                        ? (
                            <span
                              key={tag.permalink}
                              className="rounded-full bg-primary-500/80 px-2.5 py-0.5 text-xs font-medium text-white"
                            >
                              {tag.label}
                            </span>
                          )
                        : null)}
                    </div>
                  )}
                </>
              )
            : (
                <div className="flex size-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <Icon icon="ri:article-line" className="text-4xl text-gray-400 dark:text-gray-500" />
                </div>
              )}
        </div>

        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-base font-medium text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
            {title}
          </h3>

          <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <motion.span
              className="inline-flex items-center text-xs font-medium text-primary-600 dark:text-primary-400"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
            >
              阅读全文
              <Icon icon="ri:arrow-right-s-line" className="ml-1" />
            </motion.span>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              {date}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
