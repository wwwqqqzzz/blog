import React, { useEffect } from 'react'
import { ReadingProgressBar } from '@site/src/components/ui'
import PageTransition from '@site/src/components/PageTransition'
import { useLocation } from '@docusaurus/router'

// Global error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console with detailed information
    console.error('React Error Boundary caught an error:')
    console.error('Error:', error)
    console.error('Component Stack:', errorInfo.componentStack)

    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '4px'
        }}>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show error details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>Component Stack:</p>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

// Root组件：用于在应用程序外层添加全局功能
export default function Root({ children }): React.ReactElement {
  const location = useLocation()

  // 添加全局错误处理
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 增强控制台错误日志
      const originalConsoleError = console.error
      console.error = (...args) => {
        // 使用原始console.error
        originalConsoleError.apply(console, args)

        // 为webpack错误添加更详细的日志
        if (args[0] && typeof args[0] === 'object') {
          try {
            originalConsoleError('Detailed error object:', JSON.stringify(args[0], null, 2))
          } catch (e) {
            originalConsoleError('Error object (non-serializable):', Object.keys(args[0]))
            for (const key in args[0]) {
              try {
                originalConsoleError(`- ${key}:`, args[0][key])
              } catch (err) {
                originalConsoleError(`- ${key}: [Cannot display value]`)
              }
            }
          }
        }
      }

      // 添加全局错误处理器
      const originalOnError = window.onerror
      window.onerror = (message, source, lineno, colno, error) => {
        console.error('Global error caught:', {
          message,
          source,
          lineno,
          colno,
          error: error ? error.stack : 'No error object'
        })

        // 如果存在原始处理器则调用
        if (typeof originalOnError === 'function') {
          return originalOnError(message, source, lineno, colno, error)
        }
        return false
      }

      // 添加未处理的Promise拒绝处理器
      const originalOnUnhandledRejection = window.onunhandledrejection
      window.onunhandledrejection = (event) => {
        console.error('Unhandled Promise Rejection:', {
          reason: event.reason,
          stack: event.reason?.stack || 'No stack trace'
        })

        // 如果存在原始处理器则调用
        if (typeof originalOnUnhandledRejection === 'function') {
          return originalOnUnhandledRejection(event)
        }
      }

      // 清理函数
      return () => {
        console.error = originalConsoleError
        window.onerror = originalOnError
        window.onunhandledrejection = originalOnUnhandledRejection
      }
    }
  }, [])

  // 添加主题切换动画类
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-transition')

      // 处理主题变化时的过渡动画
      const handleTransitionEnd = () => {
        document.documentElement.classList.remove('theme-transition-active')
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            document.documentElement.classList.add('theme-transition-active')
          }
        })
      })

      observer.observe(document.documentElement, { attributes: true })
      document.documentElement.addEventListener('transitionend', handleTransitionEnd)

      return () => {
        observer.disconnect()
        document.documentElement.removeEventListener('transitionend', handleTransitionEnd)
      }
    }
  }, [])

  return (
    <ErrorBoundary>
      <>
        {/* 全局阅读进度条 */}
        <ReadingProgressBar showPercentage position="top" height={3} />

        {/* 页面过渡动画 */}
        <PageTransition type="fade">
          {children}
        </PageTransition>
      </>
    </ErrorBoundary>
  )
}
