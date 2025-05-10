---
title: 另一篇置顶文章
date: 2024-05-18
tags: [博客, 置顶, 示例]
authors: [wqz]
image: https://source.unsplash.com/random/1200x630/?coding
pinned: true
---

# 另一篇置顶文章

这是第二篇置顶文章示例，用于测试多篇置顶文章的排序功能。在博客列表中，置顶文章会按照日期排序显示在最前面。

## 多篇置顶文章的排序

当有多篇置顶文章时，它们会按照您选择的排序方式（如日期、标题等）在置顶区域内排序。例如，如果您选择按日期降序排序，则最新的置顶文章会显示在最前面。

## 置顶文章的视觉标识

每篇置顶文章都会有明显的视觉标识，如置顶图标，让用户能够轻松识别这些重要内容。

## 代码示例

以下是一个简单的 React 组件示例，展示如何在列表中突出显示置顶项：

```jsx
function ItemList({ items }) {
  // 将置顶项和非置顶项分开
  const pinnedItems = items.filter(item => item.pinned);
  const regularItems = items.filter(item => !item.pinned);
  
  // 对每组分别排序
  const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);
  pinnedItems.sort(sortByDate);
  regularItems.sort(sortByDate);
  
  // 合并结果
  const sortedItems = [...pinnedItems, ...regularItems];
  
  return (
    <div className="item-list">
      {sortedItems.map(item => (
        <div key={item.id} className={`item ${item.pinned ? 'pinned' : ''}`}>
          {item.pinned && <span className="pin-icon">📌</span>}
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
```

希望这个示例能帮助您理解置顶功能的实现和使用！
