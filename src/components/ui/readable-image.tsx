import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@site/src/lib/utils'

interface ReadableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * 暗模式下降低亮度
   * @default true
   */
  darkModeOptimized?: boolean
  /**
   * 点击放大
   * @default false
   */
  zoomable?: boolean
  /**
   * 图片描述
   */
  caption?: string
  /**
   * 自定义容器类名
   */
  wrapperClassName?: string
}

/**
 * 阅读友好的图片组件
 * 支持暗模式优化、模糊预加载、点击放大等功能
 */
export function ReadableImage({
  src,
  alt = '',
  className,
  wrapperClassName,
  darkModeOptimized = true,
  zoomable = false,
  caption,
  ...props
}: ReadableImageProps): React.ReactElement {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoaded(true)
  }

  // 处理放大/缩小切换
  const toggleZoom = () => {
    if (zoomable) {
      setIsZoomed(!isZoomed)
    }
  }

  return (
    <figure className={cn('my-8 overflow-hidden rounded-lg', wrapperClassName)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800',
          zoomable && 'cursor-zoom-in',
          isZoomed && 'cursor-zoom-out',
        )}
        onClick={toggleZoom}
      >
        {/* 预加载背景 */}
        <div
          className={cn(
            'absolute inset-0 bg-gray-200 dark:bg-gray-800 transition-opacity duration-500',
            isLoaded ? 'opacity-0' : 'opacity-100',
          )}
        />

        {/* 图片 */}
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full transition-all duration-500',
            darkModeOptimized && 'dark:brightness-90 dark:contrast-105 dark:hover:brightness-100',
            isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md',
            isZoomed ? 'scale-125' : 'scale-100',
            className,
          )}
          onLoad={handleLoad}
          style={{
            transitionProperty: 'opacity, filter, transform',
            transitionDuration: '0.5s, 0.5s, 0.5s',
          }}
          {...props}
        />
      </div>

      {/* 图片说明 */}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
