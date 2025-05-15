---
title: Git基础：创建仓库与基本操作
description: 本文详细介绍如何创建Git仓库，以及日常工作中最常用的Git命令和操作流程。
authors: [wqz]
tags: [Git, 版本控制, 教程]
date: 2024-05-21
image: https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop
collection: Git教程
collection_order: 2
---

# Git基础：创建仓库与基本操作

在上一篇文章中，我们了解了Git的基本概念和安装配置。本文将带你学习如何创建Git仓库，以及日常工作中最常用的Git命令和操作流程。

<!-- truncate -->

## 创建Git仓库

创建Git仓库有两种主要方式：初始化新仓库或克隆现有仓库。

### 初始化新仓库

如果你有一个项目文件夹想要用Git进行版本控制，可以在该文件夹中初始化一个新的Git仓库：

```bash
# 进入项目目录
cd /path/to/your/project

# 初始化Git仓库
git init
```

执行`git init`命令后，Git会在当前目录下创建一个`.git`子目录，包含Git仓库所需的所有文件。此时，你的项目已经被Git跟踪，但还没有文件被提交到仓库中。

### 克隆现有仓库

如果你想获取一个已存在的Git仓库的副本，可以使用`git clone`命令：

```bash
# 克隆远程仓库到当前目录
git clone https://github.com/username/repository.git

# 克隆到指定目录
git clone https://github.com/username/repository.git my-project
```

克隆操作会在本地创建一个与远程仓库完全相同的副本，包括所有的文件和提交历史。

## 基本的Git工作流

Git的基本工作流程包括以下几个步骤：

1. 修改文件（在工作目录中）
2. 暂存修改（添加到暂存区）
3. 提交修改（保存到Git仓库）
4. （可选）推送到远程仓库

### 检查文件状态

使用`git status`命令查看工作目录中文件的状态：

```bash
git status
```

这个命令会显示哪些文件被修改了，哪些文件已经暂存，哪些文件未被Git跟踪。

### 跟踪新文件

使用`git add`命令开始跟踪新文件或将修改的文件添加到暂存区：

```bash
# 添加单个文件
git add filename.txt

# 添加多个文件
git add file1.txt file2.txt

# 添加所有.js文件
git add *.js

# 添加当前目录下的所有文件
git add .
```

### 提交更改

使用`git commit`命令将暂存区中的内容提交到仓库：

```bash
# 使用编辑器编写提交信息
git commit

# 直接提供提交信息
git commit -m "Add new feature: user authentication"

# 跳过暂存区，直接提交所有已跟踪文件的修改
git commit -a -m "Fix typos in documentation"
```

### 查看提交历史

使用`git log`命令查看提交历史：

```bash
# 查看提交历史
git log

# 查看简洁的提交历史
git log --oneline

# 查看图形化的提交历史
git log --graph --oneline --all
```

## 撤销操作

Git提供了多种方式来撤销操作。

### 修改最后一次提交

如果你刚刚提交，但发现有些文件忘记添加，或者提交信息写错了，可以使用`--amend`选项：

```bash
# 修改最后一次提交
git commit --amend
```

### 取消暂存的文件

如果你已经将文件添加到暂存区，但想要取消暂存：

```bash
git restore --staged filename.txt
```

### 撤销对文件的修改

如果你想丢弃工作目录中的修改，恢复到最后一次提交的状态：

```bash
git restore filename.txt
```

## 远程仓库操作

### 添加远程仓库

```bash
git remote add origin https://github.com/username/repository.git
```

### 查看远程仓库

```bash
# 查看远程仓库
git remote -v
```

### 从远程仓库获取数据

```bash
# 获取远程仓库数据但不合并
git fetch origin

# 获取并合并远程仓库数据
git pull origin main
```

### 推送到远程仓库

```bash
git push origin main
```

## 分支操作

Git的分支功能是其最强大的特性之一。

### 创建分支

```bash
# 创建新分支
git branch feature-login

# 创建并切换到新分支
git checkout -b feature-login

# 使用新的git switch命令（Git 2.23+）
git switch -c feature-login
```

### 切换分支

```bash
# 使用checkout切换分支
git checkout main

# 使用switch切换分支（Git 2.23+）
git switch main
```

### 合并分支

```bash
# 切换到目标分支
git checkout main

# 合并指定分支到当前分支
git merge feature-login
```

### 删除分支

```bash
# 删除已合并的分支
git branch -d feature-login

# 强制删除未合并的分支
git branch -D feature-login
```

## 总结

本文介绍了Git的基本操作，包括创建仓库、基本工作流、撤销操作、远程仓库操作和分支管理。掌握这些基础命令后，你就可以使用Git进行日常的版本控制工作了。在下一篇文章中，我们将深入探讨Git的分支管理策略和工作流模式。

## 参考资料

- [Git官方文档](https://git-scm.com/doc)
- [Pro Git书籍](https://git-scm.com/book/zh/v2)
- [GitHub Git Cheat Sheet](https://github.github.com/training-kit/)
