import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import { transformBlogItems } from '@site/src/utils/blog';
import type { BlogPostData } from '@site/src/types/blog';
import { createSearchIndex, searchPosts, extractMatchSnippet, type FuseSearchResultItem } from '@site/src/utils/fuseSearch';
import { SearchHighlighter } from '@site/src/components/SearchHighlighter';
import { Icon } from '@iconify/react';
import Link from '@docusaurus/Link';
import { cn } from '@site/src/lib/utils';

/**
 * 博客搜索结果组件
 */
export function BlogSearchResults(): React.ReactNode {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';

  const [searchResults, setSearchResults] = useState<FuseSearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 获取所有博客文章数据
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    blogPosts?: { content: any }[]
  } | undefined;

  // 转换为统一格式
  const allPosts: BlogPostData[] = useMemo(() => {
    if (!blogData?.blogPosts || !Array.isArray(blogData.blogPosts)) {
      console.error('BlogSearchResults: 无法获取博客数据');
      return [];
    }

    console.log('BlogSearchResults: 获取到博客数据', blogData.blogPosts.length);

    // 检查博客数据结构
    if (blogData.blogPosts.length > 0) {
      console.log('BlogSearchResults: 博客数据示例', blogData.blogPosts[0]);
    }

    const transformedPosts = transformBlogItems(blogData.blogPosts.map(post => ({ content: post.content })));
    console.log('BlogSearchResults: 转换后的博客数据', transformedPosts.length);

    // 检查转换后的数据结构
    if (transformedPosts.length > 0) {
      console.log('BlogSearchResults: 转换后的博客数据示例', {
        title: transformedPosts[0].title,
        description: transformedPosts[0].description,
        tags: transformedPosts[0].tags,
        source: transformedPosts[0].source?.substring(0, 100) + '...' // 只显示前100个字符
      });
    }

    return transformedPosts;
  }, [blogData?.blogPosts]);

  // 创建 Fuse.js 搜索索引
  const searchIndex = useMemo(() => {
    return createSearchIndex(allPosts);
  }, [allPosts]);

  // 执行搜索
  useEffect(() => {
    if (!searchQuery.trim() || !searchIndex) {
      console.log('BlogSearchResults: 搜索查询为空或搜索索引不存在');
      setSearchResults([]);
      return;
    }

    console.log(`BlogSearchResults: 开始搜索 "${searchQuery}"`);
    console.log('BlogSearchResults: 搜索索引包含文章数量', allPosts.length);

    setIsSearching(true);

    // 使用 setTimeout 避免阻塞 UI
    setTimeout(() => {
      try {
        const results = searchPosts(searchIndex, searchQuery, 20);
        console.log(`BlogSearchResults: 搜索结果数量`, results.length);

        // 如果没有结果，打印更多调试信息
        if (results.length === 0) {
          console.log('BlogSearchResults: 没有找到匹配的文章');
          console.log('BlogSearchResults: 尝试手动搜索第一篇文章');

          // 手动检查第一篇文章是否包含搜索词
          if (allPosts.length > 0) {
            const firstPost = allPosts[0];
            console.log('BlogSearchResults: 第一篇文章标题', firstPost.title);
            console.log('BlogSearchResults: 第一篇文章描述', firstPost.description);
            console.log('BlogSearchResults: 第一篇文章标签', firstPost.tags.map(t => t.label).join(', '));

            const titleMatch = firstPost.title.toLowerCase().includes(searchQuery.toLowerCase());
            const descMatch = firstPost.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const tagMatch = firstPost.tags.some(tag => tag.label.toLowerCase().includes(searchQuery.toLowerCase()));
            const contentMatch = firstPost.source?.toLowerCase().includes(searchQuery.toLowerCase());

            console.log('BlogSearchResults: 手动匹配结果', {
              titleMatch,
              descMatch,
              tagMatch,
              contentMatch
            });
          }
        } else {
          // 打印第一个结果的详细信息
          console.log('BlogSearchResults: 第一个搜索结果', {
            title: results[0].item.title,
            score: results[0].score,
            matches: results[0].matches
          });
        }

        setSearchResults(results);
      } catch (error) {
        console.error('BlogSearchResults: 搜索过程中出错', error);
      } finally {
        setIsSearching(false);
      }
    }, 0);
  }, [searchQuery, searchIndex, allPosts]);

  // 手动搜索函数，用于调试
  const manualSearch = () => {
    if (!allPosts.length) {
      console.log('手动搜索: 没有文章数据');
      return;
    }

    console.log(`手动搜索: 开始搜索 "${searchQuery}" 在 ${allPosts.length} 篇文章中`);

    // 简单的字符串匹配搜索
    const results = allPosts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = post.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = post.tags.some(tag => tag.label.toLowerCase().includes(searchQuery.toLowerCase()));
      const contentMatch = post.source?.toLowerCase().includes(searchQuery.toLowerCase());

      return titleMatch || descMatch || tagMatch || contentMatch;
    });

    console.log(`手动搜索: 找到 ${results.length} 个结果`);

    if (results.length > 0) {
      console.log('手动搜索: 第一个结果', {
        title: results[0].title,
        description: results[0].description?.substring(0, 50) + '...',
        tags: results[0].tags.map(t => t.label).join(', '),
        source: results[0].source ? results[0].source.substring(0, 50) + '...' : '无'
      });
    }
  };

  // 如果没有搜索查询，不显示任何内容
  if (!searchQuery.trim()) {
    return null;
  }

  // 调用手动搜索函数（仅用于调试）
  React.useEffect(() => {
    if (searchQuery && allPosts.length > 0) {
      manualSearch();
    }
  }, [searchQuery, allPosts.length]);

  return (
    <div className="mb-10">
      <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          搜索结果: "{searchQuery}"
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          找到 {searchResults.length} 篇相关文章
        </p>
      </div>

      {isSearching ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Icon icon="ri:loader-2-line" className="animate-spin text-2xl text-primary-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">正在搜索...</span>
          </div>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-6">
          {searchResults.map((result) => {
            const post = result.item;
            const snippets = extractMatchSnippet(result);

            return (
              <div
                key={post.link}
                className="mb-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <Link
                  to={post.link}
                  className="block hover:no-underline"
                >
                  <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400">
                    <SearchHighlighter text={post.title} query={searchQuery} />
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Icon icon="ri:calendar-line" className="text-xs" />
                      <span>{post.date}</span>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Icon icon="ri:price-tag-3-line" className="text-xs" />
                        <span>
                          {post.tags.slice(0, 3).map(tag => tag.label).join(', ')}
                          {post.tags.length > 3 && '...'}
                        </span>
                      </div>
                    )}

                    {post.collection && (
                      <div className="flex items-center gap-1">
                        <Icon icon="ri:folder-line" className="text-xs" />
                        <span>{post.collection}</span>
                      </div>
                    )}

                    {/* 显示相关度 */}
                    {result.score !== undefined && (
                      <div className="flex items-center gap-1">
                        <Icon icon="ri:star-line" className="text-xs" />
                        <span>相关度: {Math.round((1 - result.score) * 100)}%</span>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {snippets.length > 0 && snippets[0].field !== 'tags'
                      ? <SearchHighlighter text={snippets[0].text} query={searchQuery} />
                      : <SearchHighlighter text={post.description} query={searchQuery} />}
                  </p>

                  {/* 显示匹配位置 */}
                  {snippets.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      匹配: {snippets.map(s => s.field).join(', ')}
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="my-10 rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <Icon icon="ri:search-line" className="mx-auto mb-4 text-4xl text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            没有找到匹配的文章
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            尝试使用不同的关键词
          </p>
          <button
            className="mt-4 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
            onClick={() => {
              // 返回博客页面
              window.location.href = '/blog';
            }}
          >
            查看所有文章
          </button>
        </div>
      )}
    </div>
  );
}
