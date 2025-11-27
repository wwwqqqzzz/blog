import { useLockBodyScroll, useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header'
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout'
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu'
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu'
import React, { useEffect } from 'react'

export default function NavbarMobileSidebar(): JSX.Element | null {
  const mobileSidebar = useNavbarMobileSidebar()
  useLockBodyScroll(mobileSidebar.shown)

  useEffect(() => {
    const el = document.body
    if (!el) return
    if (mobileSidebar.shown) el.classList.add('app-blur')
    else el.classList.remove('app-blur')
    return () => el.classList.remove('app-blur')
  }, [mobileSidebar.shown])

  if (!mobileSidebar.shouldRender) {
    return null
  }

  return (
    <NavbarMobileSidebarLayout
      header={<NavbarMobileSidebarHeader />}
      primaryMenu={<NavbarMobileSidebarPrimaryMenu />}
      secondaryMenu={<NavbarMobileSidebarSecondaryMenu />}
    />
  )
}
