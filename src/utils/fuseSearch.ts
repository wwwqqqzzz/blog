import Fuse from 'fuse.js';
import type { BlogPostData } from '../types/blog';
import React, { Fragment } from 'react';

/**
 * 搜索结果项
 */
export interface FuseSearchResultItem {
  /**
   * 匹配的文章
   */
  item: BlogPostData;
  /**
   * 匹配分数（越低越相关）
   */
  score?: number;
  /**
   * 匹配的索引
   */
  refIndex: number;
  /**
   * 匹配的字段和位置
   */
  matches?: readonly Fuse.FuseResultMatch[];
}

/**
 * 创建 Fuse.js 搜索索引
 * @param posts 博客文章数据
 * @returns Fuse 实例
 */
export function createSearchIndex(posts: BlogPostData[]): Fuse<BlogPostData> {
  // 配置 Fuse.js 选项
  const options: Fuse.IFuseOptions<BlogPostData> = {
    // 搜索字段及其权重
    keys: [
      { name: 'title', weight: 2 },      // 标题权重最高
      { name: 'description', weight: 1 }, // 描述权重次之
      { name: 'tags.label', weight: 0.8 }, // 标签权重再次
      { name: 'source', weight: 0.5 }    // 内容权重最低
    ],
    // 包含匹配分数
    includeScore: true,
    // 包含匹配位置信息
    includeMatches: true,
    // 匹配阈值（0-1，越低越精确）
    threshold: 0.4,
    // 忽略位置，提高模糊匹配能力
    ignoreLocation: true,
    // 使用 AND 逻辑，所有词都必须匹配
    useExtendedSearch: true,
    // 最小匹配字符长度
    minMatchCharLength: 2
  };

  // 创建并返回 Fuse 实例
  return new Fuse(posts, options);
}

/**
 * 执行搜索
 * @param fuse Fuse 实例
 * @param query 搜索查询
 * @param limit 结果数量限制
 * @returns 搜索结果
 */
export function searchPosts(
  fuse: Fuse<BlogPostData>,
  query: string,
  limit: number = 10
): FuseSearchResultItem[] {
  // 如果查询为空，返回空数组
  if (!query || !query.trim()) {
    return [];
  }

  // 执行搜索并限制结果数量
  return fuse.search(query, { limit });
}

/**
 * 从搜索结果中提取匹配片段
 * @param result 搜索结果项
 * @param maxLength 最大片段长度
 * @returns 匹配片段
 */
export function extractMatchSnippet(
  result: FuseSearchResultItem,
  maxLength: number = 150
): { field: string; text: string }[] {
  const snippets: { field: string; text: string }[] = [];

  // 如果没有匹配信息，返回空数组
  if (!result.matches || result.matches.length === 0) {
    return snippets;
  }

  // 处理每个匹配字段
  result.matches.forEach(match => {
    const { key, value, indices } = match;

    // 如果没有值或索引，跳过
    if (!value || !indices || indices.length === 0) {
      return;
    }

    // 获取字段名称
    let fieldName = String(key);
    if (fieldName === 'tags.label') {
      fieldName = 'tags';
    }

    // 如果是标签，直接使用匹配的标签作为片段
    if (fieldName === 'tags') {
      snippets.push({
        field: 'tags',
        text: value
      });
      return;
    }

    // 对于其他字段，提取上下文片段
    const firstMatch = indices[0];
    const [start, end] = firstMatch;

    // 计算片段的起始和结束位置
    const snippetStart = Math.max(0, start - 30);
    const snippetEnd = Math.min(value.length, end + 100);

    // 提取片段
    let snippet = value.substring(snippetStart, snippetEnd);

    // 添加省略号
    if (snippetStart > 0) {
      snippet = '...' + snippet;
    }
    if (snippetEnd < value.length) {
      snippet = snippet + '...';
    }

    // 添加到片段列表
    snippets.push({
      field: fieldName,
      text: snippet
    });
  });

  return snippets;
}

/**
 * 高亮搜索结果中的匹配文本
 * @param text 原始文本
 * @param query 搜索查询
 * @returns 高亮后的JSX元素
 */
export function highlightSearchMatch(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;

  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);

  if (queryTerms.length === 0) return text;

  // 创建正则表达式匹配所有查询词
  const regex = new RegExp(`(${queryTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

  // 分割文本
  const parts = text.split(regex);

  return (
    <Fragment>
      {parts.map((part, index) => {
        const isMatch = queryTerms.some(term => part.toLowerCase() === term);
        return isMatch ? (
          <mark key={index} className="rounded bg-primary-100 px-1 text-primary-900 dark:bg-primary-900 dark:text-primary-100">
            {part}
          </mark>
        ) : part;
      })}
    </Fragment>
  );
}
