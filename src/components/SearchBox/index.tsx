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
      console.log('SearchBox - 搜索词:', term)
      console.log('SearchBox - 搜索前文章数:', allPosts.length)

      const results = allPosts.filter((post) => {
        // 安全检查
        if (!post || !post.title) {
          return false
        }

        // 调试信息
        console.log('SearchBox - 检查文章:', post.title)

        // 标题匹配
        const titleMatch = post.title.toLowerCase().includes(term)
        if (titleMatch) console.log('SearchBox - 标题匹配')

        // 描述匹配
        const descMatch = post.description && post.description.toLowerCase().includes(term)
        if (descMatch) console.log('SearchBox - 描述匹配')

        // 标签匹配
        let tagMatch = false
        if (post.tags && Array.isArray(post.tags)) {
          tagMatch = post.tags.some((tag) => {
            if (!tag) return false
            return tag.label && tag.label.toLowerCase().includes(term)
          })
          if (tagMatch) console.log('SearchBox - 标签匹配')
        }

        return titleMatch || descMatch || tagMatch
      }).slice(0, maxResults)

      console.log('SearchBox - 找到匹配文章数:', results.length)
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

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      history.push(`/blog?q=${encodeURIComponent(searchTerm)}`)
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
                className="flex items-center px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => {
                  console.log('===== 搜索调试信息 =====')
                  console.log('搜索词:', searchTerm)
                  console.log('博客文章总数:', allPosts.length)
                  console.log('搜索结果数:', searchResults.length)
                  console.log('前3篇文章标题:')
                  allPosts.slice(0, 3).forEach((post, i) => {
                    console.log(`${i + 1}. ${post.title}`)
                  })
                  console.log('========================')
                }}
                title="显示搜索调试信息"
              >
                <Icon icon="ri:bug-line" />
              </button>
              <button
                type="button"
                className="flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setSearchTerm('')}
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
                    <div className="mt-1 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
                      {highlightMatch(result.description)}
                    </div>

                    {result.tags && result.tags.length > 0 && (
                      <div className="mt-1 flex items-center gap-1">
                        <Icon icon="ri:price-tag-3-line" className="text-xs text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {result.tags[0].label}
                        </span>
                      </div>
                    )}
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
