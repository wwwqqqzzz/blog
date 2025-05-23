import React from 'react'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import Link from '@docusaurus/Link'
import { translate } from '@docusaurus/Translate'
import { usePluralForm } from '@docusaurus/theme-common'
import { useDateTimeFormat } from '@docusaurus/theme-common/internal'
import { cn } from '@site/src/lib/utils'
import type { Props } from '@theme/BlogPostItem/Header/Info'
import type { BlogPostFrontMatterAuthor } from '@docusaurus/plugin-content-blog'

import { Icon } from '@iconify/react'
import Tag from '@site/src/theme/Tag'

// Very simple pluralization: probably good enough for now
function useReadingTimePlural() {
  const { selectMessage } = usePluralForm()
  return (readingTimeFloat: number) => {
    const readingTime = Math.ceil(readingTimeFloat)
    return selectMessage(
      readingTime,
      translate(
        {
          id: 'theme.blog.post.readingTime.plurals',
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One min read|{readingTime} min read',
        },
        { readingTime },
      ),
    )
  }
}

export function ReadingTime({ readingTime }: { readingTime: number }) {
  const readingTimePlural = useReadingTimePlural()
  return <span className="truncate">{readingTimePlural(readingTime)}</span>
}

function DateTime({ date, formattedDate }: { date: string, formattedDate: string }) {
  return (
    <time dateTime={date} itemProp="datePublished" className="truncate">
      {formattedDate}
    </time>
  )
}

export default function BlogPostItemHeaderInfo({ className }: Props): React.ReactElement {
  const { metadata, isBlogPostPage } = useBlogPost()
  const { date, readingTime, tags, frontMatter } = metadata

  // 作者信息（如果有）
  const authorsData = frontMatter.authors || []
  const authors = Array.isArray(authorsData) ? authorsData : [authorsData]

  const tagsExists = tags.length > 0

  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  const formatDate = (blogDate: string) => dateTimeFormat.format(new Date(blogDate))
  const formattedDate = formatDate(date)

  return (
    <div className={cn('inline-flex flex-wrap gap-1.5 text-base', 'margin-bottom--md', className)}>
      <div className="inline-flex items-center gap-1">
        <Icon icon="ri:calendar-line" />
        <DateTime date={date} formattedDate={formattedDate} />
      </div>
      {typeof readingTime !== 'undefined' && (
        <div className="inline-flex items-center gap-1">
          <Icon icon="ri:time-line" />
          <ReadingTime readingTime={readingTime} />
        </div>
      )}
      {authors.length > 0 && (
        <div className="inline-flex items-center gap-1">
          <Icon icon="ri:user-line" />
          {authors.map((author, idx) => {
            // 处理字符串类型的作者
            const authorName = typeof author === 'string' ? author : author.name
            const authorUrl = typeof author === 'string' ? undefined : author.url

            return (
              <React.Fragment key={authorName}>
                {authorUrl
                  ? (
                      <Link to={authorUrl}>{authorName}</Link>
                    )
                  : (
                      <span>{authorName}</span>
                    )}
                {idx < authors.length - 1 && <span>, </span>}
              </React.Fragment>
            )
          })}
        </div>
      )}
      {tagsExists && (
        <div className="inline-flex items-center gap-1">
          <Icon icon="ri:price-tag-3-line" />
          <div className={cn('truncate', 'inline-flex text-center')}>
            {tags.slice(0, 3).map(({ label, description, permalink: tagPermalink }, index) => {
              return (
                <div key={tagPermalink}>
                  {index !== 0 && '/'}
                  <Link
                    to={tagPermalink}
                    className="tag !border-0 p-0.5 text-text hover:text-link"
                  >
                    {label}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
