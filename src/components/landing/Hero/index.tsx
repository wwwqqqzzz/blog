import { type Variants, motion, useScroll, useTransform } from 'framer-motion'
import Translate from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import SocialLinks from '@site/src/components/SocialLinks'
import { MovingButton } from '../../magicui/moving-border'
import { DoodleDecoration } from '../../ui/doodle-decoration'
import styles from './styles.module.css'

const variants: Variants = {
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100,
      duration: 0.3,
      delay: i * 0.2,
    },
  }),
  hidden: { opacity: 0, y: 30 },
}

// 技术图标，响应式处理
const techIcons = [
  { icon: 'logos:react', title: 'React' },
  { icon: 'logos:typescript-icon', title: 'TypeScript' },
  { icon: 'logos:nodejs-icon', title: 'Node.js' },
  { icon: 'logos:vue', title: 'Vue' },
  { icon: 'logos:tailwindcss-icon', title: 'Tailwind CSS' },
  { icon: 'logos:nextjs-icon', title: 'Next.js' },
  { icon: 'logos:javascript', title: 'JavaScript' },
  { icon: 'logos:git-icon', title: 'Git' },
  { icon: 'logos:python', title: 'Python' },
  { icon: 'logos:webpack', title: 'Webpack' },
]

type TechIcon = {
  icon: string
  title: string
}

function Name() {
  return (
    <motion.div
      className={styles.hero_text}
      custom={1}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4 text-xl text-blue-400"
      >
        王起哲.dev
      </motion.div>
      <motion.div className="flex items-center justify-center gap-3">
        <span className={styles.name}>全栈开发者</span>
        <motion.span
          className="inline-block text-4xl"
          animate={{
            rotate: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          👋
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

function DecorativeIcons({ isMobile }) {
  // 使用所有图标，两行显示，每行5个
  return (
    <motion.div
      className={styles.decorative_icons}
      custom={3}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {techIcons.map(tech => (
        <motion.div
          key={tech.icon}
          className={styles.icon_wrapper}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          title={tech.title}
        >
          <Icon icon={tech.icon} className={styles.tech_icon} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function Hero() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // 初始化
    handleResize()

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // 只在非移动设备上启用鼠标跟踪效果
    if (isMobile) return

    const grid = gridRef.current
    if (!grid) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // 计算当前鼠标所在的格子位置
      const cellSize = 32 // 格子大小
      const cellX = Math.floor(x / cellSize) * cellSize
      const cellY = Math.floor(y / cellSize) * cellSize

      grid.style.setProperty('--mouse-x', `${cellX}px`)
      grid.style.setProperty('--mouse-y', `${cellY}px`)

      const glow = grid.querySelector('::before') as HTMLElement
      if (glow) {
        glow.style.transform = `translate(${x}px, ${y}px)`
        glow.style.opacity = '1'
      }
    }

    const handleMouseLeave = () => {
      const glow = grid.querySelector('::before') as HTMLElement
      if (glow) {
        glow.style.opacity = '0'
      }
    }

    grid.addEventListener('mousemove', handleMouseMove)
    grid.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      grid.removeEventListener('mousemove', handleMouseMove)
      grid.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isMobile])

  return (
    <motion.div className={styles.hero}>
      {/* 网格背景 */}
      <div ref={gridRef} className={styles.grid_background} />

      {/* 手绘装饰 */}
      <DoodleDecoration />

      {/* 装饰性几何图形 */}
      <div className={styles.geometric_shapes} />

      <div className={styles.intro}>
        <Name />
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={variants}
          className="max-lg:px-4"
        >
          <Translate id="homepage.hero.text">
            在这里我会分享各类技术栈所遇到问题与解决方案，带你了解最新的技术栈以及实际开发中如何应用，并希望我的开发经历对你有所启发。
          </Translate>
        </motion.p>
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={variants}
          className="relative flex w-full flex-wrap items-center justify-center"
          style={{
            zIndex: 100, // 确保容器也有高z-index
            position: 'relative',
            marginTop: '1rem',
            marginBottom: '1rem'
          }}
        >
          {/* 社交媒体链接容器 */}
          <div className="social-links-container" style={{ position: 'relative', zIndex: 200 }}>
            <SocialLinks className="social-links-hero" />
          </div>
        </motion.div>

        <motion.div
          className="mt-6 flex justify-center gap-3 md:mt-8"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <MovingButton
            borderRadius={isMobile ? '1rem' : '1.25rem'}
            className="relative z-10 flex items-center rounded-2xl border border-solid border-blue-500 bg-blue-500/10 px-4 py-2 text-center text-sm font-semibold text-blue-400 transition-all hover:bg-blue-500/20 hover:shadow-lg md:px-6 md:py-3 md:text-base"
          >
            <a href="/about" className="font-semibold">
              <Translate id="hompage.hero.introduce">了解更多</Translate>
            </a>
          </MovingButton>
        </motion.div>

        <DecorativeIcons isMobile={isMobile} />
      </div>

      {/* 平滑过渡元素 */}
      <motion.div
        className={styles.smooth_transition}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0.5 : 1, duration: 0.8 }}
      >
        <div className={styles.transition_wave}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            className={styles.wave_svg}
          >
            {/* 使用更平滑的曲线路径 */}
            <path
              d="M0,160 C240,100 480,180 720,150 C960,120 1200,160 1440,140 L1440,200 L0,200 Z"
              fill="var(--ifm-background-color)"
              fillOpacity="0.95"
            />
            <path
              d="M0,180 C320,150 720,190 1200,160 C1280,150 1360,180 1440,170 L1440,200 L0,200 Z"
              fill="var(--ifm-background-color)"
              fillOpacity="1"
            />
          </svg>
        </div>
        <div className={styles.transition_gradient}></div>
        <div className={styles.transition_line}></div>
      </motion.div>
    </motion.div>
  )
}
