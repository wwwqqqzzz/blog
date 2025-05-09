import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from '@docusaurus/router'

export interface PageTransitionProps {
  /**
   * 要在页面过渡中显示的子元素
   */
  children: React.ReactNode
  /**
   * 动画类型
   * @default "fade"
   */
  type?: 'fade' | 'slide' | 'zoom' | 'slideUp'
  /**
   * 页面键（用于跟踪页面变化）
   */
  pageKey?: string
}

/**
 * 页面过渡动画组件
 * 为页面切换添加平滑过渡效果
 */
export default function PageTransition({
  children,
  type = 'fade',
  pageKey,
}: PageTransitionProps): React.ReactElement {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  // 当位置变化时应用过渡效果
  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut')
    }
  }, [location, displayLocation])

  // 动画变体配置
  const variants = {
    fade: {
      fadeIn: {
        opacity: 1,
        transition: { duration: 0.4, delay: 0.1 },
      },
      fadeOut: {
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
    slide: {
      fadeIn: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, type: 'spring' },
      },
      fadeOut: {
        opacity: 0,
        x: '100%',
        transition: { duration: 0.3 },
      },
    },
    slideUp: {
      fadeIn: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, type: 'spring' },
      },
      fadeOut: {
        opacity: 0,
        y: '100%',
        transition: { duration: 0.3 },
      },
    },
    zoom: {
      fadeIn: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4 },
      },
      fadeOut: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.3 },
      },
    },
  }

  // 获取当前过渡类型的变体
  const currentVariants = variants[type]

  // 处理动画结束
  const handleAnimationComplete = () => {
    if (transitionStage === 'fadeOut') {
      setDisplayLocation(location)
      setTransitionStage('fadeIn')
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey || displayLocation.pathname}
        variants={currentVariants}
        animate={transitionStage}
        onAnimationComplete={handleAnimationComplete}
        initial="fadeOut"
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
