import Link from '@docusaurus/Link'
import { motion } from 'framer-motion'
import React from 'react'
import type { BlogPostData } from '@site/src/types/blog'
import { cn } from '@site/src/lib/utils'
import Tag from '@site/src/theme/Tag'
import { Icon } from '@iconify/react'

interface PinnedArticlesProps {
  items: BlogPostData[]
  /**
   * 当前选中的标签（如果有）
   */
  currentTag?: string
  /**
   * 当前搜索查询（如果有）
   */
  searchQuery?: string
}

/**
 * 置顶文章组件
 * 在博客列表页面顶部显示置顶文章
 */
export default function PinnedArticles({
  items,
  currentTag = '',
  searchQuery = '',
}: PinnedArticlesProps): React.ReactNode | null {
  // 筛选出标记为pinned的文章
  const pinnedItems = items.filter(item => item.pinned)

  // 如果没有置顶文章，不显示此组件
  if (pinnedItems.length === 0) {
    return null
  }

  // 如果有搜索或标签筛选，显示提示信息
  const hasFilters = currentTag || searchQuery

  return (
    <section className="mb-10 mt-6">
      <h3 className="mb-6 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-gray-200">
        <Icon icon="ri:pushpin-fill" className="mr-2 text-primary-500" />
        置顶文章
      </h3>

      {hasFilters
        ? (
            <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentTag && (
                  <>
                    <span className="font-medium text-primary-600 dark:text-primary-400">置顶文章</span>
                    {' '}
                    始终显示，不受标签筛选影响。
                    {searchQuery && ' 同时，'}
                  </>
                )}
                {searchQuery && (
                  <>
                    <span className="font-medium text-primary-600 dark:text-primary-400">置顶文章</span>
                    {' '}
                    始终显示，不受搜索查询影响。
                  </>
                )}
              </p>
            </div>
          )
        : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {pinnedItems.map((item, index) => (
          <PinnedArticleCard key={item.link} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}

interface PinnedArticleCardProps {
  item: BlogPostData
  index: number
}

function PinnedArticleCard({ item, index }: PinnedArticleCardProps): React.ReactNode {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={item.link} className="flex h-full flex-col hover:no-underline">
        {item.image && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className={cn(
                'h-full w-full object-cover transition-transform duration-700',
                isHovered && 'scale-105',
              )}
            />
            <div className="absolute right-2 top-2 flex items-center rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white">
              <Icon icon="ri:pushpin-fill" className="mr-1" />
              置顶
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
            {item.title}
          </h3>
          <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-500 dark:text-gray-400">
            {item.description}
          </p>
          <div className="mt-auto flex items-center justify-between">
            {item.tags && item.tags.length > 0
              ? (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 2).map(tag => (
                      <Tag
                        key={tag.permalink}
                        label={tag.label}
                        permalink={tag.permalink}
                        description={tag.description || ''}
                        className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-300 dark:hover:bg-gray-600"
                      />
                    ))}
                  </div>
                )
              : (
                  <div />
                )}
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.date}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
