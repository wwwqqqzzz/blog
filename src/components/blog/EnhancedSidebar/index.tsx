import React from 'react'
import { usePluginData } from '@docusaurus/useGlobalData'
import { transformBlogItems, extractAllTags } from '@site/src/utils/blog'
import type { BlogPostData } from '@site/src/types/blog'
import PopularArticles from '@site/src/components/PopularArticles'
import TagCloud from '@site/src/components/TagCloud'
import { motion } from 'framer-motion'

interface EnhancedSidebarProps {
  /**
   * 是否使用动画效果
   * @default true
   */
  animate?: boolean
}

/**
 * 增强的博客侧边栏
 * 包含热门文章和标签云
 */
export default function EnhancedSidebar({ animate = true }: EnhancedSidebarProps): React.ReactNode {
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

  // 提取所有标签
  const allTags = React.useMemo(() => {
    return extractAllTags(allPosts)
  }, [allPosts])

  const content = (
    <div className="space-y-8">
      {/* 热门文章 */}
      <PopularArticles maxArticles={4} compact={true} />

      {/* 标签云 */}
      <TagCloud tags={allTags} compact={true} maxTags={20} />
    </div>
  )

  if (!animate) {
    return content
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {content}
    </motion.div>
  )
}
