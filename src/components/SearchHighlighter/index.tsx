import React from 'react';

/**
 * 高亮搜索结果中的匹配文本
 * @param text 原始文本
 * @param query 搜索查询
 * @returns 高亮后的JSX元素
 */
export function SearchHighlighter({
  text,
  query,
}: {
  text: string;
  query: string;
}): React.ReactNode {
  if (!query || !text) return text;
  
  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);
  
  if (queryTerms.length === 0) return text;
  
  // 创建正则表达式匹配所有查询词
  const regex = new RegExp(`(${queryTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  
  // 分割文本
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        const isMatch = queryTerms.some(term => part.toLowerCase() === term);
        return isMatch ? (
          <mark key={index} className="rounded bg-primary-100 px-1 text-primary-900 dark:bg-primary-900 dark:text-primary-100">
            {part}
          </mark>
        ) : part;
      })}
    </>
  );
}
