import { ErrorCauseBoundary, useThemeConfig } from '@docusaurus/theme-common'
import { splitNavbarItems, useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle'
import NavbarLogo from '@theme/Navbar/Logo'
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle'
import NavbarItem, { type Props as DocusaurusNavbarItemConfig } from '@theme/NavbarItem'
import React, { type ReactNode, useEffect, useState } from 'react'
import navbarConfig from '@site/data/navbar'
import type { NavbarItemConfig } from '@site/src/types/navbar'

import styles from './styles.module.css'

/**
 * 使用配置文件中的导航项
 * 同时保持与Docusaurus原生导航项的兼容性
 */
function useNavbarItems() {
  // 获取Docusaurus配置中的导航项
  const docusaurusItems = useThemeConfig().navbar.items as DocusaurusNavbarItemConfig[]

  // 将配置文件中的导航项转换为Docusaurus格式
  const configItems = [...navbarConfig.leftItems, ...navbarConfig.rightItems] as DocusaurusNavbarItemConfig[]

  // 如果配置文件中有导航项，则使用配置文件中的导航项
  // 否则使用Docusaurus配置中的导航项（向后兼容）
  return configItems.length > 0 ? configItems : docusaurusItems
}

/**
 * 导航栏项目组件
 * 渲染导航栏中的各个项目
 */
function NavbarItems({ items }: { items: DocusaurusNavbarItemConfig[] }) {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={error =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              { cause: error },
            )}
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  )
}

/**
 * 导航栏内容布局组件
 * 负责导航栏的整体布局和视觉效果
 */
function NavbarContentLayout({
  left,
  right,
}: {
  left: ReactNode
  right: ReactNode
}) {
  // 获取视觉效果配置
  const { visualEffects } = navbarConfig

  // 跟踪滚动位置，用于滚动过渡效果
  const [scrolled, setScrolled] = useState(false)

  // 检测是否为移动设备
  const [isMobile, setIsMobile] = useState(false)

  // 监听窗口大小变化，更新移动设备状态
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', checkMobile)
    checkMobile() // 初始检查

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // 监听滚动事件，更新滚动状态
  useEffect(() => {
    // 在移动设备上禁用滚动过渡效果，避免干扰其他元素
    if (!visualEffects.enableScrollTransition || isMobile) return

    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled, visualEffects.enableScrollTransition, isMobile])

  // 构建导航栏类名
  const navbarClasses = [
    'navbar__inner',
    styles.centeredNavbar,
    // 在移动端禁用毛玻璃效果
    !isMobile && visualEffects.enableGlassmorphism && styles.glassmorphism,
    // 在移动端保留阴影效果，但减弱
    visualEffects.enableShadow && (isMobile ? styles.mobileShadow : styles.shadow),
    // 在移动端禁用滚动过渡效果
    !isMobile && visualEffects.enableScrollTransition && scrolled && styles.scrolled,
    // 添加移动端特定类
    isMobile && styles.mobileNavbar,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={navbarClasses}>
      <div className={`navbar__items ${styles.navbarItemsCenter}`}>
        {left}
        {right}
      </div>
    </div>
  )
}

/**
 * 导航栏内容组件
 * 负责组织和渲染导航栏的内容
 */
export default function NavbarContent() {
  const mobileSidebar = useNavbarMobileSidebar()

  // 使用配置文件中的导航项
  const docusaurusItems = useNavbarItems()
  const [docusaurusLeftItems, docusaurusRightItems] = splitNavbarItems(docusaurusItems)

  // 从配置文件中获取导航项
  const configLeftItems = navbarConfig.leftItems as DocusaurusNavbarItemConfig[]
  const configRightItems = navbarConfig.rightItems as DocusaurusNavbarItemConfig[]

  // 使用配置文件中的导航项，如果为空则使用Docusaurus配置中的导航项
  const leftItems = configLeftItems.length > 0 ? configLeftItems : docusaurusLeftItems
  const rightItems = configRightItems.length > 0 ? configRightItems : docusaurusRightItems

  // 检查是否有搜索项
  const searchBarItem = docusaurusItems.find(item => item.type === 'search')

  return (
    <NavbarContentLayout
      left={(
        <>
          {/* 移动端侧边栏切换按钮 */}
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          {/* 导航栏Logo */}
          <NavbarLogo />
          {/* 左侧导航项 */}
          <NavbarItems items={leftItems} />
        </>
      )}
      right={(
        <>
          {/* 右侧导航项 */}
          <NavbarItems items={rightItems} />
          {/* 颜色模式切换按钮 */}
          <NavbarColorModeToggle className={styles.colorModeToggle} />
        </>
      )}
    />
  )
}
