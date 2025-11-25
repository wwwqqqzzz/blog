import React, { useEffect } from 'react'
import { ReadingProgressBar } from '@site/src/components/ui'
import PageTransition from '@site/src/components/PageTransition'
import { useLocation } from '@docusaurus/router'

// 导入webpack客户端配置（用于禁用错误覆盖层）

// 错误边界状态接口
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// 错误边界属性接口
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Global error boundary component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to console with detailed information
    console.error('React Error Boundary caught an error:')
    console.error('Error:', error)
    console.error('Component Stack:', errorInfo.componentStack)

    this.setState({ errorInfo })
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '4px',
        }}
        >
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
export default function Root({ children }: { children: React.ReactNode }): React.ReactElement {
  // 我们不使用location，但保留它以便将来可能需要
  const _location = useLocation()

  // 添加全局错误处理
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 增强控制台错误日志
      const originalConsoleError = console.error
      console.error = (...args: any[]) => {
        // 使用原始console.error
        originalConsoleError.apply(console, args)

        // 为webpack错误添加更详细的日志
        if (args[0] && typeof args[0] === 'object') {
          try {
            originalConsoleError('Detailed error object:', JSON.stringify(args[0], null, 2))
          }
          catch (e) {
            originalConsoleError('Error object (non-serializable):', Object.keys(args[0]))
            for (const key in args[0]) {
              try {
                originalConsoleError(`- ${key}:`, args[0][key])
              }
              catch (err) {
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
          error: error ? error.stack : 'No error object',
        })

        // 如果存在原始处理器则调用
        if (typeof originalOnError === 'function') {
          return originalOnError(message, source, lineno, colno, error)
        }
        return false
      }

      // 添加未处理的Promise拒绝处理器
      const originalOnUnhandledRejection = window.onunhandledrejection
      window.onunhandledrejection = (event: PromiseRejectionEvent) => {
        // 忽略来自浏览器扩展的错误
        const errorSource = event.reason?.stack || '';
        const isExtensionError = errorSource.includes('chrome-extension://') ||
                                errorSource.includes('inpage.js') ||
                                (event.reason?.code === -32603);

        if (isExtensionError) {
          // 这是浏览器扩展的错误，我们可以安全地忽略它
          console.warn('忽略浏览器扩展的错误:', {
            reason: event.reason,
            isExtensionError: true
          });
          // 阻止错误传播
          event.preventDefault();
          return false;
        }

        // 记录其他未处理的Promise拒绝
        console.error('未处理的Promise拒绝:', {
          reason: event.reason,
          stack: event.reason?.stack || 'No stack trace',
        });

        // 如果存在原始处理器则调用
        if (typeof originalOnUnhandledRejection === 'function') {
          // 使用call来确保this上下文正确
          return originalOnUnhandledRejection.call(window, event);
        }
      }

      // 清理函数
      return () => {
        console.error = originalConsoleError
        window.onerror = originalOnError
        window.onunhandledrejection = originalOnUnhandledRejection
      }
    }

    // 如果window未定义，返回空清理函数
    return () => {};
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

    // 如果document未定义，返回空清理函数
    return () => {};
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
