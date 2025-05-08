import { useReadPercent } from '@site/src/hooks/useReadPercent'
import { cn } from '@site/src/lib/utils'
import type { Props } from '@theme/TOC'
import TOCItems from '@theme/TOCItems'
import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight'
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active'

export default function TOC({ className, ...props }: Props): React.ReactElement {
  const { readPercent } = useReadPercent()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 检测是否为移动设备
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 996)
      // 在移动设备上默认折叠目录
      setIsCollapsed(window.innerWidth < 996)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <motion.div
      className={cn(
        styles.tableOfContents,
        'thin-scrollbar',
        className,
        isCollapsed && styles.tocCollapsed,
        isMobile && styles.tocMobile,
      )}
      initial={{ opacity: 0.0001, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20,
        duration: 3,
      }}
    >
      <div className={styles.tocHeader}>
        <h3 className={styles.tocTitle}>目录</h3>
        <button
          onClick={toggleCollapse}
          className={styles.collapseButton}
          aria-label={isCollapsed ? '展开目录' : '折叠目录'}
          title={isCollapsed ? '展开目录' : '折叠目录'}
        >
          {isCollapsed
            ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              )
            : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              )}
        </button>
      </div>

      <div className={cn(styles.tocContent, isCollapsed && styles.tocContentHidden)}>
        <TOCItems
          {...props}
          className="table-of-contents pl-0"
          linkClassName={LINK_CLASS_NAME}
          linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
        />
      </div>

      <hr className={styles.hr} />
      <span className={styles.percent}>
        {`${readPercent}%`}
        {' '}
      </span>
    </motion.div>
  )
}
