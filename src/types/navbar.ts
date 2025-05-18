/**
 * 导航栏项目类型定义
 */

/**
 * 导航栏链接项
 */
export interface NavbarLinkItem {
  type: 'default'
  label: string
  to: string
  href?: string
  activeBaseRegex?: string
  className?: string
  icon?: string
}

/**
 * 导航栏下拉菜单项
 */
export interface NavbarDropdownItem {
  type: 'dropdown'
  label: string
  items: (NavbarLinkItem | { type: 'html', value: string })[]
  className?: string
  icon?: string
}

/**
 * 导航栏搜索项
 */
export interface NavbarSearchItem {
  type: 'search'
  className?: string
}

/**
 * 导航栏HTML项
 */
export interface NavbarHtmlItem {
  type: 'html'
  value: string
  className?: string
}

/**
 * 导航栏项目配置
 */
export type NavbarItemConfig =
  | NavbarLinkItem
  | NavbarDropdownItem
  | NavbarSearchItem
  | NavbarHtmlItem

/**
 * 导航栏视觉效果配置
 */
export interface NavbarVisualEffects {
  /**
   * 是否启用毛玻璃效果
   */
  enableGlassmorphism: boolean
  /**
   * 是否启用阴影效果
   */
  enableShadow: boolean
  /**
   * 是否启用悬停效果
   */
  enableHoverEffect: boolean
  /**
   * 是否启用滚动过渡效果
   */
  enableScrollTransition: boolean
}
