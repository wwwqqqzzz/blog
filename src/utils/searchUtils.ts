import React from 'react'
import type { BlogPostData, BlogTag } from '../types/blog'

/**
 * 搜索结果项
 */
export interface SearchResultItem extends BlogPostData {
  /**
   * 匹配的字段
   */
  matchedFields: string[]
  /**
   * 匹配的分数（越高越相关）
   */
  score: number
  /**
   * 匹配的片段（用于高亮显示）
   */
  snippets?: {
    field: string
    text: string
  }[]
}

/**
 * 搜索过滤器选项
 */
export interface SearchFilters {
  /**
   * 标签过滤器
   */
  tags?: string[]
  /**
   * 日期范围过滤器
   */
  dateRange?: {
    from?: string
    to?: string
  }
  /**
   * 系列/集合过滤器
   */
  collections?: string[]
}

/**
 * 搜索排序选项
 */
export type SearchSortOption = 'relevance' | 'date_desc' | 'date_asc' | 'title_asc' | 'title_desc'

/**
 * 搜索选项
 */
export interface SearchOptions {
  /**
   * 搜索过滤器
   */
  filters?: SearchFilters
  /**
   * 排序方式
   */
  sort?: SearchSortOption
  /**
   * 每页结果数
   */
  limit?: number
  /**
   * 页码（从1开始）
   */
  page?: number
}

/**
 * 搜索结果
 */
export interface SearchResults {
  /**
   * 搜索结果项
   */
  items: SearchResultItem[]
  /**
   * 总结果数
   */
  total: number
  /**
   * 当前页码
   */
  page: number
  /**
   * 总页数
   */
  totalPages: number
  /**
   * 搜索用时（毫秒）
   */
  timeTaken: number
}

/**
 * 执行高级搜索
 * @param posts 博客文章数据
 * @param query 搜索查询
 * @param options 搜索选项
 * @returns 搜索结果
 */
export function searchPosts(
  posts: BlogPostData[],
  query: string,
  options: SearchOptions = {},
): SearchResults {
  const startTime = performance.now()

  // 默认选项
  const {
    filters = {},
    sort = 'relevance',
    limit = 10,
    page = 1,
  } = options

  // 过滤文章
  let filteredPosts = [...posts]

  // 应用标签过滤器
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => {
      if (!post.tags || post.tags.length === 0) return false
      return filters.tags.some(tag =>
        post.tags.some(postTag => postTag.label.toLowerCase() === tag.toLowerCase())
      )
    })
  }

  // 应用日期范围过滤器
  if (filters.dateRange) {
    const { from, to } = filters.dateRange

    if (from) {
      const fromDate = new Date(from)
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.date)
        return postDate >= fromDate
      })
    }

    if (to) {
      const toDate = new Date(to)
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.date)
        return postDate <= toDate
      })
    }
  }

  // 应用系列/集合过滤器
  if (filters.collections && filters.collections.length > 0) {
    filteredPosts = filteredPosts.filter(post => {
      if (!post.collection) return false
      return filters.collections.includes(post.collection)
    })
  }

  // 如果有搜索查询，执行搜索
  let searchResults: SearchResultItem[] = []

  if (query && query.trim()) {
    const normalizedQuery = query.toLowerCase().trim()
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1)

    searchResults = filteredPosts.map(post => {
      const matchedFields: string[] = []
      let score = 0
      const snippets: { field: string; text: string }[] = []

      // 检查标题匹配
      if (post.title) {
        const titleLower = post.title.toLowerCase()
        const titleMatch = queryTerms.some(term => titleLower.includes(term))

        if (titleMatch) {
          matchedFields.push('title')
          score += 10 // 标题匹配得分最高

          // 创建标题片段
          snippets.push({
            field: 'title',
            text: post.title,
          })
        }
      }

      // 检查描述匹配
      if (post.description) {
        const descLower = post.description.toLowerCase()
        const descMatch = queryTerms.some(term => descLower.includes(term))

        if (descMatch) {
          matchedFields.push('description')
          score += 5 // 描述匹配得分次之

          // 创建描述片段
          const firstMatchTerm = queryTerms.find(term => descLower.includes(term))
          if (firstMatchTerm) {
            const matchIndex = descLower.indexOf(firstMatchTerm)
            const startIndex = Math.max(0, matchIndex - 30)
            const endIndex = Math.min(post.description.length, matchIndex + 100)
            const snippet = post.description.substring(startIndex, endIndex)

            snippets.push({
              field: 'description',
              text: startIndex > 0 ? `...${snippet}` : snippet,
            })
          }
        }
      }

      // 检查标签匹配
      if (post.tags && post.tags.length > 0) {
        const tagMatch = post.tags.some(tag =>
          tag.label && queryTerms.some(term => tag.label.toLowerCase().includes(term))
        )

        if (tagMatch) {
          matchedFields.push('tags')
          score += 3 // 标签匹配得分较低

          // 创建标签片段
          const matchedTags = post.tags
            .filter(tag => tag.label && queryTerms.some(term => tag.label.toLowerCase().includes(term)))
            .map(tag => tag.label)
            .join(', ')

          snippets.push({
            field: 'tags',
            text: matchedTags,
          })
        }
      }

      // 检查内容匹配（如果有）
      if (post.source) {
        const contentLower = post.source.toLowerCase()
        const contentMatch = queryTerms.some(term => contentLower.includes(term))

        if (contentMatch) {
          matchedFields.push('content')
          score += 2 // 内容匹配得分最低

          // 创建内容片段
          const firstMatchTerm = queryTerms.find(term => contentLower.includes(term))
          if (firstMatchTerm) {
            const matchIndex = contentLower.indexOf(firstMatchTerm)
            const startIndex = Math.max(0, matchIndex - 30)
            const endIndex = Math.min(post.source.length, matchIndex + 100)
            const snippet = post.source.substring(startIndex, endIndex)

            snippets.push({
              field: 'content',
              text: startIndex > 0 ? `...${snippet}` : snippet,
            })
          }
        }
      }

      return {
        ...post,
        matchedFields,
        score,
        snippets,
      }
    }).filter(result => result.matchedFields.length > 0)
  } else {
    // 如果没有搜索查询，所有过滤后的文章都是结果
    searchResults = filteredPosts.map(post => ({
      ...post,
      matchedFields: [],
      score: 0,
      snippets: [],
    }))
  }

  // 应用排序
  switch (sort) {
    case 'relevance':
      // 如果有搜索查询，按相关性排序；否则按日期降序排序
      if (query && query.trim()) {
        searchResults.sort((a, b) => b.score - a.score)
      } else {
        searchResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }
      break
    case 'date_desc':
      searchResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'date_asc':
      searchResults.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case 'title_asc':
      searchResults.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title_desc':
      searchResults.sort((a, b) => b.title.localeCompare(a.title))
      break
  }

  // 计算分页
  const total = searchResults.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = Math.min(startIndex + limit, total)
  const paginatedResults = searchResults.slice(startIndex, endIndex)

  const endTime = performance.now()

  return {
    items: paginatedResults,
    total,
    page,
    totalPages,
    timeTaken: endTime - startTime,
  }
}

/**
 * 高亮搜索结果中的匹配文本
 * @param text 原始文本
 * @param query 搜索查询
 * @returns 高亮后的JSX元素
 */
export function highlightSearchMatch(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;

  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);

  if (queryTerms.length === 0) return text;

  // 创建正则表达式匹配所有查询词
  const regex = new RegExp(`(${queryTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

  // 分割文本
  const parts = text.split(regex);

  // 创建结果数组
  const result: React.ReactNode[] = [];

  // 遍历分割后的部分
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isMatch = queryTerms.some(term => part.toLowerCase() === term);

    if (isMatch) {
      // 如果匹配，添加高亮标记
      result.push(
        React.createElement(
          'mark',
          {
            key: i,
            className: 'rounded bg-primary-100 px-1 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
          },
          part
        )
      );
    } else {
      // 否则直接添加文本
      result.push(part);
    }
  }

  // 返回包装在Fragment中的结果
  return React.createElement(React.Fragment, null, ...result);
}

/**
 * 从博客文章中提取所有系列/集合
 * @param posts 博客文章数据
 * @returns 系列/集合列表
 */
export function extractAllCollections(posts: BlogPostData[]): string[] {
  const collectionsSet = new Set<string>()

  posts.forEach(post => {
    if (post.collection) {
      collectionsSet.add(post.collection)
    }
  })

  return Array.from(collectionsSet)
}
