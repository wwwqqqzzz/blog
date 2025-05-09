import React from 'react'
import { cn } from '@site/src/lib/utils'
import { Icon } from '@iconify/react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 徽章的变体样式
   * @default "default"
   */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  /**
   * 徽章的尺寸
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 是否为圆形徽章
   * @default false
   */
  rounded?: boolean
  /**
   * 徽章前的图标
   */
  startIcon?: string
  /**
   * 徽章后的图标
   */
  endIcon?: string
  /**
   * 是否可点击移除
   * @default false
   */
  removable?: boolean
  /**
   * 移除徽章时的回调函数
   */
  onRemove?: () => void
}

/**
 * 徽章组件
 * 用于显示状态、标签或数字标记
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  startIcon,
  endIcon,
  removable = false,
  onRemove,
  className,
  ...props
}: BadgeProps) {
  // 基础样式
  const baseStyles = 'inline-flex items-center font-medium'

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  }

  // 变体样式
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    outline: 'border border-gray-300 text-gray-700 bg-transparent dark:border-gray-600 dark:text-gray-300',
  }

  // 圆角样式
  const roundedStyles = rounded ? 'rounded-full' : 'rounded-md'

  // 图标尺寸
  const iconSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  // 移除按钮尺寸
  const removeButtonSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <span
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        roundedStyles,
        className,
      )}
      {...props}
    >
      {startIcon && (
        <Icon icon={startIcon} className={cn('mr-1', iconSize[size])} />
      )}
      {children}
      {endIcon && !removable && (
        <Icon icon={endIcon} className={cn('ml-1', iconSize[size])} />
      )}
      {removable && (
        <button
          type="button"
          className={cn(
            'ml-1 rounded-full hover:bg-gray-200/60 hover:text-gray-900 focus:outline-none dark:hover:bg-gray-700/60 dark:hover:text-gray-200',
            removeButtonSize[size],
          )}
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          aria-label="移除"
        >
          <svg
            className="size-full"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8h8M12 8L4 8"
            />
          </svg>
        </button>
      )}
    </span>
  )
}
