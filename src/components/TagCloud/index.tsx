import Link from '@docusaurus/Link'
import { useHistory, useLocation } from '@docusaurus/router'
import { Icon } from '@iconify/react'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@site/src/lib/utils'
import type { BlogTag } from '@site/src/types/blog'

interface TagCloudProps {
  /**
   * 标签列表
   */
  tags: BlogTag[]
  /**
   * 标题文本
   * @default "标签云"
   */
  title?: string
  /**
   * 最大标签数量
   * @default 30
   */
  maxTags?: number
  /**
   * 是否显示标签数量
   * @default true
   */
  showCount?: boolean
  /**
   * 是否使用紧凑模式
   * @default false
   */
  compact?: boolean
}

/**
 * 标签云组件
 * 显示所有标签并允许筛选
 */
export default function TagCloud({
  tags,
  title = '标签云',
  maxTags = 30,
  showCount = true,
  compact = false,
}: TagCloudProps): React.ReactNode {
  const location = useLocation()
  const history = useHistory()
  const queryParams = new URLSearchParams(location.search)
  const currentTag = queryParams.get('tag') || ''

  // 按文章数量排序标签
  const sortedTags = [...tags]
    .sort((a, b) => b.count - a.count)
    .slice(0, maxTags)

  // 获取最大和最小文章数，用于计算标签大小
  const maxCount = Math.max(...sortedTags.map(tag => tag.count))
  const minCount = Math.min(...sortedTags.map(tag => tag.count))

  // 计算标签大小（介于minSize和maxSize之间）
  const getFontSize = (count: number) => {
    const minSize = compact ? 0.75 : 0.85
    const maxSize = compact ? 1.2 : 1.5

    // 如果最大值和最小值相同，返回平均大小
    if (maxCount === minCount) {
      return `${(minSize + maxSize) / 2}rem`
    }

    // 计算相对大小
    const size = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize)
    return `${size}rem`
  }

  // 标签点击处理
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

  if (tags.length === 0) {
    return null
  }

  return (
    <div className={cn('my-6', compact && 'my-3')}>
      <h3 className={cn(
        'mb-4 flex items-center font-bold text-gray-900 dark:text-gray-100',
        compact ? 'text-base' : 'text-xl',
      )}
      >
        <Icon icon="ri:price-tag-3-line" className="mr-2 text-primary-500" />
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag, index) => (
          <motion.button
            key={tag.permalink}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            className={cn(
              'rounded-full border px-2 py-1 text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-700',
              currentTag === tag.label
                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-300'
                : 'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
            )}
            style={{ fontSize: getFontSize(tag.count) }}
            onClick={() => handleTagClick(tag.label)}
          >
            {tag.label}
            {showCount && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                (
                {tag.count}
                )
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
