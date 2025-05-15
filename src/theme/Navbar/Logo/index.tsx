import Logo from '@theme/Logo'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './styles.module.css'

export default function NavbarLogo(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false)

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始化检查

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <motion.div
      className={styles.logoWrapper}
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: 1,
        scale: isScrolled ? 0.9 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <Logo
        className="navbar__brand"
        imageClassName={`navbar__logo ${styles.navbarLogo}`}
        titleClassName={`navbar__title text--truncate ${styles.navbarTitle}`}
      />
    </motion.div>
  )
}
