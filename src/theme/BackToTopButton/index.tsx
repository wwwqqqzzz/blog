import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@site/src/lib/utils'
import './styles.css'

/**
 * 回到顶部按钮组件 - 优化版本
 * 当页面滚动超过一定距离时显示，点击后平滑滚动到顶部
 */
export default function BackToTopButton(): React.ReactElement {
  const [shown, setShown] = useState(false)

  // 监听滚动事件，控制按钮显示/隐藏
  useEffect(() => {
    const handleScroll = () => {
      // 只要页面滚动超过300px就显示按钮，不管滚动方向
      setShown(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <motion.button
      type="button"
      className={cn('back-to-top-button', shown ? 'visible' : 'hidden')}
      onClick={scrollToTop}
      aria-label="回到顶部"
      title="回到顶部"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: shown ? 1 : 0,
        scale: shown ? 1 : 0.5,
        y: shown ? 0 : 20,
      }}
      transition={{ duration: 0.3 }}
    >
      <Icon icon="ri:arrow-up-line" className="text-xl" />
    </motion.button>
  )
}
