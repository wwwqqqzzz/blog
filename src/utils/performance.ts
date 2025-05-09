import React, { lazy, Suspense } from 'react'

/**
 * 懒加载组件包装器
 * 用于优化性能，减少首次加载时间
 *
 * @param importFn - 动态导入组件的函数
 * @param fallback - 加载中显示的组件
 * @returns 懒加载的React组件
 *
 * @example
 * // 基本用法
 * const LazyComponent = lazyLoad(() => import('./HeavyComponent'))
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
) {
  const LazyComponent = lazy(importFn)

  function Component(props: React.ComponentProps<T>) {
    return React.createElement(
      Suspense,
      { fallback: fallback || React.createElement('div', null) },
      React.createElement(LazyComponent, props),
    )
  }

  return Component
}

/**
 * 错误边界组件
 * 捕获并处理组件懒加载过程中的错误
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('组件加载错误:', error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback || React.createElement('div', { className: 'p-4 text-center text-red-500' }, '组件加载失败')
    }

    return this.props.children
  }
}

/**
 * 图片懒加载处理函数
 * 为图片URL添加宽度、高度参数，便于CDN处理
 *
 * @param url - 原始图片URL
 * @param width - 期望的图片宽度
 * @param height - 期望的图片高度
 * @returns 处理后的图片URL
 *
 * @example
 * // 获取400x300大小的图片
 * const optimizedUrl = getOptimizedImageUrl('https://example.com/image.jpg', 400, 300)
 */
export function getOptimizedImageUrl(url: string, width?: number, height?: number): string {
  // 检查URL是否有效
  if (!url || typeof url !== 'string') {
    return ''
  }

  // 跳过已经有优化参数的URL
  if (url.includes('?w=') || url.includes('&w=')) {
    return url
  }

  // 构建参数
  const params = new URLSearchParams()
  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())

  // 格式转换参数 - 支持WebP
  params.append('fmt', 'webp')

  // 质量参数 - 80%的质量通常是文件大小和视觉质量的良好平衡
  params.append('q', '80')

  // 添加参数到URL
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${params.toString() ? separator + params.toString() : ''}`
}

/**
 * 检测浏览器对WebP格式的支持
 * @returns 返回一个Promise，解析为布尔值表示是否支持WebP
 */
export async function supportsWebP(): Promise<boolean> {
  if (!window.createImageBitmap) return false

  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
  const blob = await fetch(webpData).then(r => r.blob())

  return createImageBitmap(blob).then(() => true, () => false)
}

/**
 * 预加载一个或多个图片
 * @param srcs - 图片URL数组或单个URL
 * @returns 包含所有图片加载结果的Promise
 */
export function preloadImages(srcs: string | string[]): Promise<boolean[]> {
  const urls = Array.isArray(srcs) ? srcs : [srcs]

  return Promise.all(
    urls.map(
      src =>
        new Promise<boolean>((resolve) => {
          const img = new Image()
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          img.src = src
        }),
    ),
  )
}

/**
 * 分析和记录组件渲染时间的计时器函数
 * @param componentName - 组件名称
 * @param callback - 要测量执行时间的回调函数
 * @returns 回调函数的返回值
 */
export function measurePerformance<T>(componentName: string, callback: () => T): T {
  // 仅在开发模式下执行
  if (process.env.NODE_ENV !== 'development') {
    return callback()
  }

  console.time(`[Performance] ${componentName}`)
  const result = callback()
  console.timeEnd(`[Performance] ${componentName}`)
  return result
}
