import React, { type ReactNode } from 'react'
import { type BlogSidebar } from '@docusaurus/plugin-content-blog'
import { BlogPostProvider, useBlogPost } from '@docusaurus/plugin-content-blog/client'
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import { usePluginData } from '@docusaurus/useGlobalData'
import BlogPostPasswordWrapper from '@site/src/components/BlogPostPasswordWrapper'
import CollectionNavigation from '@site/src/components/CollectionNavigation'
import Comment from '@site/src/components/Comment'
import ReadingProgress from '@site/src/components/ReadingProgress'
import RelatedArticles from '@site/src/components/RelatedArticles'
import SocialShare from '@site/src/components/SocialShare'
import { cn } from '@site/src/lib/utils'
import { transformBlogItems, extractCollections } from '@site/src/utils/blog'
import { trackArticleView } from '@site/src/utils/article-view-tracker'
import type { BlogPostData } from '@site/src/types/blog'
import BackToTopButton from '@theme/BackToTopButton'
import BlogLayout from '@theme/BlogLayout'
import BlogPostItem from '@theme/BlogPostItem'
import type { Props } from '@theme/BlogPostPage'
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata'
import BlogPostPaginator from '@theme/BlogPostPaginator'
import TOC from '@theme/TOC'

function BlogPostPageContent({
  sidebar,
  children,
}: {
  sidebar: BlogSidebar
  children: ReactNode
}): React.ReactElement {
  const { metadata, toc } = useBlogPost()
  const { nextItem, prevItem, frontMatter, permalink } = metadata
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
    hide_comment: hideComment,
    hide_related_articles: hideRelatedArticles,
    hide_social_share: hideSocialShare,
    collection,
    collection_order: collectionOrder,
    collection_description: collectionDescription,
  } = frontMatter

  // 获取所有博客文章数据，用于系列导航
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

  // 提取所有系列
  const collections = React.useMemo(() => {
    return extractCollections(allPosts)
  }, [allPosts])

  // 查找当前文章所属的系列
  const currentCollection = React.useMemo(() => {
    if (!collection) return null
    return collections.find(c => c.name === collection) || null
  }, [collection, collections])

  // 创建当前文章的数据对象，用于系列导航
  const currentPost = React.useMemo(() => {
    return {
      title: metadata.title,
      link: permalink,
      date: metadata.date,
      description: metadata.description,
      tags: metadata.tags,
      collection: collection as string,
      collectionOrder: collectionOrder as number,
      collectionDescription: collectionDescription as string,
    } as BlogPostData
  }, [metadata, permalink, collection, collectionOrder, collectionDescription])

  // 记录文章阅读次数
  React.useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      trackArticleView(permalink)
    }
  }, [permalink])

  return (
    <BlogLayout
      sidebar={sidebar}
      toc={
        !hideTableOfContents && toc.length > 0
          ? (
              <TOC toc={toc} minHeadingLevel={tocMinHeadingLevel} maxHeadingLevel={tocMaxHeadingLevel} />
            )
          : undefined
      }
    >
      <BlogPostItem>
        <BlogPostPasswordWrapper>
          {children}
        </BlogPostPasswordWrapper>
      </BlogPostItem>

      {/* 系列导航 */}
      {currentCollection && (
        <CollectionNavigation
          currentPost={currentPost}
          collectionPosts={currentCollection.posts}
          collectionName={currentCollection.name}
          collectionDescription={currentCollection.description}
          className="my-8"
        />
      )}

      {/* 社交分享按钮 */}
      {!hideSocialShare && <SocialShare />}

      {/* 相关文章区块 */}
      {!hideRelatedArticles && <RelatedArticles maxArticles={3} />}

      {(nextItem || prevItem) && (
        <div className="margin-bottom--md">
          <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
        </div>
      )}
      {!hideComment && <Comment />}
      <BackToTopButton />
    </BlogLayout>
  )
}

export default function BlogPostPage(props: Props): React.ReactElement {
  const BlogPostContent = props.content
  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider className={cn(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogPostPage)}>
        <BlogPostPageMetadata />
        <ReadingProgress />
        <BlogPostPageContent sidebar={props.sidebar}>
          <BlogPostContent />
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  )
}
