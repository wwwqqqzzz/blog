import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@site/src/lib/utils'
import Image from '@theme/IdealImage'

interface OptimizedImageProps {
  /**
   * 图片路径
   */
  src: string
  /**
   * 替代文本
   */
  alt?: string
  /**
   * 自定义类�?   */
  className?: string
  /**
   * 容器类名
   */
  wrapperClassName?: string
  /**
   * 是否可点击放�?   * @default false
   */
  zoomable?: boolean
  /**
   * 图片说明
   */
  caption?: string
  /**
   * 是否应用暗模式优�?   * @default true
   */
  darkModeOptimized?: boolean
  /**
   * 图片样式
   */
  style?: React.CSSProperties
}

/**
 * 优化的图片组�? * 使用IdealImage实现懒加载、WebP支持和渐进式加载
 */
export function OptimizedImage({
  src,
  alt = '',
  className,
  wrapperClassName,
  zoomable = false,
  caption,
  darkModeOptimized = true,
  style,
}: OptimizedImageProps): React.ReactElement {
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

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

        {/* 优化图片 */}
        <Image
          img={src}
          src={src}
          alt={alt}
          className={cn(
            'w-full transition-all duration-500',
            darkModeOptimized && 'dark:brightness-90 dark:contrast-105 dark:hover:brightness-100',
            isZoomed ? 'scale-125' : 'scale-100',
            className,
          )}
          style={{
            ...style,
            transitionProperty: 'opacity, filter, transform',
            transitionDuration: '0.5s, 0.5s, 0.5s',
          }}
          onLoad={() => setIsLoaded(true)}
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
