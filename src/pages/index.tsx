import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import BlogSection from '../components/landing/BlogSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import Hero from '../components/landing/Hero'
import ProjectSection from '../components/landing/ProjectSection'
import AIAssistantSection from '../components/landing/AIAssistantSection'
import PersonalTraitsSection from '../components/landing/PersonalTraitsSection'
import Particles from '../components/magicui/particles'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// 定义脉冲动画
const pulseAnimation = {
  '0%': { opacity: 0.3, transform: 'translate(-50%, 0) scale(0.8)' },
  '50%': { opacity: 0.7, transform: 'translate(-50%, 0) scale(1.2)' },
  '100%': { opacity: 0.3, transform: 'translate(-50%, 0) scale(0.8)' },
}

export default function Home() {
  const {
    siteConfig: { customFields, tagline },
  } = useDocusaurusContext()
  const { description } = customFields as { description: string }

  // 响应式设计 - 小屏幕上减小偏移量
  const [offsetY, setOffsetY] = useState(-70)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOffsetY(-50)
      }
      else {
        setOffsetY(-70)
      }
    }

    // 初始化
    handleResize()

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Layout title={tagline} description={description}>
      <main className="overflow-hidden">
        <Hero />
        <Particles className="absolute inset-0" quantity={100} ease={80} color="#ffffff" refresh />

        <motion.div
          className="relative z-[15]"
          style={{ marginTop: `${offsetY}px` }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          {/* 内容容器 */}
          <div
            className="mx-auto max-w-7xl rounded-t-[45px] bg-background lg:px-8"
            style={{
              position: 'relative',
              zIndex: 2,
              boxShadow: '0 -20px 60px rgba(0, 0, 0, 0.08), 0 30px 60px rgba(0, 0, 0, 0.12)',
              background: 'linear-gradient(180deg, var(--ifm-background-color) 0%, var(--ifm-background-color) 100%)',
            }}
          >
            {/* 模糊背景效果 */}
            <div
              className="absolute inset-x-[5%] top-[-30px] z-[1] h-[60px]"
              style={{
                background: 'linear-gradient(to bottom, transparent, var(--ifm-background-color) 80%)',
                filter: 'blur(15px)',
                opacity: 0.8,
                borderRadius: '50% 50% 0 0',
              }}
            />

            {/* 圆角边框装饰 - 第3层 */}
            <div
              className="absolute inset-x-0 top-[-2px] z-[3] h-[55px] overflow-hidden rounded-t-[45px]"
              style={{
                background: 'var(--ifm-background-color)',
                boxShadow: 'inset 0 0 0 2px var(--ifm-background-surface-color)',
              }}
            >
              {/* 顶部高光效果 */}
              <div
                className="absolute inset-x-[10%] top-0 z-[4] h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(32, 180, 250, 0.3) 50%, transparent 100%)',
                  boxShadow: '0 0 15px 1px rgba(32, 180, 250, 0.25)',
                  borderRadius: '3px',
                }}
              />

              {/* 内侧高光 */}
              <div
                className="absolute inset-x-[5%] top-[5px] z-[4] h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
                  opacity: '0.7',
                }}
              />
            </div>

            {/* 外部装饰边框 - 第2层 */}
            <div
              className="absolute inset-x-[-6px] top-[-6px] z-[1] h-[61px] rounded-t-[51px]"
              style={{
                background: 'transparent',
                boxShadow: '0 -10px 36px -10px rgba(32, 180, 250, 0.2)',
              }}
            />

            {/* 最外层光晕 - 第1层 */}
            <div
              className="absolute inset-x-[-15px] top-[-15px] z-0 h-[80px] rounded-t-[60px]"
              style={{
                background: 'transparent',
                boxShadow: '0 -10px 40px -5px rgba(32, 180, 250, 0.15), 0 -2px 15px rgba(32, 180, 250, 0.08)',
              }}
            />

            {/* 顶部装饰线 - 居中放置 */}
            <div className="relative z-[5] flex justify-center">
              <div
                className="-mt-1 h-1.5 w-32 rounded-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent sm:w-40"
                style={{ boxShadow: '0 0 20px 5px rgba(32, 180, 250, 0.3)' }}
              />
            </div>

            {/* 额外的辉光点 - 使用motion.div实现动画 */}
            <motion.div
              className="absolute left-1/2 top-[-45px] z-[5] size-8 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(32, 180, 250, 0.3) 0%, transparent 70%)',
                filter: 'blur(8px)',
                x: '-50%',
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-[2] px-4 pt-8 sm:pt-10 lg:px-8 lg:pt-14">
              <BlogSection />
              <ProjectSection />
              <AIAssistantSection />
              <PersonalTraitsSection />
            </div>
          </div>

          {/* 背景网格 */}
          <div
            className="absolute inset-0 -z-50 bg-grid-slate-50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.3))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
            style={{ backgroundPosition: '10px 10px;' }}
          />
        </motion.div>
      </main>
    </Layout>
  )
}
