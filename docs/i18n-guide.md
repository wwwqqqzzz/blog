---
title: 国际化指南
description: 如何为博客添加多语言支持
sidebar_position: 1
---

# 博客国际化指南

## 概述

本博客使用Docusaurus的i18n功能支持多语言。目前支持：
- 中文（zh-CN，默认语言）
- 英文（en）

## 如何添加翻译内容

### 1. 翻译博客文章

博客文章的翻译需要放在对应的`i18n/{locale}/docusaurus-plugin-content-blog/`目录下，保持与原始文章相同的目录结构。

例如，如果有一篇中文文章位于`blog/tech/example.md`，那么它的英文翻译应该放在`i18n/en/docusaurus-plugin-content-blog/tech/example.md`。

**注意**：翻译文件应保持原始文件名不变，即使是中文文件名。

### 2. 翻译页面内容

页面内容的翻译需要放在`i18n/{locale}/docusaurus-plugin-content-pages/`目录中。

### 3. 翻译文档

文档的翻译需要放在`i18n/{locale}/docusaurus-plugin-content-docs/`目录中。

### 4. 翻译UI元素

主题和UI元素的翻译位于`i18n/{locale}/docusaurus-theme-classic/`目录中。

## 批量翻译工作流程

### 使用翻译工具

你可以使用以下工具来辅助翻译：
1. Docusaurus自带的翻译命令：`npm run write-translations`
2. 在线翻译服务如Google翻译、DeepL等
3. AI工具如ChatGPT进行初步翻译，然后手动校正

### 翻译主题标签

使用命令生成可翻译的主题JSON文件：

```bash
npm run write-translations -- --locale en
```

然后编辑`i18n/en/code.json`文件。

## 测试翻译

启动特定语言的开发服务器：

```bash
npm run start -- --locale en
```

或使用已配置的脚本：

```bash
npm run start:en
```

## 提交翻译

1. 确保翻译内容无语法错误
2. 保持原文和译文的格式一致
3. 注意保留原文中的Markdown标记和链接

## 注意事项

1. 文件名保持原样，不需要翻译
2. 保留原始的元数据（frontmatter）结构，只翻译其中的内容
3. 图像路径通常不需要更改，除非你提供了该语言特定的图像

---

如有任何疑问，请联系博客管理员。 