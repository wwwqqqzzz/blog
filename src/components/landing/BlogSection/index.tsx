import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import type { BlogPost } from '@docusaurus/plugin-content-blog'
import { usePluginData } from '@docusaurus/useGlobalData'
import { cn } from '@site/src/lib/utils'
import Image from '@theme/IdealImage'
import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { Section } from '../Section'
import { Icon } from '@iconify/react'

const BLOG_POSTS_COUNT = 6
const TAGS = ['全部', '前端', '后端', 'AI', '随笔']

// 侧边栏组件 - 分类导航/筛选区
export function BlogSidebar({
  activeTag,
  setActiveTag,
  tags,
  years,
  searchTerm,
  setSearchTerm,
}: {
  activeTag: string
  setActiveTag: (tag: string) => void
  tags: string[]
  years: string[]
  searchTerm: string
  setSearchTerm: (term: string) => void
}) {
  return (
    <motion.div
      className="bg-card/50 flex h-full flex-col gap-6 rounded-xl p-4 shadow-sm"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* 分类导航 */}
      <div className="flex flex-wrap gap-2">
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-full transition-colors',
              activeTag === tag
                ? 'bg-primary text-white'
                : 'bg-card hover:bg-card/80 text-card-foreground',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Icon icon="ri:search-line" className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="focus:ring-primary/30 w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2"
        />
      </div>

      {/* 标签云 */}
      <div>
        <h3 className="mb-2 flex items-center text-sm font-medium">
          <Icon icon="ri:price-tag-3-line" className="mr-1" />
          热门标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="bg-primary/10 hover:bg-primary/20 rounded-full px-2 py-1 text-xs text-primary transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 日期归档 */}
      <div>
        <h3 className="mb-2 flex items-center text-sm font-medium">
          <Icon icon="ri:calendar-line" className="mr-1" />
          日期归档
        </h3>
        <div className="flex flex-col space-y-1">
          {years.map(year => (
            <button
              key={year}
              className="text-card-foreground text-left text-sm transition-colors hover:text-primary"
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// 特色博客卡片组件
export function FeaturedBlogCard({ post }: { post: BlogPost }) {
  const {
    metadata: { permalink, frontMatter, title, description },
  } = post

  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative size-full overflow-hidden rounded-xl bg-card shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* 博客图片 */}
      <div className="relative h-60 w-full overflow-hidden">
        {frontMatter.image && (
          <div className="absolute inset-0">
            <Image
              src={frontMatter?.image}
              alt={title}
              img=""
              className="size-full object-cover transition-transform duration-500 ease-in-out"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        )}

        {/* 标签 */}
        <div className="absolute left-4 top-4 flex gap-2">
          {frontMatter.tags?.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="bg-primary/90 rounded-full px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {typeof tag === 'string' ? tag : (tag as any).label}
            </span>
          ))}
        </div>
      </div>

      {/* 文章内容 */}
      <div className="p-5">
        <h3 className="text-card-foreground mb-3 text-xl font-bold tracking-tight">
          {title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
          {description}
        </p>

        <motion.div
          className="mt-4 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={permalink}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            阅读全文
            <Icon icon="ri:arrow-right-s-line" className="ml-1" />
          </Link>

          <span className="text-muted-foreground text-xs">
            {frontMatter.date && new Date(frontMatter.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 标准博客卡片组件
export function BlogCard({ post }: { post: BlogPost }) {
  const {
    metadata: { permalink, frontMatter, title, description },
  } = post

  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="h-full overflow-hidden rounded-lg bg-card shadow-sm"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* 博客图片 */}
      <div className="relative h-40 w-full overflow-hidden">
        {frontMatter.image && (
          <>
            <Image
              src={frontMatter?.image}
              alt={title}
              img=""
              className="size-full object-cover transition-transform duration-300 ease-in-out"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* 标签 */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              {frontMatter.tags?.slice(0, 1).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-primary/80 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                >
                  {typeof tag === 'string' ? tag : (tag as any).label}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 文章内容 */}
      <div className="p-4">
        <h4 className="mb-2 line-clamp-1 text-base font-medium">
          <Link href={permalink} className="text-card-foreground transition-colors hover:text-primary hover:no-underline">
            {title}
          </Link>
        </h4>

        <p className="text-muted-foreground line-clamp-2 text-sm">
          {description}
        </p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 flex items-center justify-between"
        >
          <Link
            href={permalink}
            className="text-xs font-medium text-primary hover:underline"
          >
            阅读全文
          </Link>

          <span className="text-muted-foreground text-xs">
            {frontMatter.date && new Date(frontMatter.date).toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 博客列表展示面板组件
export function BlogListPanel({ posts, filteredPosts }: { posts: BlogPost[], filteredPosts: BlogPost[] }) {
  if (filteredPosts.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <Icon icon="ri:emotion-sad-line" className="text-muted-foreground mb-4 text-4xl" />
        <p className="text-muted-foreground">未找到相关文章</p>
      </div>
    )
  }

  // 获取第一篇特色文章和其余文章
  const featuredPost = filteredPosts[0]
  const remainingPosts = filteredPosts.slice(1, BLOG_POSTS_COUNT - 1)

  return (
    <div className="space-y-6">
      {/* 特色文章 */}
      {featuredPost && (
        <FeaturedBlogCard post={featuredPost} />
      )}

      {/* 其余文章网格 */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {remainingPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <BlogCard post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 提取标签和年份数据的辅助函数
function extractMetadata(posts: BlogPost[]) {
  const allTags = new Set<string>()
  const allYears = new Set<string>()

  posts.forEach((post) => {
    // 提取标签
    post.metadata.frontMatter.tags?.forEach((tag) => {
      const tagLabel = typeof tag === 'string' ? tag : (tag as any).label
      allTags.add(tagLabel)
    })

    // 提取年份
    if (post.metadata.date) {
      const year = new Date(post.metadata.date).getFullYear().toString()
      allYears.add(year)
    }
  })

  return {
    tags: Array.from(allTags),
    years: Array.from(allYears).sort((a, b) => parseInt(b) - parseInt(a)), // 降序排列年份
  }
}

// 主博客区组件
export default function BlogSection(): React.ReactNode {
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    posts: BlogPost[]
    postNum: number
    tagNum: number
  }

  const [activeTag, setActiveTag] = useState('全部')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])

  // 提取标签和年份数据
  const { tags, years } = extractMetadata(blogData.posts)

  // 过滤文章
  useEffect(() => {
    let result = blogData.posts

    // 根据标签过滤
    if (activeTag !== '全部') {
      result = result.filter(post =>
        post.metadata.frontMatter.tags?.some((tag) => {
          const tagLabel = typeof tag === 'string' ? tag : (tag as any).label
          return tagLabel === activeTag
        }),
      )
    }

    // 根据搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(post =>
        post.metadata.title.toLowerCase().includes(term)
        || post.metadata.description?.toLowerCase().includes(term),
      )
    }

    setFilteredPosts(result)
  }, [activeTag, searchTerm, blogData.posts])

  if (blogData.postNum === 0) {
    return <>作者还没开始写博文哦...</>
  }

  return (
    <Section
      title={<Translate id="homepage.blog.title">近期博客</Translate>}
      icon="ri:quill-pen-line"
      href="/blog"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 左侧博客分类导航 */}
        <div className="lg:col-span-3">
          <BlogSidebar
            activeTag={activeTag}
            setActiveTag={setActiveTag}
            tags={tags}
            years={years}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* 右侧博客内容展示区 */}
        <div className="lg:col-span-9">
          <BlogListPanel
            posts={blogData.posts}
            filteredPosts={filteredPosts}
          />
        </div>
      </div>
    </Section>
  )
}
