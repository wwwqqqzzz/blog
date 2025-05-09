import { cn } from '@site/src/lib/utils'
import BlogSidebar from '@theme/BlogSidebar'
import Layout from '@theme/Layout'
import EnhancedSidebar from '@site/src/components/blog/EnhancedSidebar'
import React from 'react'

import type { Props } from '@theme/BlogLayout'

export default function BlogLayout(props: Props): React.ReactElement {
  const { sidebar, toc, children, ...layoutProps } = props
  const hasSidebar = sidebar && sidebar.items.length > 0

  return (
    <Layout {...layoutProps}>
      <div className="margin-vert--md container">
        <div className="row">
          <BlogSidebar sidebar={sidebar} />
          <main
            className={cn('col', {
              'col--7': hasSidebar && toc,
              'col--8': hasSidebar && !toc,
              'col--7 col--offset-1': !hasSidebar && toc,
              'col--8 col--offset-2': !hasSidebar && !toc,
            })}
            itemScope
            itemType="http://schema.org/Blog"
          >
            {children}
          </main>
          {toc && <div className="col col--2 px-0.5">{toc}</div>}

          {/* 右侧增强侧边栏 */}
          {!toc && (
            <div className="col col--2">
              <EnhancedSidebar />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
