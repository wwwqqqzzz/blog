import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import { cn } from "@site/src/lib/utils";
import BackToTopButton from "@theme/BackToTopButton";
import type { Props } from "@theme/BlogListPage";
import BlogListPaginator from "@theme/BlogListPaginator";

import SearchMetadata from "@theme/SearchMetadata";

import Translate from "@docusaurus/Translate";
import { Icon } from "@iconify/react";
import { type ViewType, useViewType } from "@site/src/hooks/useViewType";
import BlogPostGridItems from "../BlogPostGridItems";
import BlogPostTimelineItems from "../BlogPostTimelineItems";
import MyLayout from "../MyLayout";
import { useLocation, useHistory } from "@docusaurus/router";
import {
  transformBlogItems,
  extractAllTags,
  filterPostsByTag,
} from "@site/src/utils/blog";
import FeaturedArticles from "@site/src/components/FeaturedArticles";
import PinnedArticles from "@site/src/components/PinnedArticles";
import SimplifiedTagsFilter from "@site/src/components/SimplifiedTagsFilter";
import BlogSortControls from "@site/src/components/blog/BlogSortControls";
import { getArticleViewData } from "@site/src/utils/article-view-tracker";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { BlogTag } from "@site/src/types/blog";

// 添加标签类型定义
interface TagType {
  label: string;
  permalink: string;
}

function BlogListPageMetadata(props: Props): React.ReactNode {
  const { metadata } = props;
  const { blogDescription } = metadata;

  return (
    <>
      <PageMetadata title="博客" description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function ViewTypeSwitch({
  viewType,
  toggleViewType,
}: {
  viewType: ViewType;
  toggleViewType: (viewType: ViewType) => void;
}): React.ReactNode {
  return (
    <div className="mb-6 flex items-center justify-center space-x-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleViewType("timeline")}
        className={cn(
          "flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
          viewType === "timeline"
            ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-primary-400"
            : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800",
        )}
      >
        <Icon icon="ph:clock-countdown" width="18" height="18" />
        <span>时间线视图</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleViewType("grid")}
        className={cn(
          "flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
          viewType === "grid"
            ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-primary-400"
            : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800",
        )}
      >
        <Icon icon="ph:grid-four" width="18" height="18" />
        <span>网格视图</span>
      </motion.button>
    </div>
  );
}

function BlogListPageContent(props: Props) {
  const { metadata, items } = props;
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const currentTag = queryParams.get("tag") || "";
  const sortBy = queryParams.get("sort") || "newest";

  const { viewType, toggleViewType } = useViewType();
  const isGridView = viewType === "grid";
  const isTimelineView = viewType === "timeline";

  // 转换和处理博客数据
  const blogItems = transformBlogItems(items);
  const allTags = extractAllTags(blogItems);

  // 根据标签筛选的文章
  const [filteredItems, setFilteredItems] = useState(items);
  const [sortedItems, setSortedItems] = useState(items);

  // 获取文章阅读数据（用于热度排序）- 使用 state 避免无限重新渲染
  const [viewData, setViewData] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewData(getArticleViewData());
    }
  }, []);

  // 当标签筛选变化时，更新筛选后的文章列表
  useEffect(() => {
    let currentItems = items;

    // 如果有标签筛选
    if (currentTag) {
      const filteredPosts = filterPostsByTag(blogItems, currentTag);
      currentItems = items.filter((item) => {
        const { metadata } = item.content;
        return filteredPosts.some((post) => post.link === metadata.permalink);
      });
    }

    setFilteredItems(currentItems);
  }, [currentTag, items, blogItems]);

  // 当筛选结果或排序方式变化时，排序文章
  useEffect(() => {
    // 过滤掉置顶文章，因为它们已经在顶部单独显示了
    const nonPinnedItems = filteredItems.filter(
      (item) => item.content.frontMatter?.pinned !== true,
    );
    const itemsToSort = [...nonPinnedItems];

    // 应用不同的排序方式
    switch (sortBy) {
      case "newest":
        itemsToSort.sort((a, b) => {
          const dateA = new Date(a.content.metadata.date);
          const dateB = new Date(b.content.metadata.date);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case "oldest":
        itemsToSort.sort((a, b) => {
          const dateA = new Date(a.content.metadata.date);
          const dateB = new Date(b.content.metadata.date);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case "popular":
        itemsToSort.sort((a, b) => {
          const viewsA = viewData[a.content.metadata.permalink] || 0;
          const viewsB = viewData[b.content.metadata.permalink] || 0;
          return viewsB - viewsA;
        });
        break;
      case "az":
        itemsToSort.sort((a, b) => {
          return a.content.metadata.title.localeCompare(
            b.content.metadata.title,
          );
        });
        break;
      case "za":
        itemsToSort.sort((a, b) => {
          return b.content.metadata.title.localeCompare(
            a.content.metadata.title,
          );
        });
        break;
      default:
        // 默认按最新发布排序
        itemsToSort.sort((a, b) => {
          const dateA = new Date(a.content.metadata.date);
          const dateB = new Date(b.content.metadata.date);
          return dateB.getTime() - dateA.getTime();
        });
    }

    // 更新排序后的结果
    setSortedItems(itemsToSort);
  }, [filteredItems, sortBy, viewData]);

  return (
    <MyLayout>
      <div className="mb-12 border-b border-black/10 dark:border-white/10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter text-slate-900 dark:text-white mb-2 font-['MiSans'] select-none">
              THE JOURNAL
            </h1>
            <p className="text-xl md:text-2xl font-mono text-[#10B981] tracking-widest uppercase">
              Digital Garden & Archives
            </p>
          </div>
          <div className="hidden md:block text-right max-w-md text-sm text-slate-500 dark:text-slate-400 font-mono font-bold shrink-0 whitespace-nowrap">
            记录代码、设计以及某些时刻的灵光一闪。
          </div>
        </div>
      </div>

      {/* 置顶文章区域 */}
      <PinnedArticles items={blogItems} currentTag={currentTag} />

      {/* 标签筛选器 */}
      <SimplifiedTagsFilter tags={allTags} maxTags={8} />

      {/* 精选文章区域 - 仅在没有标签筛选时显示 */}
      {!currentTag && <FeaturedArticles items={blogItems} />}

      {/* 排序和过滤控制 */}
      <BlogSortControls
        totalCount={sortedItems.length}
        currentTag={currentTag}
      />

      {/* 博客文章列表 - 强制使用 Journal View (原 Timeline) */}
      <div className="row">
        <div className="col col--12">
          {sortedItems.length > 0 ? (
            <>
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <BlogPostTimelineItems items={sortedItems} />
              </motion.div>
              <BlogListPaginator metadata={metadata} />
            </>
          ) : (
            <div className="my-10 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                没有找到匹配的文章
              </p>
              <button
                className="mt-4 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                onClick={() => {
                  // 使用 React Router 的 history 对象
                  const params = new URLSearchParams();
                  // 只保留排序参数
                  const sortValue = queryParams.get("sort");
                  if (sortValue) {
                    params.set("sort", sortValue);
                  }
                  // 使用 history.push 导航
                  history.push({
                    pathname: location.pathname,
                    search: params.toString(),
                  });
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
  );
}

export default function BlogListPage(props: Props): React.ReactNode {
  return (
    <HtmlClassNameProvider
      className={cn(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
