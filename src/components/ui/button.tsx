import React, { forwardRef } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮的变体样式
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'success'
  /**
   * 按钮的尺寸
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 是否禁用按钮
   * @default false
   */
  disabled?: boolean
  /**
   * 按钮是否显示加载状态
   * @default false
   */
  isLoading?: boolean
  /**
   * 按钮前的图标
   */
  startIcon?: string
  /**
   * 按钮后的图标
   */
  endIcon?: string
  /**
   * 按钮是否占满容器宽度
   * @default false
   */
  fullWidth?: boolean
  /**
   * 按钮文本
   */
  children: React.ReactNode
}

/**
 * 通用按钮组件
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      isLoading = false,
      startIcon,
      endIcon,
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // 基础样式
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-primary-500 dark:focus:ring-primary-400 disabled:opacity-60 disabled:pointer-events-none'

    // 尺寸样式
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    }

    // 变体样式
    const variantStyles = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-500 dark:hover:bg-primary-400 dark:text-gray-900 dark:hover:text-gray-900 dark:active:bg-primary-300',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-500',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:active:bg-gray-600',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800/60 dark:active:bg-gray-700',
      link: 'bg-transparent text-primary-600 hover:underline p-0 h-auto dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:text-white dark:hover:bg-red-400 dark:hover:text-gray-900 dark:active:bg-red-300',
      success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 dark:bg-green-500 dark:text-white dark:hover:bg-green-400 dark:hover:text-gray-900 dark:active:bg-green-300',
    }

    // 宽度样式
    const widthStyles = fullWidth ? 'w-full' : ''

    // 加载状态样式
    const loadingStyles = isLoading ? 'relative !text-transparent' : ''

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          widthStyles,
          loadingStyles,
          disabled && 'dark:opacity-50',
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {startIcon && !isLoading && (
          <Icon icon={startIcon} className={cn('mr-2', size === 'sm' ? 'text-base' : 'text-lg')} />
        )}
        {children}
        {endIcon && !isLoading && (
          <Icon icon={endIcon} className={cn('ml-2', size === 'sm' ? 'text-base' : 'text-lg')} />
        )}
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              className={cn(
                'animate-spin',
                size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6',
              )}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              >
              </circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              >
              </path>
            </svg>
          </div>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button }
