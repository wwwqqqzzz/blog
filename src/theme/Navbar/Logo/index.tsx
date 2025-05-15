import Logo from '@theme/Logo'
import React from 'react'
import styles from './styles.module.css'

export default function NavbarLogo(): JSX.Element {
  return (
    <div className={styles.logoWrapper}>
      <Logo
        className="navbar__brand"
        imageClassName={`navbar__logo ${styles.navbarLogo}`}
        titleClassName={`navbar__title text--truncate ${styles.navbarTitle}`}
      />
    </div>
  )
}
