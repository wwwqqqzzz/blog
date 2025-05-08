import Link from '@docusaurus/Link'
import { motion } from 'framer-motion'
import React from 'react'
import type { BlogPostData } from '@site/src/types/blog'
import { cn } from '@site/src/lib/utils'
import Tag from '@site/src/theme/Tag'

interface FeaturedArticlesProps {
  items: BlogPostData[]
}

export default function FeaturedArticles({ items }: FeaturedArticlesProps): React.ReactNode | null {
  // 筛选出标记为featured的文章
  const featuredItems = items.filter(item => item.featured)

  if (featuredItems.length === 0) {
    return null
  }

  return (
    <section className="mb-10 mt-6">
      <h3 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
        精选文章
      </h3>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {featuredItems.slice(0, 2).map((item, index) => (
          <FeaturedArticleCard key={item.link} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}

interface FeaturedArticleCardProps {
  item: BlogPostData
  index: number
}

function FeaturedArticleCard({ item, index }: FeaturedArticleCardProps): React.ReactNode {
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
            <div className="absolute right-2 top-2 rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white">精选</div>
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
