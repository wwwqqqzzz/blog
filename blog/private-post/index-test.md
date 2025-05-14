---
title: 测试私密博客
description: 这是一篇测试私密博客功能的文章
authors: [wqz]
tags: [private, test]
date: 2024-11-15
private: true
password: "test_password"
passwordHint: "这是测试文章的密码提示，密码是'test_password'"
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747251573113-9d18f168d980b55ecb54dff95b24edfb.png
---

# 测试私密博客功能

这是一篇用于测试私密博客功能是否正常工作的文章。如果你能看到这篇文章，说明私密博客功能已经修复并正常工作了！

> 注意：这篇文章使用了自定义密码 "test_password"，而不是默认密码。

## 私密博客的用途

私密博客可以用于：

1. 记录个人日记和感想
2. 保存未公开的项目笔记
3. 存储临时草稿和想法
4. 记录个人敏感信息

## 技术实现

私密博客功能通过以下技术实现：

- 在文章前置元数据中添加 `private: true` 标记
- 使用自定义的 `PasswordProtection` 组件进行密码保护
- 通过 Docusaurus 的全局数据 API 获取和筛选私密文章
