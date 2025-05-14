import React, { useState, useEffect, useCallback } from 'react'
import { useHistory, useLocation } from '@docusaurus/router'
import { usePluginData } from '@docusaurus/useGlobalData'
import { PageMetadata, ThemeClassNames, HtmlClassNameProvider } from '@docusaurus/theme-common'
import { transformBlogItems, extractAllTags } from '@site/src/utils/blog'
import { searchPosts, highlightSearchMatch, extractAllCollections } from '@site/src/utils/searchUtils'
import type { SearchFilters, SearchOptions, SearchResults, SearchSortOption } from '@site/src/utils/searchUtils'
import type { BlogPostData, BlogTag } from '@site/src/types/blog'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import Link from '@docusaurus/Link'
import MyLayout from '@theme/MyLayout'
import BackToTopButton from '@theme/BackToTopButton'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// 排序选项
const SORT_OPTIONS = [
  { value: 'relevance', label: '相关性', icon: 'ri:star-line' },
  { value: 'date_desc', label: '最新发布', icon: 'ri:time-line' },
  { value: 'date_asc', label: '最早发布', icon: 'ri:history-line' },
  { value: 'title_asc', label: '标题 A-Z', icon: 'ri:sort-asc' },
  { value: 'title_desc', label: '标题 Z-A', icon: 'ri:sort-desc' },
]

/**
 * 高级搜索页面
 */
export default function SearchPage(): React.ReactNode {
  const location = useLocation()
  const history = useHistory()
  const queryParams = new URLSearchParams(location.search)

  // 获取URL参数
  const searchQuery = queryParams.get('q') || ''
  const currentPage = parseInt(queryParams.get('page') || '1', 10)
  const currentSort = (queryParams.get('sort') || 'relevance') as SearchSortOption
  const selectedTags = queryParams.get('tags')?.split(',').filter(Boolean) || []
  const selectedCollections = queryParams.get('collections')?.split(',').filter(Boolean) || []
  const dateFrom = queryParams.get('from') ? new Date(queryParams.get('from')) : null
  const dateTo = queryParams.get('to') ? new Date(queryParams.get('to')) : null

  // 本地状态
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags)
  const [localSelectedCollections, setLocalSelectedCollections] = useState<string[]>(selectedCollections)
  const [localDateFrom, setLocalDateFrom] = useState<Date | null>(dateFrom)
  const [localDateTo, setLocalDateTo] = useState<Date | null>(dateTo)
  const [localSort, setLocalSort] = useState<SearchSortOption>(currentSort)

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

  // 提取所有标签和集合
  const allTags = extractAllTags(allPosts)
  const allCollections = extractAllCollections(allPosts)

  // 执行搜索
  const performSearch = useCallback(() => {
    if (!allPosts.length) return

    setIsSearching(true)

    // 构建搜索过滤器
    const filters: SearchFilters = {}

    if (selectedTags.length > 0) {
      filters.tags = selectedTags
    }

    if (selectedCollections.length > 0) {
      filters.collections = selectedCollections
    }

    if (dateFrom || dateTo) {
      filters.dateRange = {}

      if (dateFrom) {
        filters.dateRange.from = dateFrom.toISOString()
      }

      if (dateTo) {
        filters.dateRange.to = dateTo.toISOString()
      }
    }

    // 构建搜索选项
    const searchOptions: SearchOptions = {
      filters,
      sort: currentSort,
      page: currentPage,
      limit: 10,
    }

    // 执行搜索
    const results = searchPosts(allPosts, searchQuery, searchOptions)
    setSearchResults(results)
    setIsSearching(false)
  }, [allPosts, searchQuery, selectedTags, selectedCollections, dateFrom, dateTo, currentSort, currentPage])

  // 当搜索参数变化时执行搜索
  useEffect(() => {
    performSearch()
  }, [performSearch])

  // 应用过滤器
  const applyFilters = () => {
    const params = new URLSearchParams()

    // 添加搜索查询
    if (localSearchQuery) {
      params.set('q', localSearchQuery)
    }

    // 添加排序方式
    if (localSort && localSort !== 'relevance') {
      params.set('sort', localSort)
    }

    // 添加标签过滤器
    if (localSelectedTags.length > 0) {
      params.set('tags', localSelectedTags.join(','))
    }

    // 添加集合过滤器
    if (localSelectedCollections.length > 0) {
      params.set('collections', localSelectedCollections.join(','))
    }

    // 添加日期范围过滤器
    if (localDateFrom) {
      params.set('from', localDateFrom.toISOString().split('T')[0])
    }

    if (localDateTo) {
      params.set('to', localDateTo.toISOString().split('T')[0])
    }

    // 重置页码
    params.set('page', '1')

    // 更新URL
    history.push({
      pathname: location.pathname,
      search: params.toString(),
    })
  }

  // 重置过滤器
  const resetFilters = () => {
    setLocalSelectedTags([])
    setLocalSelectedCollections([])
    setLocalDateFrom(null)
    setLocalDateTo(null)
    setLocalSort('relevance')
  }

  // 处理分页
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(queryParams)
    params.set('page', newPage.toString())
    history.push({
      pathname: location.pathname,
      search: params.toString(),
    })
  }

  // 处理标签切换
  const toggleTag = (tag: string) => {
    setLocalSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // 处理集合切换
  const toggleCollection = (collection: string) => {
    setLocalSelectedCollections(prev =>
      prev.includes(collection)
        ? prev.filter(c => c !== collection)
        : [...prev, collection]
    )
  }

  // 检查是否有活跃的过滤器
  const hasActiveFilters = selectedTags.length > 0 || selectedCollections.length > 0 || dateFrom || dateTo

  return (
    <HtmlClassNameProvider className={cn(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
      <PageMetadata
        title={`搜索${searchQuery ? `: ${searchQuery}` : ''}`}
        description={`搜索博客文章${searchQuery ? `: ${searchQuery}` : ''}`}
      />
      <MyLayout>
        <div className="container margin-vert--lg">
          <div className="row">
            <div className="col col--12">
              <h1 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
                高级搜索
              </h1>

              {/* 搜索框 */}
              <div className="mx-auto mb-6 max-w-2xl">
                <form onSubmit={(e) => { e.preventDefault(); applyFilters() }}>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Icon
                        icon={isSearching ? 'ri:loader-2-line' : 'ri:search-line'}
                        className={cn(
                          'text-gray-500 dark:text-gray-400',
                          isSearching && 'animate-spin',
                        )}
                      />
                    </div>

                    <input
                      type="text"
                      value={localSearchQuery}
                      onChange={e => setLocalSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-primary-500 dark:focus:ring-primary-800"
                      placeholder="搜索文章标题、描述、内容或标签..."
                    />

                    {localSearchQuery && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={() => setLocalSearchQuery('')}
                          aria-label="清除搜索"
                        >
                          <Icon icon="ri:close-line" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Icon icon={showFilters ? 'ri:filter-off-line' : 'ri:filter-line'} />
                      {showFilters ? '隐藏过滤器' : '显示过滤器'}
                      {hasActiveFilters && (
                        <span className="ml-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                          {selectedTags.length + selectedCollections.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)}
                        </span>
                      )}
                    </button>

                    <div className="flex gap-2">
                      {hasActiveFilters && (
                        <button
                          type="button"
                          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          onClick={resetFilters}
                        >
                          重置过滤器
                        </button>
                      )}

                      <button
                        type="submit"
                        className="rounded-md bg-primary-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                      >
                        搜索
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* 高级过滤器 */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-auto mt-4 max-w-4xl rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* 标签过滤器 */}
                        <div>
                          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">按标签过滤</h3>
                          <div className="flex flex-wrap gap-2">
                            {allTags.slice(0, 15).map(tag => (
                              <button
                                key={tag.label}
                                type="button"
                                onClick={() => toggleTag(tag.label)}
                                className={cn(
                                  'rounded-full border px-3 py-1 text-xs transition-colors',
                                  localSelectedTags.includes(tag.label)
                                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                )}
                              >
                                {tag.label}
                                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                  ({tag.count})
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 集合过滤器 */}
                        {allCollections.length > 0 && (
                          <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">按系列过滤</h3>
                            <div className="flex flex-wrap gap-2">
                              {allCollections.map(collection => (
                                <button
                                  key={collection}
                                  type="button"
                                  onClick={() => toggleCollection(collection)}
                                  className={cn(
                                    'rounded-full border px-3 py-1 text-xs transition-colors',
                                    localSelectedCollections.includes(collection)
                                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                  )}
                                >
                                  {collection}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 日期范围过滤器 */}
                        <div>
                          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">按日期范围过滤</h3>
                          <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600 dark:text-gray-400">从:</span>
                              <DatePicker
                                selected={localDateFrom}
                                onChange={date => setLocalDateFrom(date)}
                                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                placeholderText="开始日期"
                                dateFormat="yyyy-MM-dd"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600 dark:text-gray-400">至:</span>
                              <DatePicker
                                selected={localDateTo}
                                onChange={date => setLocalDateTo(date)}
                                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                placeholderText="结束日期"
                                dateFormat="yyyy-MM-dd"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 排序选项 */}
                        <div>
                          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">排序方式</h3>
                          <select
                            value={localSort}
                            onChange={e => setLocalSort(e.target.value as SearchSortOption)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {SORT_OPTIONS.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 搜索结果 */}
              <div className="mx-auto mt-8 max-w-4xl">
                {searchResults && (
                  <>
                    {/* 搜索结果统计 */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {searchQuery ? (
                          <>
                            找到
                            <span className="mx-1 font-medium text-gray-900 dark:text-gray-100">
                              {searchResults.total}
                            </span>
                            篇与
                            <span className="mx-1 font-medium text-gray-900 dark:text-gray-100">
                              "{searchQuery}"
                            </span>
                            相关的文章
                            {searchResults.timeTaken && (
                              <span className="ml-1 text-xs text-gray-500 dark:text-gray-500">
                                ({Math.round(searchResults.timeTaken)}ms)
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            显示
                            <span className="mx-1 font-medium text-gray-900 dark:text-gray-100">
                              {searchResults.total}
                            </span>
                            篇文章
                          </>
                        )}
                      </div>

                      {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map(tag => (
                            <div
                              key={tag}
                              className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                            >
                              <Icon icon="ri:price-tag-3-line" className="text-xs" />
                              <span>{tag}</span>
                            </div>
                          ))}

                          {selectedCollections.map(collection => (
                            <div
                              key={collection}
                              className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                            >
                              <Icon icon="ri:folder-line" className="text-xs" />
                              <span>{collection}</span>
                            </div>
                          ))}

                          {dateFrom && (
                            <div className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                              <Icon icon="ri:calendar-line" className="text-xs" />
                              <span>从 {dateFrom.toISOString().split('T')[0]}</span>
                            </div>
                          )}

                          {dateTo && (
                            <div className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                              <Icon icon="ri:calendar-line" className="text-xs" />
                              <span>至 {dateTo.toISOString().split('T')[0]}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 搜索结果列表 */}
                    {searchResults.items.length > 0 ? (
                      <div className="space-y-6">
                        {searchResults.items.map(result => (
                          <div
                            key={result.link}
                            className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Link
                              to={result.link}
                              className="block hover:no-underline"
                            >
                              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {searchQuery ? highlightSearchMatch(result.title, searchQuery) : result.title}
                              </h2>

                              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Icon icon="ri:calendar-line" className="text-xs" />
                                  <span>{result.date}</span>
                                </div>

                                {result.tags && result.tags.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Icon icon="ri:price-tag-3-line" className="text-xs" />
                                    <span>
                                      {result.tags.slice(0, 3).map(tag => tag.label).join(', ')}
                                      {result.tags.length > 3 && '...'}
                                    </span>
                                  </div>
                                )}

                                {result.collection && (
                                  <div className="flex items-center gap-1">
                                    <Icon icon="ri:folder-line" className="text-xs" />
                                    <span>{result.collection}</span>
                                  </div>
                                )}
                              </div>

                              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                {searchQuery && result.snippets && result.snippets.length > 0
                                  ? highlightSearchMatch(result.snippets[0].text, searchQuery)
                                  : result.description}
                              </p>

                              {searchQuery && result.matchedFields.length > 0 && (
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                  匹配: {result.matchedFields.join(', ')}
                                </div>
                              )}
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                        <Icon icon="ri:search-line" className="mx-auto mb-4 text-4xl text-gray-400" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                          没有找到匹配的文章
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          尝试使用不同的关键词或调整过滤器
                        </p>
                      </div>
                    )}

                    {/* 分页 */}
                    {searchResults.totalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={cn(
                              'rounded-md border border-gray-300 px-3 py-1.5 text-sm',
                              currentPage === 1
                                ? 'cursor-not-allowed text-gray-400 dark:border-gray-700 dark:text-gray-600'
                                : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                            )}
                          >
                            上一页
                          </button>

                          {Array.from({ length: searchResults.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => handlePageChange(page)}
                              className={cn(
                                'rounded-md border px-3 py-1.5 text-sm',
                                page === currentPage
                                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-900/30 dark:text-primary-300'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                              )}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === searchResults.totalPages}
                            className={cn(
                              'rounded-md border border-gray-300 px-3 py-1.5 text-sm',
                              currentPage === searchResults.totalPages
                                ? 'cursor-not-allowed text-gray-400 dark:border-gray-700 dark:text-gray-600'
                                : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                            )}
                          >
                            下一页
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                )}

                {!searchResults && !isSearching && (
                  <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                    <Icon icon="ri:search-line" className="mx-auto mb-4 text-4xl text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                      输入关键词开始搜索
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      您可以搜索文章标题、描述、内容或标签
                    </p>
                  </div>
                )}

                {isSearching && (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-2">
                      <Icon icon="ri:loader-2-line" className="animate-spin text-2xl text-primary-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">正在搜索...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <BackToTopButton />
      </MyLayout>
    </HtmlClassNameProvider>
  )
}
