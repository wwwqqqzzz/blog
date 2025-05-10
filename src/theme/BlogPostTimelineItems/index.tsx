import React, { useEffect, useMemo, useState } from 'react'
import { BlogPostProvider } from '@docusaurus/plugin-content-blog/client'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import type { Props } from '@theme/BlogPostItems'
import Link from '@docusaurus/Link'
import Tag from '@theme/Tag'
import styles from './styles.module.css'
import Translate from '@docusaurus/Translate'

/**
 * 时间线式博客列表视图组件
 */
export default function BlogPostTimelineItems({ items }: Props): JSX.Element {
  // 状态管理
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({})
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState<boolean>(true)
  const [initialized, setInitialized] = useState<boolean>(false)

  // 按年月分组文章
  const groupedItems = useMemo(() => {
    const groups = {}

    items.forEach((item) => {
      const date = new Date(item.content.metadata.date)
      const year = date.getFullYear()
      const month = date.getMonth()

      if (!groups[year]) {
        groups[year] = {}
      }

      if (!groups[year][month]) {
        groups[year][month] = []
      }

      groups[year][month].push(item)
    })

    // 转换为排序后的数组格式
    return Object.entries(groups)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // 年份降序
      .map(([year, months]) => ({
        year: Number(year),
        months: Object.entries(months)
          .sort(([monthA], [monthB]) => Number(monthB) - Number(monthA)) // 月份降序
          .map(([month, monthItems]) => ({
            month: Number(month),
            items: monthItems,
          })),
      }))
  }, [items])

  // 初始化展开状态
  useEffect(() => {
    if (!initialized && groupedItems.length > 0) {
      // 默认展开最近一年
      const initialExpandedYears = {}
      initialExpandedYears[groupedItems[0].year] = true

      // 默认展开最近一年的所有月份
      const initialExpandedMonths = {}
      groupedItems[0].months.forEach((month) => {
        initialExpandedMonths[`${groupedItems[0].year}-${month.month}`] = true
      })

      setExpandedMonths(initialExpandedMonths)
      setExpandedYears(initialExpandedYears)
      setInitialized(true)
    }
  }, [groupedItems, initialized])

  // 获取月份名称
  const getMonthName = (month: number) => {
    const monthNames = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月',
    ]
    return monthNames[month]
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.getDate().toString().padStart(2, '0')
  }

  // 格式化完整日期
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  // 计算阅读时间
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  // 切换年份展开状态
  const toggleYear = (year: number) => {
    const isCurrentlyExpanded = expandedYears[year]

    // 更新年份展开状态
    setExpandedYears(prev => ({
      ...prev,
      [year]: !isCurrentlyExpanded,
    }))

    // 如果是展开操作，确保至少展开第一个月份
    if (!isCurrentlyExpanded) {
      const yearMonths = groupedItems.find(g => g.year === year)?.months || []
      if (yearMonths.length > 0) {
        const firstMonthKey = `${year}-${yearMonths[0].month}`
        setExpandedMonths(prev => ({
          ...prev,
          [firstMonthKey]: true,
        }))
      }
    }
  }

  // 切换月份展开状态
  const toggleMonth = (yearMonth: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [yearMonth]: !prev[yearMonth],
    }))
  }

  // 跳转到特定年份并展开
  const scrollToYear = (year: number) => {
    // 创建新的展开状态对象
    const newExpandedYears = {}
    groupedItems.forEach((group) => {
      newExpandedYears[group.year] = group.year === year
    })

    // 创建新的月份展开状态
    const newExpandedMonths = {}
    // 找到对应年份的月份
    const yearMonths = groupedItems.find(g => g.year === year)?.months || []
    if (yearMonths.length > 0) {
      // 默认展开第一个月份
      yearMonths.forEach((month, index) => {
        newExpandedMonths[`${year}-${month.month}`] = index === 0
      })
    }

    // 更新状态
    setExpandedYears(newExpandedYears)
    setExpandedMonths(newExpandedMonths)

    // 滚动到该年份
    setTimeout(() => {
      const yearElement = document.getElementById(`year-${year}`)
      if (yearElement) {
        yearElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  // 展开所有年份和月份
  const expandAll = () => {
    const allYears = {}
    const allMonths = {}

    groupedItems.forEach((yearGroup) => {
      allYears[yearGroup.year] = true

      yearGroup.months.forEach((monthGroup) => {
        allMonths[`${yearGroup.year}-${monthGroup.month}`] = true
      })
    })

    setExpandedYears(allYears)
    setExpandedMonths(allMonths)
  }

  // 折叠所有年份和月份
  const collapseAll = () => {
    setExpandedYears({})
    setExpandedMonths({})
  }

  // 检查是否所有年份都已展开
  const isAllExpanded = useMemo(() => {
    if (groupedItems.length === 0) return false

    return groupedItems.every(yearGroup => expandedYears[yearGroup.year])
  }, [expandedYears, groupedItems])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Icon icon="ri:file-search-line" className="mb-4 text-5xl text-gray-400" />
        <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
          <Translate id="theme.blog.post.noPostsFound">没有找到文章</Translate>
        </p>
      </div>
    )
  }

  return (
    <div className={styles.timelineContainer} role="region" aria-label="博客文章时间线">
      {/* 帮助提示 */}
      {showHelp && (
        <div className="mb-6 rounded-lg border border-primary-100 bg-primary-50 p-4 text-primary-800 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Icon icon="ri:information-line" className="mr-2 text-xl" />
              <p className="text-sm">
                <strong>时间线视图使用提示：</strong>
                {' '}
                点击年份或月份可以展开/折叠内容，点击上方的年份按钮可以快速筛选特定年份的文章。
              </p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="ml-2 rounded-full p-1 text-primary-600 hover:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-800/50"
              aria-label="关闭提示"
            >
              <Icon icon="ri:close-line" className="text-lg" />
            </button>
          </div>
        </div>
      )}

      {/* 时间线导航和控制 */}
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {groupedItems.map(yearGroup => (
            <button
              key={`nav-${yearGroup.year}`}
              className={cn(
                'rounded-full border px-3 py-1 text-sm font-medium transition-all',
                expandedYears[yearGroup.year]
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-gray-800 dark:text-primary-300'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800',
              )}
              onClick={() => scrollToYear(yearGroup.year)}
              aria-label={`显示${yearGroup.year}年的文章`}
            >
              {yearGroup.year}
              <span className="ml-1 text-xs text-gray-500">
                (
                {yearGroup.months.reduce((acc, month) => acc + month.items.length, 0)}
                )
              </span>
            </button>
          ))}
        </div>

        <button
          className={cn(
            'ml-2 flex items-center gap-1 rounded-md border px-3 py-1 text-sm font-medium transition-all',
            'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800',
          )}
          onClick={isAllExpanded ? collapseAll : expandAll}
          aria-label={isAllExpanded ? '折叠所有年份' : '展开所有年份'}
        >
          <Icon icon={isAllExpanded ? 'ri:contract-up-down-line' : 'ri:expand-up-down-line'} className="text-lg" />
          <span>{isAllExpanded ? '折叠全部' : '展开全部'}</span>
        </button>
      </div>

      {groupedItems.map((yearGroup, yearIndex) => (
        <div
          key={yearGroup.year}
          id={`year-${yearGroup.year}`}
          className={cn('mb-8', expandedYears[yearGroup.year] ? '' : 'cursor-pointer')}
          onClick={() => !expandedYears[yearGroup.year] && toggleYear(yearGroup.year)}
        >
          <h2
            className={styles.yearHeading}
            onClick={() => toggleYear(yearGroup.year)}
            style={{ cursor: 'pointer' }}
            role="button"
            aria-expanded={expandedYears[yearGroup.year]}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleYear(yearGroup.year)
              }
            }}
          >
            <div className="flex items-center">
              {yearGroup.year}
              <Icon
                icon={expandedYears[yearGroup.year] ? 'ri:arrow-down-s-line' : 'ri:arrow-right-s-line'}
                className="ml-2 text-xl transition-transform"
                aria-hidden="true"
              />
              <span className="ml-2 text-base font-normal text-gray-500">
                (
                {yearGroup.months.reduce((acc, month) => acc + month.items.length, 0)}
                {' '}
                篇文章)
              </span>
            </div>
          </h2>

          {expandedYears[yearGroup.year] && yearGroup.months.map((monthGroup, monthIndex) => {
            const yearMonthKey = `${yearGroup.year}-${monthGroup.month}`
            const isMonthExpanded = expandedMonths[yearMonthKey]

            return (
              <div
                key={yearMonthKey}
                className={cn('mb-6', isMonthExpanded ? '' : 'cursor-pointer')}
                onClick={(e) => {
                  // 防止事件冒泡
                  if (e.target === e.currentTarget && !isMonthExpanded) {
                    toggleMonth(yearMonthKey)
                  }
                }}
              >
                <h3
                  className={styles.monthHeading}
                  onClick={() => toggleMonth(yearMonthKey)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  aria-expanded={isMonthExpanded}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleMonth(yearMonthKey)
                    }
                  }}
                  id={`month-${yearMonthKey}`}
                >
                  <div className="flex items-center">
                    {getMonthName(monthGroup.month)}
                    <Icon
                      icon={isMonthExpanded ? 'ri:arrow-down-s-line' : 'ri:arrow-right-s-line'}
                      className="ml-2 text-lg transition-transform"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (
                      {monthGroup.items.length}
                      {' '}
                      篇文章)
                    </span>
                  </div>
                </h3>

                {isMonthExpanded && (
                  <div className={styles.timelineItems}>
                    {monthGroup.items.map(({ content: BlogPostContent }, i) => {
                      const { metadata } = BlogPostContent
                      const { title, permalink, date, tags, description, readingTime } = metadata
                      const isHovered = hoveredItem === permalink

                      return (
                        <BlogPostProvider key={permalink} content={BlogPostContent}>
                          <div
                            className={styles.timelineItem}
                            onMouseEnter={() => setHoveredItem(permalink)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            {/* 时间线节点 */}
                            <div className={styles.timelineNode}>
                              <span className="text-xs font-medium">{formatDate(date)}</span>
                            </div>

                            {/* 文章卡片 */}
                            <div className={styles.timelineCard}>
                              <div className={styles.cardContent}>
                                {/* 日期和阅读时间 */}
                                <div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Icon icon="ri:calendar-line" className="mr-1" />
                                  <span className="mr-3">{formatFullDate(date)}</span>

                                  {readingTime && (
                                    <>
                                      <Icon icon="ri:time-line" className="mr-1" />
                                      <span>
                                        {Math.ceil(readingTime)}
                                        {' '}
                                        分钟阅读
                                      </span>
                                    </>
                                  )}
                                </div>

                                {/* 标题 */}
                                <Link
                                  to={permalink}
                                  className={styles.articleTitle}
                                >
                                  {BlogPostContent.frontMatter?.pinned && (
                                    <span className="mr-2 inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                                      <Icon icon="ri:pushpin-fill" className="mr-1 text-xs" />
                                      置顶
                                    </span>
                                  )}
                                  {title}
                                </Link>

                                {/* 描述 */}
                                {description && (
                                  <p className={styles.articleDescription}>
                                    {description}
                                  </p>
                                )}

                                {/* 标签 */}
                                {tags && tags.length > 0 && (
                                  <div className={styles.tagsContainer}>
                                    {tags.map(tag => (
                                      <Tag
                                        key={tag.permalink}
                                        label={tag.label}
                                        permalink={tag.permalink}
                                      />
                                    ))}
                                  </div>
                                )}

                                {/* 阅读更多链接 */}
                                <Link
                                  to={permalink}
                                  className={styles.readMoreLink}
                                >
                                  阅读更多
                                  <Icon icon="ri:arrow-right-line" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </BlogPostProvider>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
