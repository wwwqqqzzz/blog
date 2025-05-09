import React, { forwardRef } from 'react'
import { cn } from '@site/src/lib/utils'

/* 卡片根元素 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否有阴影
   * @default true
   */
  hasShadow?: boolean
  /**
   * 是否无边框
   * @default false
   */
  noBorder?: boolean
  /**
   * 悬停时是否有动画效果
   * @default false
   */
  hoverEffect?: boolean
  /**
   * 是否使用玻璃拟态效果（暗模式下）
   * @default false
   */
  glassMorphism?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hasShadow = true, noBorder = false, hoverEffect = false, glassMorphism = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg bg-white dark:bg-gray-800/90',
        !noBorder && 'border border-gray-200 dark:border-gray-700',
        hasShadow && 'shadow-sm dark:shadow-md dark:shadow-black/20',
        hoverEffect && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/30',
        glassMorphism && 'dark:bg-gray-800/70 dark:backdrop-blur-sm dark:backdrop-saturate-150',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

/* 卡片头部 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否有底部边框
   * @default true
   */
  withBorder?: boolean
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withBorder = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 p-5',
        withBorder && 'border-b border-gray-200 dark:border-gray-700/70',
        className,
      )}
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

/* 卡片标题 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold text-gray-900 dark:text-gray-50', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

/* 卡片描述 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-500 dark:text-gray-300', className)}
      {...props}
    />
  ),
)
CardDescription.displayName = 'CardDescription'

/* 卡片内容 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否无内边距
   * @default false
   */
  noPadding?: boolean
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, noPadding = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(!noPadding && 'p-5', className)}
      {...props}
    />
  ),
)
CardContent.displayName = 'CardContent'

/* 卡片底部 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否有顶部边框
   * @default true
   */
  withBorder?: boolean
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, withBorder = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center p-5',
        withBorder && 'border-t border-gray-200 dark:border-gray-700/70',
        className,
      )}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
