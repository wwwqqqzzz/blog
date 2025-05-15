import { useNavbarSecondaryMenu } from '@docusaurus/theme-common/internal'
import UserCard from '@site/src/components/UserCard'
import { cn } from '@site/src/lib/utils'
import type { Props } from '@theme/Navbar/MobileSidebar/Layout'

export default function NavbarMobileSidebarLayout({ header, primaryMenu, secondaryMenu }: Props): JSX.Element {
  const { shown: secondaryMenuShown } = useNavbarSecondaryMenu()
  return (
    <div className="navbar-sidebar">
      {header}
      <div className="navbar-sidebar__user-card" style={{ overflow: 'visible' }}>
        <UserCard isNavbar />
      </div>
      <div
        className={cn('navbar-sidebar__items', {
          'navbar-sidebar__items--show-secondary': secondaryMenuShown,
        })}
        style={{ marginTop: '1rem' }} // 增加间距，确保社交链接有足够空间
      >
        <div className="navbar-sidebar__item menu">{primaryMenu}</div>
        <div className="navbar-sidebar__item menu">{secondaryMenu}</div>
      </div>
    </div>
  )
}
