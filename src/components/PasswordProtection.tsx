import React, { useState, useEffect, ReactNode } from 'react'
import styles from './PasswordProtection.module.css'

interface PasswordProtectionProps {
  children: ReactNode
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

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
    const auth = localStorage.getItem('blog_auth')
    const expiry = localStorage.getItem('blog_auth_expiry')

    if (auth && expiry) {
      // 检查是否过期 (24小时后过期)
      const now = new Date().getTime()
      if (parseInt(expiry) > now) {
        setIsAuthenticated(true)
        setShowLogout(true)
      }
      else {
        // 已过期，清除
        localStorage.removeItem('blog_auth')
        localStorage.removeItem('blog_auth_expiry')
      }
    }
  }, [])

  // 处理密码提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 这里替换为您想设置的密码
    const correctPassword = '123456' // 请修改为您自己的密码

    if (password === correctPassword) {
      // 加密存储认证状态
      const hashedAuth = simpleHash(correctPassword + new Date().toISOString())
      // 设置24小时后过期
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000

      localStorage.setItem('blog_auth', hashedAuth)
      localStorage.setItem('blog_auth_expiry', expiryTime.toString())

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
    localStorage.removeItem('blog_auth')
    localStorage.removeItem('blog_auth_expiry')
    setIsAuthenticated(false)
    setShowLogout(false)
  }

  if (isAuthenticated) {
    return (
      <>
        {showLogout && (
          <div className={styles.logoutContainer}>
            <button onClick={handleLogout} className={styles.logoutButton}>
              退出私密模式
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
        <h2>私密内容</h2>
        <p>此内容受密码保护，请输入密码继续访问</p>

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
              确认
            </button>
          </div>
          {error && <p className={styles.errorMessage}>密码错误，请重试</p>}
        </form>
      </div>
    </div>
  )
}

export default PasswordProtection
