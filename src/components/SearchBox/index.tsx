import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useHistory } from '@docusaurus/router'
import { usePluginData } from '@docusaurus/useGlobalData'
import { transformBlogItems } from '@site/src/utils/blog'
import type { BlogPostData } from '@site/src/types/blog'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import Link from '@docusaurus/Link'
import { createSearchIndex, searchPosts, extractMatchSnippet, type FuseSearchResultItem } from '@site/src/utils/fuseSearch'
import { SearchHighlighter } from '@site/src/components/SearchHighlighter'

interface SearchBoxProps {
  /**
   * 占位符文本
   * @default "搜索文章..."
   */
  placeholder?: string
  /**
   * 最大结果数
   * @default 5
   */
  maxResults?: number
  /**
   * 搜索延迟（毫秒）
   * @default 300
   */
  debounceMs?: number
  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 增强搜索框组件
 * 支持实时搜索提示、自动完成和搜索结果高亮
 */
export default function SearchBox({
  placeholder = '搜索文章...',
  maxResults = 5,
  debounceMs = 300,
  className,
}: SearchBoxProps): React.ReactNode {
  const history = useHistory()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<FuseSearchResultItem[]>([])
  const [isResultsVisible, setIsResultsVisible] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 获取所有博客文章数据
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    blogPosts?: { content: any }[]
  } | undefined

  // 转换为统一格式
  const allPosts: BlogPostData[] = useMemo(() => {
    if (!blogData?.blogPosts || !Array.isArray(blogData.blogPosts)) {
      return []
    }
    return transformBlogItems(blogData.blogPosts.map(post => ({ content: post.content })))
  }, [blogData?.blogPosts])

  // 创建 Fuse.js 搜索索引
  const searchIndex = useMemo(() => {
    return createSearchIndex(allPosts)
  }, [allPosts])

  // 处理搜索
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    const timer = setTimeout(() => {
      // 使用 Fuse.js 执行搜索
      const results = searchPosts(searchIndex, searchTerm, maxResults)

      setSearchResults(results)
      setIsSearching(false)
      setIsResultsVisible(true)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, searchIndex, maxResults, debounceMs])

  // 处理点击外部关闭结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 处理表单提交 - 使用我们自己的 Fuse.js 搜索
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // 直接跳转到博客页面并传递搜索参数
      history.push(`/blog?q=${encodeURIComponent(searchTerm)}`)
      setIsResultsVisible(false)
    }
  }

  // 高亮匹配文本 - 使用 SearchHighlighter 组件
  const highlightMatch = (text: string) => {
    return <SearchHighlighter text={text} query={searchTerm} />
  }

  return (
    <div className={cn('relative w-full', className)} ref={searchRef}>
      <form onSubmit={handleSubmit}>
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
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-primary-500 dark:focus:ring-primary-800"
            placeholder={placeholder}
            onFocus={() => setIsResultsVisible(!!searchResults.length)}
          />

          {searchTerm && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                className="flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setSearchTerm('')}
                aria-label="清除搜索"
              >
                <Icon icon="ri:close-line" />
              </button>
            </div>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isResultsVisible && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <ul className="max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => {
                const post = result.item
                const snippets = extractMatchSnippet(result)

                return (
                  <li
                    key={post.link}
                    className={cn(
                      'px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700',
                      index !== searchResults.length - 1 && 'border-b border-gray-100 dark:border-gray-700',
                    )}
                  >
                    <Link
                      to={post.link}
                      className="block hover:no-underline"
                      onClick={() => setIsResultsVisible(false)}
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        <SearchHighlighter text={post.title} query={searchTerm} />
                      </div>

                      <div className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                        {snippets.length > 0 && snippets[0].field !== 'tags'
                          ? <SearchHighlighter text={snippets[0].text} query={searchTerm} />
                          : <SearchHighlighter text={post.description} query={searchTerm} />}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Icon icon="ri:price-tag-3-line" className="text-xs text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {post.tags[0].label}
                            </span>
                          </div>
                        )}

                        {/* 显示匹配位置 */}
                        {searchTerm && snippets.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Icon icon="ri:search-line" className="text-xs text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              匹配:
                              {' '}
                              {snippets.map(s => s.field).join(', ')}
                            </span>
                          </div>
                        )}

                        {/* 显示匹配分数 */}
                        {result.score !== undefined && (
                          <div className="flex items-center gap-1">
                            <Icon icon="ri:star-line" className="text-xs text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              相关度:
                              {' '}
                              {Math.round((1 - result.score) * 100)}
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
              按回车键搜索全部结果
            </div>
          </motion.div>
        )}

        {isResultsVisible && searchTerm && searchResults.length === 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white p-4 text-center shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <Icon icon="ri:emotion-sad-line" className="mx-auto mb-2 text-2xl text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              没有找到匹配"
              {searchTerm}
              "的文章
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
