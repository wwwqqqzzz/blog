import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from '@docusaurus/router'
import { usePluginData } from '@docusaurus/useGlobalData'
import { transformBlogItems } from '@site/src/utils/blog'
import type { BlogPostData } from '@site/src/types/blog'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import Link from '@docusaurus/Link'

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
  const [searchResults, setSearchResults] = useState<BlogPostData[]>([])
  const [isResultsVisible, setIsResultsVisible] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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

  // 处理搜索
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    const timer = setTimeout(() => {
      const term = searchTerm.toLowerCase()

      const results = allPosts
        .map((post) => {
          // 安全检查
          if (!post || !post.title) {
            return null
          }

          // 标题匹配
          const titleMatch = post.title.toLowerCase().includes(term)

          // 描述匹配
          const descMatch = post.description && post.description.toLowerCase().includes(term)

          // 标签匹配
          let tagMatch = false
          if (post.tags && Array.isArray(post.tags)) {
            tagMatch = post.tags.some((tag) => {
              if (!tag) return false
              return tag.label && tag.label.toLowerCase().includes(term)
            })
          }

          // 内容匹配（如果有）
          let contentMatch = false
          let contentSnippet = ''

          if (post.source) {
            const contentLower = post.source.toLowerCase()
            contentMatch = contentLower.includes(term)

            // 如果内容匹配，提取匹配片段
            if (contentMatch) {
              const matchIndex = contentLower.indexOf(term)
              const startIndex = Math.max(0, matchIndex - 30)
              const endIndex = Math.min(post.source.length, matchIndex + 100)
              contentSnippet = post.source.substring(startIndex, endIndex)
              if (startIndex > 0) {
                contentSnippet = '...' + contentSnippet
              }
              if (endIndex < post.source.length) {
                contentSnippet = contentSnippet + '...'
              }
            }
          }

          // 如果没有任何匹配，返回null
          if (!titleMatch && !descMatch && !tagMatch && !contentMatch) {
            return null
          }

          // 返回匹配的文章和匹配信息
          return {
            ...post,
            matchInfo: {
              titleMatch,
              descMatch,
              tagMatch,
              contentMatch,
              contentSnippet
            }
          }
        })
        .filter(Boolean) // 过滤掉null
        .slice(0, maxResults)

      setSearchResults(results)
      setIsSearching(false)
      setIsResultsVisible(true)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, allPosts, maxResults, debounceMs])

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

  // 处理表单提交 - 触发本地搜索插件的搜索功能
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // 触发本地搜索插件的搜索功能
      // 这里我们通过模拟点击导航栏中的搜索按钮来实现
      const searchButton = document.querySelector('.DocSearch-Button') as HTMLButtonElement
      if (searchButton) {
        searchButton.click()

        // 等待搜索弹窗出现后，填入搜索词
        setTimeout(() => {
          const searchInput = document.querySelector('.DocSearch-Input') as HTMLInputElement
          if (searchInput) {
            searchInput.value = searchTerm
            // 触发输入事件，让搜索插件执行搜索
            searchInput.dispatchEvent(new Event('input', { bubbles: true }))
          }
        }, 100)
      } else {
        // 如果找不到搜索按钮，回退到原来的行为
        history.push(`/blog?q=${encodeURIComponent(searchTerm)}`)
      }
      setIsResultsVisible(false)
    }
  }

  // 高亮匹配文本
  const highlightMatch = (text: string) => {
    if (!searchTerm.trim()) return text

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))

    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchTerm.toLowerCase()
            ? (
                <mark key={index} className="rounded bg-primary-100 px-1 text-primary-900 dark:bg-primary-900 dark:text-primary-100">
                  {part}
                </mark>
              )
            : (
                part
              ),
        )}
      </>
    )
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
              {searchResults.map((result, index) => (
                <li
                  key={result.link}
                  className={cn(
                    'px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700',
                    index !== searchResults.length - 1 && 'border-b border-gray-100 dark:border-gray-700',
                  )}
                >
                  <Link
                    to={result.link}
                    className="block hover:no-underline"
                    onClick={() => setIsResultsVisible(false)}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {highlightMatch(result.title)}
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                      {result.matchInfo?.contentMatch && result.matchInfo.contentSnippet
                        ? highlightMatch(result.matchInfo.contentSnippet)
                        : highlightMatch(result.description)}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Icon icon="ri:price-tag-3-line" className="text-xs text-gray-500 dark:text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {result.tags[0].label}
                          </span>
                        </div>
                      )}

                      {/* 显示匹配位置 */}
                      {searchTerm && result.matchInfo && (
                        <div className="flex items-center gap-1">
                          <Icon icon="ri:search-line" className="text-xs text-gray-500 dark:text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            匹配: {
                              [
                                result.matchInfo.titleMatch && '标题',
                                result.matchInfo.descMatch && '描述',
                                result.matchInfo.tagMatch && '标签',
                                result.matchInfo.contentMatch && '内容'
                              ].filter(Boolean).join(', ')
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
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
