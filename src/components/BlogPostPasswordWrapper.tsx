import React, { useState, useEffect, ReactNode } from 'react'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import styles from './PasswordProtection.module.css'

interface BlogPostPasswordWrapperProps {
  children: ReactNode
}

const BlogPostPasswordWrapper: React.FC<BlogPostPasswordWrapperProps> = ({ children }) => {
  const { metadata } = useBlogPost()
  const { frontMatter, title, permalink } = metadata
  const {
    private: isPrivate,
    password: customPassword,
    passwordHint: customPasswordHint
  } = frontMatter

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  // 如果不是私密文章，直接显示内容
  if (!isPrivate) {
    return <>{children}</>
  }

  // 文章ID，用于区分不同文章的认证状态
  const articleId = permalink.replace(/\//g, '_')
  const storageKeyPrefix = `blog_auth_${articleId}`

  // 加密辅助函数 (简单的哈希)
  const simpleHash = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return hash.toString(36)
  }

  // 检查是否已经验证过以及验证是否过期
  useEffect(() => {
    const auth = localStorage.getItem(`${storageKeyPrefix}_auth`)
    const expiry = localStorage.getItem(`${storageKeyPrefix}_expiry`)

    if (auth && expiry) {
      // 检查是否过期 (24小时后过期)
      const now = new Date().getTime()
      if (parseInt(expiry) > now) {
        setIsAuthenticated(true)
        setShowLogout(true)
      }
      else {
        // 已过期，清除
        localStorage.removeItem(`${storageKeyPrefix}_auth`)
        localStorage.removeItem(`${storageKeyPrefix}_expiry`)
      }
    }
  }, [storageKeyPrefix])

  // 处理密码提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 使用自定义密码或默认密码
    const correctPassword = customPassword || '123456' // 默认密码

    if (password === correctPassword) {
      // 加密存储认证状态
      const hashedAuth = simpleHash(correctPassword + new Date().toISOString())
      // 设置24小时后过期
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000

      localStorage.setItem(`${storageKeyPrefix}_auth`, hashedAuth)
      localStorage.setItem(`${storageKeyPrefix}_expiry`, expiryTime.toString())

      setIsAuthenticated(true)
      setShowLogout(true)
      setError(false)
    }
    else {
      setError(true)
      // 错误尝试短暂延迟，防止暴力破解
      setTimeout(() => {
        setError(false)
      }, 1500)
    }
  }

  // 处理退出
  const handleLogout = () => {
    localStorage.removeItem(`${storageKeyPrefix}_auth`)
    localStorage.removeItem(`${storageKeyPrefix}_expiry`)
    setIsAuthenticated(false)
    setShowLogout(false)
  }

  if (isAuthenticated) {
    return (
      <>
        {showLogout && (
          <div className={styles.logoutContainer}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              退出阅读模式
            </button>
          </div>
        )}
        {children}
      </>
    )
  }

  return (
    <div className={styles.passwordContainer}>
      <div className={styles.passwordCard}>
        <h2>🔐 私密内容</h2>
        <p>此文章受密码保护，请输入密码继续阅读</p>
        <p className={styles.articleTitle}>{title}</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              className={styles.passwordInput}
              autoFocus
            />
            <button type="submit" className={styles.submitButton}>
              解锁
            </button>
          </div>
          {error && <p className={styles.errorMessage}>密码错误，请重试</p>}
          {customPasswordHint && (
            <p className={styles.passwordHint}>
              <strong>💡 密码提示:</strong> {customPasswordHint}
            </p>
          )}
          {customPassword ? (
            <p className={styles.passwordType}>此文章使用自定义密码</p>
          ) : (
            <p className={styles.passwordType}>此文章使用默认密码</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default BlogPostPasswordWrapper
