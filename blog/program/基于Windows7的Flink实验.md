---
slug: flink-on-windows7
title: 基于Windows 7的Flink实验
date: 2024-11-08
authors: wqz
tags: [后端, 大数据, 教程]
keywords: [Flink, Windows 7, 开发环境搭建, IDEA, Scala, Maven, 大数据, 教程]
description: 本文记录了在 Windows 7 系统上搭建 Flink 开发环境并运行第一个 demo 的详细步骤，包括 Flink 的安装配置、IDEA 的配置以及 Scala 和 Maven 插件的安装。
image: https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/1746994826732-e5ef92480b6a1b5e2dfff63cff215a06.png

---

<!-- truncate -->

# 基于Windows 7的Flink实验

------

```plantuml
@startuml
package "Flink 环境" {
  [Flink] --> [安装包]
  [Flink] --> [配置环境变量]
  [Flink] --> [bat 文件]
}

package "开发环境" {
  [IDEA] --> [Scala 插件]
  [IDEA] --> [Maven 插件]
}

[Flink] --> [IDEA]
[IDEA] --> [Scala 环境]
@enduml
```



## 引言

​	工欲善其事必先利器。要想开始学习Flink，首先要在本地机器上运行一个demo。本文以Windows为例，记录本地搭建Flink开发环境并运行第一个demo的过程。

​	Flink是一个开源的流处理和批处理框架，广泛应用于大数据领域。IDEA是JetBrains开发的集成开发环境，本文将介绍如何搭建Flink开发环境。

## Flink运行环境安装

### 下载安装文件

可以从以下网站下载Flink安装文件：
- Apache分发网站：[https://archive.apache.org/dist/flink/](https://archive.apache.org/dist/flink/)
- 国内清华镜像网站：[https://mirrors.tuna.tsinghua.edu.cn/apache/flink/](https://mirrors.tuna.tsinghua.edu.cn/apache/flink/)

下载合适的Flink版本后，解压到指定路径，例如`D:\flink-1.17.2`。

### 配置安装文件

- Apache分发网站支持下载各个版本的Flink，但下载速度较慢。
- 清华镜像速度较快，但只支持下载最近几个大版本。
- ![image-20241108002122485](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002122485.png)

下载的文件为`flink-1.17.2-bin-scala_2.12.tgz`，解压后的路径为`D:\flink-1.17.2`。

![image-20241108002214160](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002214160.png)

![image-20241108002221589](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002221589.png)

![image-20241108002226353](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002226353.png)

## Flink大数据软件安装及配置

### 如何添加环境变量

1. 右键“此电脑” > 属性 > 高级系统设置 > 环境变量。

   ![image-20241108002259602](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002259602.png)

2. 新建变量`FLINK_HOME`和`FLINK_CONF_DIR`，值为Flink的安装路径。

   ![image-20241108002307536](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002307536.png)

3. 将以下内容添加到`Path`变量：
   - `%FLINK_HOME%\bin`

   - `%FLINK_HOME%`

   - `%FLINK_CONF_DIR%`

     ![image-20241108002319376](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002319376.png)



### 新建bat文件

在Flink的`bin`目录中添加`start-cluster.bat`和`flink.bat`文件以便在Windows上运行。

![image-20241108002330239](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002330239.png)

## Idea开发环境安装

### 下载安装IDEA

前往JetBrains官网下载最新版本的IDEA：[https://www.jetbrains.com/idea/download/?section=windows](https://www.jetbrains.com/idea/download/?section=windows)。安装过程可以根据需要选择安装路径及配置。

![image-20241108002354992](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002354992.png)

## Idea大数据相关插件的安装

### 安装插件

#### 配置Scala环境

1. 下载Scala：[https://www.scala-lang.org/download/2.12.15.html](https://www.scala-lang.org/download/2.12.15.html)。

   ![image-20241108002428256](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002428256.png)

2. 在`PATH`中添加Scala的`bin`目录。

   ![image-20241108002445101](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002445101.png)

   ![image-20241108002455610](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002455610.png)

#### IDEA安装Scala插件

1. IDEA中打开“File”菜单 > “Settings”。

2. 搜索“Scala”并安装插件。

   ![image-20241108002512098](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002512098.png)

3. 重启IDEA。

   ![image-20241108002518175](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002518175.png)

#### 安装Maven插件

在“File”菜单 > “Settings”中，搜索“Maven”，选择“Maven Integration”进行安装。

![image-20241108002524050](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002524050.png)

## 利用Idea进行大数据开发及运行

### Flink项目初始化

1. 使用IDEA新建项目。

   ![image-20241108002555725](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002555725.png)

2. 找到`main`文件，点击运行按钮以运行Flink项目。

   ![image-20241108002600387](https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/image-20241108002600387.png)

---
