import React from 'react'
import { transformBlogItems } from '@site/src/utils/blog'
import type { Props as BlogPostItemsProps } from '@theme/BlogPostItems'
import { BlogGrid } from '@site/src/components/blog'

/**
 * 博客文章网格视图组件
 * 将博客文章以网格卡片方式展示
 */
export default function BlogPostGridItems({ items }: BlogPostItemsProps): React.ReactNode {
  // 将博客数据转换为统一格式
  const blogItems = transformBlogItems(items)

  return (
    <BlogGrid
      posts={blogItems}
      columns={3}
      mode="card"
      featuredFirst={items.length > 3} // 当文章数量足够多时，突出显示第一篇
    />
  )
}
