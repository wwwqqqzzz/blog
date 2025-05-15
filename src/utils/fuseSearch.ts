import Fuse from 'fuse.js';
import type { BlogPostData } from '../types/blog';

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
    // 匹配阈值（0-1，越高越宽松）
    threshold: 0.6,
    // 忽略位置，提高模糊匹配能力
    ignoreLocation: true,
    // 不使用 AND 逻辑，任何词匹配即可
    useExtendedSearch: false,
    // 最小匹配字符长度
    minMatchCharLength: 1,
    // 启用模糊搜索
    isCaseSensitive: false,
    // 模糊搜索距离
    distance: 100,
    // 启用模糊搜索
    fuzzy: {
      // 模糊搜索距离
      distance: 3,
    }
  };

  // 检查文章数据
  console.log(`createSearchIndex: 创建索引，文章数量 ${posts.length}`);

  // 检查第一篇文章的数据结构
  if (posts.length > 0) {
    const firstPost = posts[0];
    console.log('createSearchIndex: 第一篇文章数据', {
      title: firstPost.title,
      description: firstPost.description,
      tags: firstPost.tags.map(t => t.label).join(', '),
      source: firstPost.source ? `${firstPost.source.substring(0, 50)}...` : '无'
    });
  }

  // 创建并返回 Fuse 实例
  const fuse = new Fuse(posts, options);
  console.log(`createSearchIndex: 索引创建完成，文档数量 ${fuse['_docs']?.length || 0}`);
  return fuse;
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
    console.log('searchPosts: 查询为空');
    return [];
  }

  console.log(`searchPosts: 开始搜索 "${query}"`);

  try {
    // 检查 fuse 实例是否有效
    if (!fuse || typeof fuse.search !== 'function') {
      console.error('searchPosts: Fuse 实例无效');
      return [];
    }

    // 检查索引中的文档数量
    const docsCount = fuse['_docs']?.length || 0;
    console.log(`searchPosts: 索引中的文档数量 ${docsCount}`);

    // 执行搜索并限制结果数量
    const results = fuse.search(query, { limit });
    console.log(`searchPosts: 找到 ${results.length} 个结果`);

    // 如果有结果，打印第一个结果的详细信息
    if (results.length > 0) {
      console.log('searchPosts: 第一个结果', {
        title: results[0].item.title,
        score: results[0].score,
        matches: results[0].matches?.map(m => m.key)
      });
    }

    return results;
  } catch (error) {
    console.error('searchPosts: 搜索过程中出错', error);
    return [];
  }
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

// 高亮搜索结果中的匹配文本函数已移至 src/components/SearchHighlighter/index.tsx
