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
import { ModernSidebar } from '../ModernSidebar'

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
  activeYear,
  setActiveYear,
  filteredPosts,
}: {
  activeTag: string
  setActiveTag: (tag: string) => void
  tags: string[]
  years: string[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  activeYear: string
  setActiveYear: (year: string) => void
  filteredPosts: BlogPost[]
}) {
  // 清除所有筛选
  const clearAllFilters = () => {
    setActiveTag('全部')
    setActiveYear('')
    setSearchTerm('')
  }

  // 检查是否有活动的筛选器
  const hasActiveFilters = activeTag !== '全部' || activeYear !== '' || searchTerm !== ''

  // 只显示最常用的5个标签
  const topTags = tags.slice(0, 5)

  // 获取博客统计数据
  const blogStats = {
    posts: filteredPosts.length,
    years: years.length,
    tags: tags.length,
  }

  return (
    <motion.div
      className="bg-card/50 flex h-full flex-col gap-6 rounded-xl p-5 shadow-sm"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* 博客统计卡片 */}
      <div className="relative mb-2 overflow-hidden rounded-lg bg-gradient-to-br from-primary-500/80 to-primary-700 p-4 text-white shadow-md">
        <div className="relative z-10">
          <h3 className="mb-1 text-lg font-bold">博客精选</h3>
          <p className="mb-3 text-xs text-white/80">发现更多精彩内容</p>

          <div className="flex items-center gap-4 text-sm">
            <div>
              <div className="text-xl font-bold">{blogStats.posts}</div>
              <div className="text-xs text-white/80">文章</div>
            </div>
            <div>
              <div className="text-xl font-bold">{blogStats.years}</div>
              <div className="text-xs text-white/80">年度</div>
            </div>
            <div>
              <div className="text-xl font-bold">{blogStats.tags}</div>
              <div className="text-xs text-white/80">标签</div>
            </div>
          </div>
        </div>

        {/* 装饰图形 */}
        <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -left-8 size-24 rounded-full bg-white/10"></div>
        <div className="absolute bottom-2 right-2 size-8 rounded-full bg-white/20"></div>
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
          className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* 活动筛选器指示器 */}
      {hasActiveFilters && (
        <div className="rounded-lg bg-primary-50 p-2 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              <span className="font-medium">当前筛选:</span>
              {activeTag !== '全部' && <span className="ml-1">{activeTag}</span>}
              {activeYear && (
                <span className="ml-1">
                  {activeYear}
                  年
                </span>
              )}
              {searchTerm && (
                <span className="ml-1">
                  "
                  {searchTerm}
                  "
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="ml-2 rounded-full p-1 hover:bg-primary-100 dark:hover:bg-primary-800/50"
              aria-label="清除筛选"
            >
              <Icon icon="ri:close-line" className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* 分类导航 - 使用图标按钮 */}
      <div>
        <h3 className="mb-3 flex items-center text-sm font-medium">
          <Icon icon="ri:apps-line" className="mr-1" />
          分类导航
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                'flex flex-col items-center justify-center rounded-lg p-2 transition-colors',
                activeTag === tag
                  ? 'bg-primary/10 text-primary'
                  : 'bg-card hover:bg-card/80 text-card-foreground',
              )}
            >
              <Icon
                icon={
                  tag === '全部'
                    ? 'ri:apps-fill'
                    : tag === '前端'
                      ? 'ri:code-s-slash-line'
                      : tag === '后端'
                        ? 'ri:terminal-box-line'
                        : tag === 'AI'
                          ? 'ri:robot-line'
                          : 'ri:book-2-line'
                }
                className="mb-1 text-xl"
              />
              <span className="text-xs">{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 分类统计可视化 */}
      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
        <h3 className="mb-3 flex items-center text-sm font-medium">
          <Icon icon="ri:pie-chart-line" className="mr-1" />
          内容分布
        </h3>
        <div className="space-y-2">
          {TAGS.filter(tag => tag !== '全部').map((tag) => {
            // 计算每个分类的文章数量
            const count = filteredPosts.filter(post =>
              post.metadata.frontMatter.tags?.some((t) => {
                const tagLabel = typeof t === 'string' ? t : (t as any).label
                return tagLabel === tag
              }),
            ).length

            // 计算百分比 (避免除以零)
            const percentage = filteredPosts.length > 0
              ? Math.round((count / filteredPosts.length) * 100)
              : 0

            return (
              <div key={tag} className="group">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setActiveTag(tag)}
                    className="flex items-center font-medium text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    <Icon
                      icon={
                        tag === '前端'
                          ? 'ri:code-s-slash-line'
                          : tag === '后端'
                            ? 'ri:terminal-box-line'
                            : tag === 'AI'
                              ? 'ri:robot-line'
                              : 'ri:book-2-line'
                      }
                      className="mr-1"
                    />
                    {tag}
                  </button>
                  <span className="text-gray-500 dark:text-gray-400">
                    {count}
                    {' '}
                    篇
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all group-hover:opacity-80',
                      tag === '前端'
                        ? 'bg-blue-500'
                        : tag === '后端'
                          ? 'bg-green-500'
                          : tag === 'AI'
                            ? 'bg-purple-500'
                            : 'bg-amber-500',
                    )}
                    style={{ width: `${percentage}%` }}
                  >
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 热门文章 */}
      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
        <h3 className="mb-3 flex items-center text-sm font-medium">
          <Icon icon="ri:fire-line" className="mr-1" />
          热门推荐
        </h3>
        <div className="space-y-3">
          {filteredPosts.slice(0, 3).map(post => (
            <Link
              key={post.metadata.permalink}
              href={post.metadata.permalink}
              className="group flex items-start gap-2 rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon
                  icon={
                    post.metadata.frontMatter.tags?.some((t) => {
                      const tagLabel = typeof t === 'string' ? t : (t as any).label
                      return tagLabel === '前端'
                    })
                      ? 'ri:code-s-slash-line'
                      : post.metadata.frontMatter.tags?.some((t) => {
                        const tagLabel = typeof t === 'string' ? t : (t as any).label
                        return tagLabel === '后端'
                      })
                        ? 'ri:terminal-box-line'
                        : post.metadata.frontMatter.tags?.some((t) => {
                          const tagLabel = typeof t === 'string' ? t : (t as any).label
                          return tagLabel === 'AI'
                        })
                          ? 'ri:robot-line'
                          : 'ri:article-line'
                  }
                  className="text-lg"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="truncate text-sm font-medium group-hover:text-primary">
                  {post.metadata.title}
                </h4>
                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.metadata.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  {post.metadata.readingTime && ` · ${Math.ceil(post.metadata.readingTime)} 分钟阅读`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 热门标签 - 视觉改进 */}
      <div>
        <h3 className="mb-3 flex items-center text-sm font-medium">
          <Icon icon="ri:price-tag-3-line" className="mr-1" />
          热门标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {topTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                'rounded-full px-3 py-1 text-xs transition-colors',
                activeTag === tag
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
              )}
            >
              {tag}
            </button>
          ))}
          {tags.length > 5 && (
            <Link
              href="/blog/tags"
              className="rounded-full bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              +
              {tags.length - 5}
            </Link>
          )}
        </div>
      </div>

      {/* 装饰图形 */}
      <div className="relative mt-2 h-32 overflow-hidden rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Icon icon="ri:quill-pen-line" className="text-8xl text-primary" />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
          <p className="mb-2 text-sm font-medium">探索更多内容</p>
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600"
          >
            <Icon icon="ri:article-line" className="mr-1" />
            浏览全部博客
          </Link>
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
              className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
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
                  className="rounded-full bg-primary/80 px-2.5 py-0.5 text-xs font-medium text-white"
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

// 主博客区组件
export default function BlogSection(): React.ReactNode {
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    posts: BlogPost[]
    postNum: number
    tagNum: number
  }

  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])

  // 初始化文章列表
  useEffect(() => {
    // 限制显示的文章数量
    const result = blogData.posts.slice(0, BLOG_POSTS_COUNT)
    setFilteredPosts(result)
  }, [blogData.posts])

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
        {/* 左侧现代化侧边栏 */}
        <div className="lg:col-span-3">
          <ModernSidebar
            filteredPosts={filteredPosts}
          />
        </div>

        {/* 右侧博客内容展示区 */}
        <div className="lg:col-span-9">
          {/* 博客标题 */}
          <div className="mb-6">
            <h2 className="text-card-foreground text-2xl font-bold tracking-tight">最新文章</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              探索我的最新博客文章，了解前沿技术和见解
            </p>
          </div>

          <BlogListPanel
            posts={blogData.posts}
            filteredPosts={filteredPosts}
          />
        </div>
      </div>
    </Section>
  )
}
