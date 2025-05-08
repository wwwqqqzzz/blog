import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common'
import { cn } from '@site/src/lib/utils'
import BackToTopButton from '@theme/BackToTopButton'
import type { Props } from '@theme/BlogListPage'
import BlogListPaginator from '@theme/BlogListPaginator'
import BlogPostItems from '@theme/BlogPostItems'
import SearchMetadata from '@theme/SearchMetadata'

import Translate from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import { type ViewType, useViewType } from '@site/src/hooks/useViewType'
import BlogPostGridItems from '../BlogPostGridItems'
import MyLayout from '../MyLayout'
import { useLocation } from '@docusaurus/router'
import { transformBlogItems, extractAllTags, filterPostsByTag } from '@site/src/utils/blog'
import FeaturedArticles from '@site/src/components/FeaturedArticles'
import TagsFilter from '@site/src/components/TagsFilter'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function BlogListPageMetadata(props: Props): React.ReactNode {
  const { metadata } = props
  const { blogDescription } = metadata

  return (
    <>
      <PageMetadata title="博客" description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  )
}

function ViewTypeSwitch({
  viewType,
  toggleViewType,
}: {
  viewType: ViewType
  toggleViewType: (viewType: ViewType) => void
}): React.ReactNode {
  return (
    <div className="mb-6 flex items-center justify-center space-x-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleViewType('list')}
        className={cn(
          'flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
          viewType === 'list'
            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-primary-400'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800',
        )}
      >
        <Icon icon="ph:list" width="18" height="18" />
        <span>列表视图</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleViewType('grid')}
        className={cn(
          'flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
          viewType === 'grid'
            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-primary-400'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800',
        )}
      >
        <Icon icon="ph:grid-four" width="18" height="18" />
        <span>网格视图</span>
      </motion.button>
    </div>
  )
}

function BlogListPageContent(props: Props) {
  const { metadata, items } = props
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const currentTag = queryParams.get('tag') || ''

  const { viewType, toggleViewType } = useViewType()
  const isListView = viewType === 'list'
  const isGridView = viewType === 'grid'

  // 转换和处理博客数据
  const blogItems = transformBlogItems(items)
  const allTags = extractAllTags(blogItems)

  // 根据标签筛选的文章
  const [filteredItems, setFilteredItems] = useState(items)

  // 当标签筛选变化时，更新筛选后的文章列表
  useEffect(() => {
    if (!currentTag) {
      setFilteredItems(items)
      return
    }

    const filteredPosts = filterPostsByTag(blogItems, currentTag)
    const filteredItemsWithContent = items.filter((item) => {
      const { metadata } = item.content
      return filteredPosts.some(post => post.link === metadata.permalink)
    })

    setFilteredItems(filteredItemsWithContent)
  }, [currentTag, items, blogItems])

  return (
    <MyLayout>
      <div className="mb-10">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
          <Translate id="theme.blog.title.new">博客</Translate>
        </h1>
        <p className="mx-auto max-w-2xl text-center text-lg text-gray-600 dark:text-gray-400">
          代码人生：编织技术与生活的博客之旅
        </p>
      </div>

      {/* 精选文章区域 */}
      <FeaturedArticles items={blogItems} />

      {/* 标签筛选器 */}
      <TagsFilter tags={allTags} />

      {/* 视图切换 */}
      <ViewTypeSwitch viewType={viewType} toggleViewType={toggleViewType} />

      {/* 博客文章列表 */}
      <div className="row">
        <div className="col col--12">
          {filteredItems.length > 0
            ? (
                <>
                  {isListView && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <BlogPostItems items={filteredItems} />
                    </motion.div>
                  )}
                  {isGridView && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <BlogPostGridItems items={filteredItems} />
                    </motion.div>
                  )}
                  <BlogListPaginator metadata={metadata} />
                </>
              )
            : (
                <div className="my-10 text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-400">没有找到匹配的文章</p>
                  <button
                    className="mt-4 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                    onClick={() => {
                      const params = new URLSearchParams(queryParams)
                      params.delete('tag')
                      window.location.search = params.toString()
                    }}
                  >
                    查看所有文章
                  </button>
                </div>
              )}
        </div>
      </div>
      <BackToTopButton />
    </MyLayout>
  )
}

export default function BlogListPage(props: Props): React.ReactNode {
  return (
    <HtmlClassNameProvider className={cn(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  )
}
