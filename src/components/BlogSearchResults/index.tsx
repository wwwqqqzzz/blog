import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from '@docusaurus/router';
import { usePluginData } from '@docusaurus/useGlobalData';
import { transformBlogItems } from '@site/src/utils/blog';
import type { BlogPostData } from '@site/src/types/blog';
import { createSearchIndex, extractMatchSnippet, type FuseSearchResultItem } from '@site/src/utils/fuseSearch';
import { SearchHighlighter } from '@site/src/components/SearchHighlighter';
import { Icon } from '@iconify/react';
import Link from '@docusaurus/Link';
// 导入 Fuse 类型
import Fuse from 'fuse.js';

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

  // 执行搜索 - 使用手动搜索替代 Fuse.js
  useEffect(() => {
    if (!searchQuery.trim() || !allPosts.length) {
      console.log('BlogSearchResults: 搜索查询为空或没有文章数据');
      setSearchResults([]);
      return;
    }

    console.log(`BlogSearchResults: 开始搜索 "${searchQuery}"`);
    console.log('BlogSearchResults: 文章数量', allPosts.length);

    setIsSearching(true);

    // 使用 setTimeout 避免阻塞 UI
    setTimeout(() => {
      try {
        // 简单的字符串匹配搜索
        const filteredPosts = allPosts.filter(post => {
          const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
          const descMatch = post.description?.toLowerCase().includes(searchQuery.toLowerCase());
          const tagMatch = post.tags.some(tag => tag.label.toLowerCase().includes(searchQuery.toLowerCase()));
          const contentMatch = post.source?.toLowerCase().includes(searchQuery.toLowerCase());

          return titleMatch || descMatch || tagMatch || contentMatch;
        });

        // 转换为 FuseSearchResultItem 格式
        const results: FuseSearchResultItem[] = filteredPosts.map(post => {
          // 确定匹配的字段
          const matchedFields: string[] = [];
          const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
          const descMatch = post.description?.toLowerCase().includes(searchQuery.toLowerCase());
          const tagMatch = post.tags.some(tag => tag.label.toLowerCase().includes(searchQuery.toLowerCase()));
          const contentMatch = post.source?.toLowerCase().includes(searchQuery.toLowerCase());

          if (titleMatch) matchedFields.push('title');
          if (descMatch) matchedFields.push('description');
          if (tagMatch) matchedFields.push('tags');
          if (contentMatch) matchedFields.push('content');

          // 创建匹配信息
          const matches: Fuse.FuseResultMatch[] = [];

          if (titleMatch) {
            matches.push({
              key: 'title',
              value: post.title,
              indices: [[0, post.title.length - 1]]
            });
          }

          if (descMatch && post.description) {
            matches.push({
              key: 'description',
              value: post.description,
              indices: [[0, post.description.length - 1]]
            });
          }

          if (tagMatch) {
            const matchedTag = post.tags.find(tag =>
              tag.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (matchedTag) {
              matches.push({
                key: 'tags.label',
                value: matchedTag.label,
                indices: [[0, matchedTag.label.length - 1]]
              });
            }
          }

          if (contentMatch && post.source) {
            matches.push({
              key: 'source',
              value: post.source,
              indices: [[0, Math.min(post.source.length - 1, 100)]]
            });
          }

          return {
            item: post,
            refIndex: 0,
            score: 0.1, // 固定分数
            matches
          };
        });

        console.log(`BlogSearchResults: 搜索结果数量`, results.length);

        if (results.length > 0) {
          // 打印第一个结果的详细信息
          console.log('BlogSearchResults: 第一个搜索结果', {
            title: results[0].item.title,
            matches: results[0].matches?.map(m => m.key)
          });
        } else {
          console.log('BlogSearchResults: 没有找到匹配的文章');
        }

        setSearchResults(results);
      } catch (error) {
        console.error('BlogSearchResults: 搜索过程中出错', error);
      } finally {
        setIsSearching(false);
      }
    }, 0);
  }, [searchQuery, allPosts]);

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
                      ? (
                        <SearchHighlighter text={snippets[0].text} query={searchQuery} />
                      )
                      : (
                        <SearchHighlighter text={post.description} query={searchQuery} />
                      )}
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
