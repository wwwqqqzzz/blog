import React from 'react'
import { useHistory, useLocation } from '@docusaurus/router'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { cn } from '@site/src/lib/utils'

type SortOption = {
  value: string
  label: string
  icon: string
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: '最新发布', icon: 'ri:time-line' },
  { value: 'oldest', label: '最早发布', icon: 'ri:history-line' },
  { value: 'popular', label: '热门文章', icon: 'ri:fire-line' },
  { value: 'az', label: '标题 A-Z', icon: 'ri:sort-asc' },
  { value: 'za', label: '标题 Z-A', icon: 'ri:sort-desc' },
]

interface BlogSortControlsProps {
  /**
   * 当前文章总数
   */
  totalCount: number
  /**
   * 当前选中的标签
   */
  currentTag?: string
  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 博客排序控制组件
 * 包含排序选项和标签过滤控制
 */
export default function BlogSortControls({
  totalCount,
  currentTag,
  className,
}: BlogSortControlsProps): React.ReactNode {
  const location = useLocation()
  const history = useHistory()
  const queryParams = new URLSearchParams(location.search)
  const currentSort = queryParams.get('sort') || 'newest'

  // 是否有任何活跃的过滤器
  const hasActiveFilters = !!currentTag

  // 处理排序变化
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value
    const params = new URLSearchParams(queryParams)
    params.set('sort', sort)
    history.push({ search: params.toString() })
  }

  // 清除所有过滤器
  const clearAllFilters = () => {
    const params = new URLSearchParams()
    // 保留排序参数
    if (currentSort && currentSort !== 'newest') {
      params.set('sort', currentSort)
    }
    history.push({
      pathname: location.pathname,
      search: params.toString(),
    })
  }

  // 清除标签
  const clearTag = () => {
    const params = new URLSearchParams(queryParams)
    params.delete('tag')
    history.push({
      pathname: location.pathname,
      search: params.toString(),
    })
  }

  return (
    <div className={cn('mb-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* 左侧显示文章总数和过滤器 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            共
            {' '}
            <span className="font-medium text-gray-800 dark:text-gray-200">{totalCount}</span>
            {' '}
            篇文章
          </span>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-2 flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Icon icon="ri:filter-off-line" />
              清除全部筛选
            </button>
          )}

          {currentTag && (
            <div className="flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs text-primary-700 dark:bg-gray-700 dark:text-primary-300">
              <Icon icon="ri:price-tag-3-line" className="text-xs" />
              <span>{currentTag}</span>
              <button
                onClick={clearTag}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Icon icon="ri:close-line" className="text-xs" />
              </button>
            </div>
          )}
        </div>

        {/* 右侧排序控制 */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-gray-600 dark:text-gray-400">
            排序方式:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={currentSort}
              onChange={handleSortChange}
              className="rounded-md border border-gray-300 bg-white py-1 pl-2 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-primary-500 dark:focus:ring-primary-800"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <Icon icon="ri:arrow-down-s-line" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
