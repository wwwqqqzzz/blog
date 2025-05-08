import React from 'react'
import { useHistory, useLocation } from '@docusaurus/router'
import type { BlogTag } from '@site/src/types/blog'
import { cn } from '@site/src/lib/utils'
import { motion } from 'framer-motion'

interface TagsFilterProps {
  tags: BlogTag[]
}

export default function TagsFilter({ tags }: TagsFilterProps): React.JSX.Element {
  const location = useLocation()
  const history = useHistory()
  const queryParams = new URLSearchParams(location.search)
  const currentTag = queryParams.get('tag') || ''

  // 按照文章数量排序标签
  const sortedTags = [...tags].sort((a, b) => {
    const tagA = a.label.toLowerCase()
    const tagB = b.label.toLowerCase()
    return tagA.localeCompare(tagB)
  })

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(queryParams)
    if (tagName === currentTag) {
      // 如果点击的是当前选中的标签，则清除筛选
      params.delete('tag')
    }
    else {
      // 否则设置为新标签
      params.set('tag', tagName)
    }
    history.push({ search: params.toString() })
  }

  const handleClearFilters = () => {
    const params = new URLSearchParams(queryParams)
    params.delete('tag')
    history.push({ search: params.toString() })
  }

  return (
    <div className="my-6">
      <div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto pb-2">
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-700',
            currentTag === ''
              ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-300'
              : 'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
          )}
          onClick={() => handleClearFilters()}
        >
          全部
        </motion.button>

        {sortedTags.map((tag, index) => (
          <motion.button
            key={tag.permalink}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-700',
              currentTag === tag.label
                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-300'
                : 'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
            )}
            onClick={() => handleTagClick(tag.label)}
          >
            {tag.label}
          </motion.button>
        ))}
      </div>

      {currentTag && (
        <div className="mt-4 flex items-center justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            当前筛选:
            {' '}
            <span className="font-medium text-primary-600 dark:text-primary-400">{currentTag}</span>
            <button
              className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={handleClearFilters}
            >
              清除
            </button>
          </span>
        </div>
      )}
    </div>
  )
}
