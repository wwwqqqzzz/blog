import { type BlogSidebar } from '@docusaurus/plugin-content-blog'
import { BlogPostProvider, useBlogPost } from '@docusaurus/plugin-content-blog/client'
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import BlogPostPasswordWrapper from '@site/src/components/BlogPostPasswordWrapper'
import Comment from '@site/src/components/Comment'
import ReadingProgress from '@site/src/components/ReadingProgress'
import RelatedArticles from '@site/src/components/RelatedArticles'
import SocialShare from '@site/src/components/SocialShare'
import { cn } from '@site/src/lib/utils'
import { trackArticleView } from '@site/src/utils/article-view-tracker'
import BackToTopButton from '@theme/BackToTopButton'
import BlogLayout from '@theme/BlogLayout'
import BlogPostItem from '@theme/BlogPostItem'
import type { Props } from '@theme/BlogPostPage'
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata'
import BlogPostPaginator from '@theme/BlogPostPaginator'
import TOC from '@theme/TOC'
import React, { type ReactNode } from 'react'

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
  } = frontMatter

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
