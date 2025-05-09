import type { Props as BlogPostItemsProps } from '@theme/BlogPostItems'
import type { BlogTag, BlogPostData, ExtendedBlogPostFrontMatter } from '../types/blog'

/**
 * 将BlogPostContent转换为自定义的BlogPostData格式
 */
export function transformBlogItems(items: BlogPostItemsProps['items']): BlogPostData[] {
  return items.map(({ content: BlogPostContent }) => {
    const { metadata, frontMatter } = BlogPostContent
    const { title, sticky, featured, image } = frontMatter as ExtendedBlogPostFrontMatter
    const { permalink, date, tags, description } = metadata

    const dateObj = new Date(date)
    const dateString = `${dateObj.getFullYear()}-${`0${dateObj.getMonth() + 1}`.slice(
      -2,
    )}-${`0${dateObj.getDate()}`.slice(-2)}`

    // 为标签添加count初始值，真实值会在extractAllTags中计算
    const tagsWithCount = tags
      ? tags.map(tag => ({
          ...tag,
          count: 1, // 初始值会在extractAllTags中被重新计算
        }))
      : []

    return {
      title: title || '',
      link: permalink,
      tags: tagsWithCount,
      date: dateString,
      description: description || '',
      sticky,
      featured,
      image,
    }
  })
}

/**
 * 从博客文章数据中提取所有标签
 */
export function extractAllTags(items: BlogPostData[]): BlogTag[] {
  const tagsMap = new Map<string, { tag: BlogTag, count: number }>()

  items.forEach((item) => {
    item.tags?.forEach((tag) => {
      if (!tagsMap.has(tag.label)) {
        tagsMap.set(tag.label, {
          tag: {
            ...tag,
            count: 1,
          },
          count: 1,
        })
      }
      else {
        const existingEntry = tagsMap.get(tag.label)
        if (existingEntry) {
          existingEntry.count += 1
          existingEntry.tag.count = existingEntry.count
        }
      }
    })
  })

  return Array.from(tagsMap.values()).map(entry => entry.tag)
}

/**
 * 根据标签筛选博客文章
 */
export function filterPostsByTag(items: BlogPostData[], tagName: string): BlogPostData[] {
  if (!tagName) return items

  return items.filter((item) => {
    return item.tags?.some(tag => tag.label === tagName)
  })
}
