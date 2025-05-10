import React from 'react'
import Layout from '@theme/Layout'
import useGlobalData from '@docusaurus/useGlobalData'
import Link from '@docusaurus/Link'
import styles from './private.module.css'

interface BlogPost {
  id: string
  metadata: {
    permalink: string
    title: string
    date: string
    description?: string
    frontMatter: {
      private?: boolean
      password?: string
      passwordHint?: string
      [key: string]: any
    }
    [key: string]: any
  }
}

export default function PrivateBlogPage() {
  // 尝试获取博客数据
  let privateBlogs: BlogPost[] = []
  try {
    const globalData = useGlobalData()
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore - 忽略类型检查，因为Docusaurus API结构可能会变化
    /* eslint-enable @typescript-eslint/ban-ts-comment */
    const blogPluginData = globalData['docusaurus-plugin-content-blog']?.default

    if (blogPluginData?.blogPosts) {
      // 调试
      console.log('找到博客文章总数:', blogPluginData.blogPosts.length)

      // 筛选带有 private: true 标记的文章
      privateBlogs = (blogPluginData.blogPosts as BlogPost[]).filter(
        blog => blog.metadata?.frontMatter?.private === true,
      )

      console.log('找到私密文章数:', privateBlogs.length)
    }
    else {
      console.log('未找到博客文章数据')
    }
  }
  catch (error) {
    console.error('获取博客数据失败:', error)
  }

  return (
    <Layout title="私密博客" description="个人私密内容">
      <div className="main-wrapper">
        <div className={styles.privatePageHeader}>
          <h1>私密博客</h1>
          <p>此页面展示所有标记为私密的博客文章，每篇文章可以设置独立密码</p>
        </div>

        <main className="padding-top--md container">
          <div className={styles.blogList}>
            {privateBlogs.length > 0
              ? (
                  privateBlogs.map(blog => (
                    <div key={blog.id} className={styles.blogItem}>
                      <Link to={blog.metadata.permalink} className={styles.blogLink}>
                        <h2 className={styles.blogTitle}>{blog.metadata.title}</h2>
                        {blog.metadata.frontMatter.password
                          ? (
                              <span className={styles.passwordProtectedBadge} title="此文章使用自定义密码保护">
                                🔒 自定义密码
                              </span>
                            )
                          : (
                              <span className={styles.passwordProtectedBadge} title="此文章使用默认密码保护">
                                🔑 默认密码
                              </span>
                            )}
                      </Link>
                      <p className={styles.blogDate}>
                        {new Date(blog.metadata.date).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {blog.metadata.description && (
                        <p className={styles.blogExcerpt}>{blog.metadata.description}</p>
                      )}
                      {blog.metadata.frontMatter.tags && blog.metadata.frontMatter.tags.length > 0 && (
                        <div className={styles.tagContainer}>
                          {blog.metadata.frontMatter.tags.map((tag: string | { label: string }, idx: number) => (
                            <span key={idx} className={styles.tag}>
                              {typeof tag === 'string' ? tag : tag.label}
                            </span>
                          ))}
                        </div>
                      )}
                      {blog.metadata.frontMatter.passwordHint && (
                        <div className={styles.passwordHintPreview}>
                          <span>💡 密码提示:</span>
                          {' '}
                          {blog.metadata.frontMatter.passwordHint}
                        </div>
                      )}
                    </div>
                  ))
                )
              : (
                  <div className={styles.emptyState}>
                    <h3>暂无私密文章</h3>
                    <p className={styles.emptyStateHint}>
                      要创建私密文章，请按照以下步骤操作:
                    </p>
                    <ol className={styles.instructionsList}>
                      <li>
                        在
                        <code>blog</code>
                        {' '}
                        目录下创建新文章
                      </li>
                      <li>
                        在文章前置元数据中添加
                        {' '}
                        <code>private: true</code>
                        {' '}
                        标记:
                        <pre className={styles.codeBlock}>
                          {`---
title: 私密文章标题
description: 私密文章描述
authors: [wqz]  <!-- 使用有效的作者ID -->
tags: [private, 其他标签]
date: ${new Date().toISOString().split('T')[0]}
private: true  <!-- 此标记使文章变为私密 -->
password: "自定义密码"  <!-- 可选，设置独立密码 -->
passwordHint: "密码提示信息"  <!-- 可选，设置密码提示 -->
---`}
                        </pre>
                      </li>
                      <li>重启开发服务器或重新构建网站</li>
                    </ol>
                    <p className={styles.emptyStateNote}>
                      注意: 私密文章不会出现在博客列表或RSS中，可以设置独立密码增强安全性
                    </p>
                  </div>
                )}
          </div>
        </main>
      </div>
    </Layout>
  )
}
