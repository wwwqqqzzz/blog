import type { Props as BlogPostItemsProps } from '@theme/BlogPostItems'
import type { BlogTag, BlogPostData, ExtendedBlogPostFrontMatter } from '../types/blog'

/**
 * 将BlogPostContent转换为自定义的BlogPostData格式
 */
export function transformBlogItems(items: BlogPostItemsProps['items']): BlogPostData[] {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items.map(item => {
    // Check if content exists
    if (!item || !item.content) {
      return {
        title: '',
        link: '',
        tags: [],
        date: '',
        description: '',
        sticky: 0,
        featured: false,
        image: '',
      };
    }

    const BlogPostContent = item.content;

    // Check if metadata and frontMatter exist
    if (!BlogPostContent.metadata || !BlogPostContent.frontMatter) {
      return {
        title: '',
        link: '',
        tags: [],
        date: '',
        description: '',
        sticky: 0,
        featured: false,
        image: '',
      };
    }

    const { metadata, frontMatter } = BlogPostContent;
    const { title = '', sticky = 0, featured = false, image = '' } = frontMatter as ExtendedBlogPostFrontMatter;
    const { permalink = '', date = new Date().toISOString(), tags = [], description = '' } = metadata;

    // Safely create date string
    let dateString = '';
    try {
      const dateObj = new Date(date);
      dateString = `${dateObj.getFullYear()}-${`0${dateObj.getMonth() + 1}`.slice(
        -2,
      )}-${`0${dateObj.getDate()}`.slice(-2)}`;
    } catch (e) {
      console.error('Error parsing date:', e);
      dateString = '';
    }

    // 为标签添加count初始值，真实值会在extractAllTags中计算
    const tagsWithCount = tags
      ? tags.map(tag => ({
          ...tag,
          count: 1, // 初始值会在extractAllTags中被重新计算
        }))
      : [];

    return {
      title: title || '',
      link: permalink || '',
      tags: tagsWithCount,
      date: dateString,
      description: description || '',
      sticky,
      featured,
      image,
    };
  })
}

/**
 * 从博客文章数据中提取所有标签
 */
export function extractAllTags(items: BlogPostData[]): BlogTag[] {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  const tagsMap = new Map<string, { tag: BlogTag, count: number }>()

  items.forEach((item) => {
    if (!item || !item.tags) return;

    item.tags.forEach((tag) => {
      if (!tag || !tag.label) return;

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
  if (!items || !Array.isArray(items)) {
    return [];
  }

  if (!tagName) return items

  return items.filter((item) => {
    if (!item || !item.tags || !Array.isArray(item.tags)) {
      return false;
    }
    return item.tags.some(tag => tag && tag.label === tagName)
  })
}
