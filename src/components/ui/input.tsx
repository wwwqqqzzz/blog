import React, { forwardRef } from 'react'
import { cn } from '@site/src/lib/utils'
import { Icon } from '@iconify/react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 输入框状态
   */
  status?: 'success' | 'error' | 'warning'
  /**
   * 右侧图标
   */
  endIcon?: string
  /**
   * 左侧图标
   */
  startIcon?: string
  /**
   * 输入框容器类名
   */
  wrapperClassName?: string
  /**
   * 是否显示清除按钮
   */
  clearable?: boolean
  /**
   * 点击清除按钮时的回调
   */
  onClear?: () => void
}

/**
 * 输入框组件
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      status,
      startIcon,
      endIcon,
      wrapperClassName,
      clearable,
      onClear,
      disabled,
      ...props
    },
    ref,
  ) => {
    // 输入框基础样式
    const baseInputStyles = 'flex w-full rounded-md bg-transparent px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-200'

    // 输入框状态样式
    const statusStyles = {
      default: 'border border-gray-300 focus-visible:border-primary-500 dark:border-gray-600 dark:bg-gray-800/60 dark:focus-visible:border-primary-400 focus-visible:ring-1 focus-visible:ring-primary-500/30 dark:focus-visible:ring-primary-400/20',
      success: 'border-green-500 focus-visible:border-green-600 dark:border-green-500/70 dark:focus-visible:border-green-400 focus-visible:ring-1 focus-visible:ring-green-500/30 dark:focus-visible:ring-green-400/20',
      error: 'border-red-500 focus-visible:border-red-600 dark:border-red-500/70 dark:focus-visible:border-red-400 focus-visible:ring-1 focus-visible:ring-red-500/30 dark:focus-visible:ring-red-400/20',
      warning: 'border-yellow-500 focus-visible:border-yellow-600 dark:border-yellow-500/70 dark:focus-visible:border-yellow-400 focus-visible:ring-1 focus-visible:ring-yellow-500/30 dark:focus-visible:ring-yellow-400/20',
    }

    // 输入框图标位置调整
    const hasStartIcon = !!startIcon
    const hasEndIcon = !!endIcon || clearable
    const paddingLeft = hasStartIcon ? 'pl-10' : ''
    const paddingRight = hasEndIcon ? 'pr-10' : ''

    // 当前状态样式
    const currentStatusStyle = status ? statusStyles[status] : statusStyles.default

    return (
      <div className={cn('relative', wrapperClassName)}>
        {hasStartIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon icon={startIcon as string} className="size-5 text-gray-400 dark:text-gray-500" />
          </div>
        )}

        <input
          type={type}
          className={cn(
            baseInputStyles,
            currentStatusStyle,
            paddingLeft,
            paddingRight,
            className,
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />

        {endIcon && !clearable && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon icon={endIcon} className="size-5 text-gray-400 dark:text-gray-500" />
          </div>
        )}

        {clearable && props.value && !disabled && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
            onClick={() => {
              onClear?.()
            }}
            aria-label="清除输入"
          >
            <Icon icon="ri:close-circle-fill" className="size-5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" />
          </button>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
