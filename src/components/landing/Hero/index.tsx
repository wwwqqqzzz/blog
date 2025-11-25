import { type Variants, motion } from 'framer-motion'
import Translate from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import SocialLinks from '@site/src/components/SocialLinks'
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

function TechChips() {
  return (
    <motion.div
      className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {techIcons.map(t => (
        <span
          key={t.icon}
          title={t.title}
          className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary"
        >
          <Icon icon={t.icon} className="mr-1 text-sm" />
          {t.title}
        </span>
      ))}
    </motion.div>
  )
}

export default function Hero() {
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

  useEffect(() => {}, [isMobile])

  return (
    <motion.div className={styles.hero}>
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
          className="relative mt-4 mb-4 flex w-full flex-wrap items-center justify-center"
        >
          <SocialLinks className="social-links-hero" />
        </motion.div>

        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-3 md:mt-8"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <a
            href="/project"
            className="rounded-xl border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/20 md:text-base"
          >
            查看项目
          </a>
          <a
            href="/about"
            className="rounded-xl border border-primary/20 bg-background px-5 py-2 text-sm font-semibold transition-all hover:border-primary/40 md:text-base"
          >
            关于我
          </a>
          <a
            href="/blog"
            className="rounded-xl border border-primary/20 bg-background px-5 py-2 text-sm font-semibold transition-all hover:border-primary/40 md:text-base"
          >
            最近写作
          </a>
        </motion.div>

        <TechChips />
      </div>
    </motion.div>
  )
}
