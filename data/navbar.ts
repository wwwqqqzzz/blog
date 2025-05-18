/**
 * 导航栏配置
 *
 * 这个文件定义了网站导航栏的配置项
 * 可以在这里添加、修改或删除导航项，而不需要修改组件代码
 */

import type { NavbarItemConfig } from '@site/src/types/navbar'

/**
 * 导航栏配置
 */
const navbarConfig: {
  /**
   * 左侧导航项
   */
  leftItems: NavbarItemConfig[]
  /**
   * 右侧导航项
   */
  rightItems: NavbarItemConfig[]
  /**
   * 视觉效果配置
   */
  visualEffects: {
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
} = {
  // 左侧导航项（保持空数组，因为左侧只有Logo和移动端菜单按钮）
  leftItems: [],

  // 右侧导航项
  rightItems: [
    {
      type: 'default',
      label: '博客',
      to: '/blog',
      activeBaseRegex: '^/blog(/)?$',
      className: 'navbar-item-blog',
    },
    {
      type: 'default',
      label: '项目',
      to: '/project',
      activeBaseRegex: '^/project(/)?$',
      className: 'navbar-item-project',
    },
    {
      type: 'default',
      label: '友链',
      to: '/friends',
      activeBaseRegex: '^/friends(/)?$',
      className: 'navbar-item-friends',
    },
    {
      type: 'default',
      label: '关于',
      to: '/about',
      activeBaseRegex: '^/about(/)?$',
      className: 'navbar-item-about',
    },
    {
      type: 'dropdown',
      label: '更多',
      className: 'navbar-item-more',
      items: [
        {
          type: 'default',
          label: '归档',
          to: '/blog/archive',
          className: 'navbar-dropdown-item-archive',
        },
        {
          type: 'default',
          label: '系列',
          to: '/blog/collections',
          className: 'navbar-dropdown-item-collections',
        },
        {
          type: 'default',
          label: '技术笔记',
          to: '/docs/docusaurus-guides',
          className: 'navbar-dropdown-item-docs',
        },
        {
          type: 'default',
          label: '私密博客',
          to: '/private',
          className: 'navbar-dropdown-item-private',
        },
      ],
    },
  ],

  // 视觉效果配置
  visualEffects: {
    // 启用毛玻璃效果（在移动端会自动禁用）
    enableGlassmorphism: true,
    // 启用阴影效果（在移动端会使用更轻微的阴影）
    enableShadow: true,
    // 启用悬停效果（在移动端会自动禁用）
    enableHoverEffect: true,
    // 启用滚动过渡效果（在移动端会自动禁用）
    enableScrollTransition: true,
  },
}

export default navbarConfig
