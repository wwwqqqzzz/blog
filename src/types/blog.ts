import type { TagsListItem } from '@docusaurus/utils'

/**
 * 博客标签
 */
export interface BlogTag {
  label: string
  permalink: string
  description?: string
  /**
   * 标签出现的次数/文章数量
   */
  count: number
}

/**
 * 扩展的博客文章前端数据
 */
export interface ExtendedBlogPostFrontMatter {
  title: string
  date: string
  tags?: string[] | { label: string }[]
  authors?: string[] | { name: string, url?: string }[]
  image?: string
  sticky?: number
  featured?: boolean
  hide_table_of_contents?: boolean
  toc_min_heading_level?: number
  toc_max_heading_level?: number
  hide_comment?: boolean
  hide_related_articles?: boolean
  hide_social_share?: boolean
}

/**
 * 统一的博客文章数据结构
 */
export interface BlogPostData {
  /**
   * 文章标题
   */
  title: string
  /**
   * 文章链接
   */
  link: string
  /**
   * 标签列表
   */
  tags: BlogTag[]
  /**
   * 发布日期
   */
  date: string
  /**
   * 文章描述
   */
  description: string
  /**
   * 置顶顺序（数字越大越靠前）
   */
  sticky?: number
  /**
   * 是否为特色文章
   */
  featured?: boolean
  /**
   * 封面图片
   */
  image?: string
}
