# 博客搜索功能问题总结

## 1. 问题概述

我们尝试为博客实现一个可靠的搜索功能，但遇到了持续的技术挑战。尽管尝试了多种方法，搜索功能仍然无法正常工作 - 无论输入什么关键词，都无法找到匹配的文章。

## 2. 尝试的解决方案

### 2.1 Algolia 搜索

**尝试内容**:
- 配置 Algolia DocSearch 与 Docusaurus 集成
- 在 `docusaurus.config.ts` 中设置 Algolia 参数

**遇到的问题**:
- API 密钥权限错误: `Index not allowed with this API key`
- 在中国大陆访问不稳定
- 配置复杂，需要外部服务支持

### 2.2 本地搜索插件 (@easyops-cn/docusaurus-search-local)

**尝试内容**:
- 安装并配置 `@easyops-cn/docusaurus-search-local` 插件
- 设置中文支持和搜索范围

**遇到的问题**:
- 配置验证错误: `"translations" is not allowed`
- 插件文档与实际支持的配置选项不一致
- 启动失败，无法正常运行

### 2.3 自定义 Fuse.js 搜索

**尝试内容**:
- 实现基于 Fuse.js 的客户端搜索
- 创建搜索工具函数和搜索结果组件
- 添加搜索结果高亮显示
- 优化 Fuse.js 配置，使搜索更宽松
- 添加调试日志，诊断问题
- 实现手动搜索作为备选方案

**遇到的问题**:
- 搜索结果始终为空
- 可能的数据获取问题 - 博客文章数据结构与预期不符
- 可能的字段访问问题 - 搜索字段可能不存在或格式不正确
- TypeScript 编译错误 - JSX 语法在 `.ts` 文件中的问题

## 3. 技术挑战分析

### 3.1 数据结构问题

Docusaurus 的数据结构可能与我们的搜索实现预期不符。特别是:
- 博客文章的源内容 (`source` 字段) 可能不可用或格式不一致
- 通过 `usePluginData` 获取的数据可能不完整或结构发生变化

### 3.2 环境兼容性问题

- TypeScript 和 JSX/TSX 的兼容性问题
- Docusaurus 版本与搜索插件的兼容性问题
- 浏览器控制台错误难以诊断

### 3.3 搜索算法问题

- Fuse.js 配置可能不适合我们的数据结构
- 搜索字段的权重和阈值设置可能不合理
- 模糊搜索和精确搜索的平衡难以把握

## 4. 当前状态

目前，我们已经:
1. 禁用了 Algolia 搜索配置，避免 API 密钥错误
2. 移除了本地搜索插件配置，解决启动失败问题
3. 保留了 Fuse.js 搜索实现，但搜索结果仍为空
4. 添加了大量调试日志，以便未来诊断
5. 实现了手动搜索作为备选方案，但仍未解决根本问题

## 5. 建议的后续步骤

### 5.1 短期解决方案

1. **简化搜索功能**:
   - 考虑实现一个非常基础的客户端搜索，只搜索标题和标签
   - 减少依赖外部库，使用原生 JavaScript 实现简单搜索

2. **替代方案**:
   - 考虑使用 Google 自定义搜索 (CSE) 作为临时解决方案
   - 添加一个简单的搜索引导页面，引导用户使用浏览器的页内搜索功能

### 5.2 长期解决方案

1. **重新评估需求**:
   - 明确搜索功能的核心需求和优先级
   - 考虑搜索功能的复杂度与实现难度的平衡

2. **探索其他搜索方案**:
   - 考虑使用 Docusaurus 官方推荐的搜索解决方案
   - 研究其他博客项目的搜索实现方式
   - 考虑使用 Lunr.js 等更简单的搜索库

3. **寻求社区支持**:
   - 在 Docusaurus 社区或论坛寻求帮助
   - 查看是否有其他用户遇到类似问题及其解决方案

## 6. 结论

搜索功能实现遇到了超出预期的技术挑战。建议暂时搁置这个问题，转向博客项目中的其他任务。在积累更多经验或找到更简单的解决方案后，再回来解决搜索功能问题。

在此期间，用户仍然可以通过博客的分类、标签和归档功能浏览内容，或使用浏览器的页内搜索功能 (Ctrl+F) 在当前页面查找内容。

## 7. 代码参考

### 7.1 Algolia 配置示例

```typescript
// docusaurus.config.ts
algolia: {
  appId: 'GV6YN1ODMO',
  apiKey: '50303937b0e4630bec4a20a14e3b7872',
  indexName: 'wangqizhe',
  contextualSearch: true,
  searchParameters: {},
},
```

### 7.2 本地搜索插件配置示例

```typescript
// docusaurus.config.ts
[
  '@easyops-cn/docusaurus-search-local',
  {
    hashed: true,
    language: ['en', 'zh'],
    highlightSearchTermsOnTargetPage: true,
    docsRouteBasePath: ['/docs', '/blog'],
    blogRouteBasePath: ['/blog'],
    docsDir: ['docs', 'blog'],
    blogDir: ['blog'],
    indexDocs: true,
    indexBlog: true,
    indexPages: true,
    removeDefaultStopWordFilter: false,
    removeDefaultStemmer: false,
    searchResultLimits: 8,
    searchResultContextMaxLength: 50
  },
],
```

### 7.3 Fuse.js 配置示例

```typescript
// fuseSearch.ts
const options: Fuse.IFuseOptions<BlogPostData> = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 1 },
    { name: 'tags.label', weight: 0.8 },
    { name: 'source', weight: 0.5 }
  ],
  includeScore: true,
  includeMatches: true,
  threshold: 0.6,
  ignoreLocation: true,
  useExtendedSearch: false,
  minMatchCharLength: 1,
  isCaseSensitive: false,
  distance: 100,
  fuzzy: {
    distance: 3,
  }
};
```

---

此文档总结了我们在实现博客搜索功能过程中的尝试和遇到的问题，可作为未来重新解决此问题时的参考。
