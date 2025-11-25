import { type Variants, motion, AnimatePresence } from 'framer-motion'
import Translate from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import SocialLinks from '@site/src/components/SocialLinks'
import social from '@site/data/social'
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

function IconsRow() {
  return (
    <motion.div
      className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-4 px-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      aria-label="技术栈"
    >
      {techIcons.map(t => (
        <span
          key={t.icon}
          title={t.title}
          className="inline-flex items-center rounded-md bg-[color:var(--ifm-background-surface-color)]/40 p-2 text-[color:var(--ifm-color-primary)]"
        >
          <Icon icon={t.icon} className="text-xl opacity-80" />
        </span>
      ))}
    </motion.div>
  )
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)
  const phrases = [
    '欢迎光临！这里一半是干货，一半是我的碎碎念。祝你能分清它们。',
    'while (!success) { tryAgain(); }',
    '我正在把“胡思乱想”变成“字”，并为此感到骄傲。',
    'Hello, World! 哦不对，是 Hello, Reader!',
  ]
  const [phraseIndex, setPhraseIndex] = useState(0)

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
    const mq = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq && mq.matches) return
    const id = setInterval(() => {
      setPhraseIndex(i => (i + 1) % phrases.length)
    }, 4000)
    return () => clearInterval(id)
  }, [phrases.length])

  return (
    <motion.div className={styles.hero}>
      <div className={styles.intro}>
        <Name />
        <AnimatePresence mode="wait">
          <motion.div
            key={phrases[phraseIndex]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            {phrases[phraseIndex]}
          </motion.div>
        </AnimatePresence>
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
            className="rounded-xl border border-[color:var(--ifm-color-primary)]/40 bg-[color:var(--ifm-color-primary)]/10 px-5 py-2 text-sm font-semibold text-[color:var(--ifm-color-primary)] transition-all hover:bg-[color:var(--ifm-color-primary)]/20 md:text-base"
          >
            Projects
          </a>
          <a
            href={social.email?.href ?? 'mailto:2158588419@qq.com'}
            className="rounded-xl border border-[color:var(--ifm-color-primary)]/30 bg-background px-5 py-2 text-sm font-semibold transition-all hover:border-[color:var(--ifm-color-primary)]/50 md:text-base"
          >
            Contact
          </a>
        </motion.div>

        <IconsRow />
      </div>
    </motion.div>
  )
}
