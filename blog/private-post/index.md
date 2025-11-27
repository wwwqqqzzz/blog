---
title: 私密博客示例
description: 这是一篇只有输入正确密码才能看到的私密博客文章
authors: [wqz]
tags: [private]
date: 2024-05-15T10:00
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1747251691136-899503aa5a8448660b7493714fa305b2.png
private: true
password: "private_post_password"
passwordHint: "这是第一篇私密博客的密码提示，密码是'private_post_password'"
---

# 这是一篇私密博客

如果你能看到这篇文章，说明你已经成功通过了密码验证！

<h2 id="何时使用私密博客">何时使用私密博客</h2>

私密博客适用于以下场景：

1. 个人日记和感悟
2. 未公开的项目笔记
3. 临时草稿和想法收集
4. 个人敏感信息记录

<h2 id="如何创建私密博客">如何创建私密博客</h2>

只需要在博客文章的前置元数据中添加 `private: true` 标记即可：

```markdown
---
title: 私密博客示例
description: 这是一篇只有输入正确密码才能看到的私密博客文章
authors: [wqz]
tags: [private]
date: 2024-05-15T10:00
private: true
password: "my_custom_password"  # 可选，为此文章设置独立密码
---
```

然后这篇文章将只能通过"私密博客"页面访问，并且需要输入正确的密码才能查看。

<h3 id="独立密码功能">独立密码功能</h3>

每篇私密博客可以设置自己的独立密码，这样不同的私密博客可以有不同的访问权限。如果不设置独立密码，将使用系统默认密码（123456）。

> 注意：这种保护机制是基于前端实现的，适合个人使用，不适合存储高度敏感的信息。
