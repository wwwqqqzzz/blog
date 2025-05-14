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
  pinned?: boolean
  hide_table_of_contents?: boolean
  toc_min_heading_level?: number
  toc_max_heading_level?: number
  hide_comment?: boolean
  hide_related_articles?: boolean
  hide_social_share?: boolean
  collection?: string
  collection_order?: number
  collection_description?: string
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
   * 是否置顶文章
   */
  pinned?: boolean
  /**
   * 封面图片
   */
  image?: string
  /**
   * 文章原始内容（用于全文搜索）
   */
  source?: string
  /**
   * 所属系列/集合名称
   */
  collection?: string
  /**
   * 在系列中的顺序
   */
  collectionOrder?: number
  /**
   * 系列描述（仅在系列第一篇文章中定义）
   */
  collectionDescription?: string
}

/**
 * 博客系列/集合数据结构
 */
export interface BlogCollection {
  /**
   * 系列名称（显示用）
   */
  name: string
  /**
   * 系列唯一标识符（匹配用）
   */
  id: string
  /**
   * 系列描述
   */
  description: string
  /**
   * 系列中的文章
   */
  posts: BlogPostData[]
  /**
   * 系列封面图片（可选）
   */
  image?: string
  /**
   * 系列URL路径
   */
  path: string
  /**
   * 系列URL slug（显示用）
   */
  slug: string
  /**
   * URL编码后的系列名（URL用）
   */
  encodedSlug: string
}
