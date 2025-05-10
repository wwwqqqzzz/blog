---
title: 置顶文章示例
date: 2024-05-20
tags: [博客, 置顶, 示例]
authors: [wqz]
image: https://source.unsplash.com/random/1200x630/?tech
pinned: true
---

# 置顶文章功能示例

这是一篇用于展示置顶文章功能的示例文章。通过在文章的 frontmatter 中添加 `pinned: true`，可以将文章置顶显示在博客列表的最前面。

## 置顶文章的特点

1. 在博客列表中始终显示在最前面
2. 有明显的视觉标识（置顶图标）
3. 在同一组置顶文章中仍然保持原有的排序逻辑

## 如何使用置顶功能

只需在文章的 frontmatter 中添加以下字段：

```yaml
pinned: true
```

这样，无论用户选择什么排序方式，该文章都会显示在列表的最前面。

## 适用场景

置顶功能适用于以下场景：

- 重要公告或通知
- 精选内容或推荐阅读
- 系列文章的导读
- 热门或经典文章

## 代码实现

置顶功能的实现主要包括以下几个部分：

1. 在文章的 frontmatter 中添加 `pinned` 字段
2. 修改博客文章排序逻辑，将置顶文章排在前面
3. 为置顶文章添加视觉标识
4. 确保置顶文章之间保持原有的排序逻辑

```jsx
// 排序逻辑示例
const sortedPosts = [...posts].sort((a, b) => {
  // 先按置顶状态排序
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;

  // 如果置顶状态相同，则按日期排序
  return new Date(b.date) - new Date(a.date);
});
```

希望这个功能能够帮助您更好地组织和展示博客内容！
