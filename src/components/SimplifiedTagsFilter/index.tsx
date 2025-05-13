import React, { useState } from 'react'
import { useHistory, useLocation } from '@docusaurus/router'
import type { BlogTag } from '@site/src/types/blog'
import { cn } from '@site/src/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import Link from '@docusaurus/Link'

interface SimplifiedTagsFilterProps {
  tags: BlogTag[]
  maxTags?: number
}

/**
 * 增强版标签筛选器
 * 显示热门标签，并提供展开/收起功能
 */
export default function SimplifiedTagsFilter({ tags, maxTags = 8 }: SimplifiedTagsFilterProps): React.JSX.Element {
  const location = useLocation()
  const history = useHistory()
  const queryParams = new URLSearchParams(location.search)
  const currentTag = queryParams.get('tag') || ''
  const [showAllTags, setShowAllTags] = useState(false)

  // 按照文章数量排序标签
  const sortedTags = [...tags].sort((a, b) => b.count - a.count)

  // 热门标签和所有标签
  const popularTags = sortedTags.slice(0, maxTags)
  const allTags = sortedTags

  // 当前显示的标签
  const displayedTags = showAllTags ? allTags : popularTags

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

  const toggleShowAllTags = () => {
    setShowAllTags(prev => !prev)
  }

  return (
    <div className="my-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-bold text-gray-900 dark:text-gray-100">
          <Icon icon="ri:price-tag-3-line" className="mr-2 text-primary-500" />
          标签筛选
        </h3>

        {currentTag && (
          <button
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={handleClearFilters}
          >
            <Icon icon="ri:close-circle-line" className="mr-1" />
            清除筛选
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
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
          全部文章
        </motion.button>

        <AnimatePresence>
          {displayedTags.map((tag, index) => (
            <motion.button
              key={tag.permalink}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-700',
                currentTag === tag.label
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-300'
                  : 'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
              )}
              onClick={() => handleTagClick(tag.label)}
            >
              {tag.label}
              <span className="ml-1 text-xs text-gray-500">
                {`(${tag.count})`}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* 展开/收起按钮 */}
      {tags.length > maxTags && (
        <button
          onClick={toggleShowAllTags}
          className="mt-3 flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <Icon
            icon={showAllTags ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'}
            className="mr-1"
          />
          {showAllTags ? '收起标签' : `显示全部 ${tags.length} 个标签`}
        </button>
      )}

      {currentTag && (
        <div className="mt-4 rounded-lg bg-primary-50 p-3 dark:bg-primary-900/30">
          <div className="flex items-center">
            <Icon icon="ri:filter-line" className="mr-2 text-primary-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              当前筛选:
              {' '}
              <span className="font-medium text-primary-600 dark:text-primary-400">{currentTag}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
