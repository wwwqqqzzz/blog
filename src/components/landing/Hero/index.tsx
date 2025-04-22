import { type Variants, motion } from 'framer-motion'
import Translate from '@docusaurus/Translate'
import { Icon } from '@iconify/react'

import HeroSvg from './img/hero.svg'

import SocialLinks from '@site/src/components/SocialLinks'
import { MovingButton } from '../../magicui/moving-border'
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
      delay: i * 0.3,
    },
  }),
  hidden: { opacity: 0, y: 30 },
}

function Circle() {
  return <div className={styles.circle} />
}

function Name() {
  return (
    <motion.div
      className={styles.hero_text}
      custom={1}
      initial="hidden"
      animate="visible"
      variants={variants}
      onMouseMove={(e) => {
        e.currentTarget.style.setProperty('--x', `${e.clientX}px`)
        e.currentTarget.style.setProperty('--y', `${e.clientY}px`)
      }}
    >
      <Translate id="homepage.hero.greet">你好啊! 我是</Translate>
      <span
        className={styles.name}
        onMouseMove={(e) => {
          const bounding = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--mouse-x', `${bounding.x}px`)
          e.currentTarget.style.setProperty('--mouse-y', `${bounding.y}px`)
        }}
      >
        <Translate id="homepage.hero.name">王起哲</Translate>
      </span>
      <span className="ml-1">👋</span>
    </motion.div>
  )
}

function DecorativeIcons() {
  return (
    <motion.div
      className={styles.decorative_icons}
      custom={5}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:react" className={styles.tech_icon} />
      </div>
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:typescript-icon" className={styles.tech_icon} />
      </div>
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:nodejs-icon" className={styles.tech_icon} />
      </div>
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:vue" className={styles.tech_icon} />
      </div>
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:tailwindcss-icon" className={styles.tech_icon} />
      </div>
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:nextjs-icon" className={styles.tech_icon} />
      </div>
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:javascript" className={styles.tech_icon} />
      </div>
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:git-icon" className={styles.tech_icon} />
      </div>
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:python" className={styles.tech_icon} />
      </div>
      <div className={styles.icon_wrapper}>
        <Icon icon="logos:webpack" className={styles.tech_icon} />
      </div>
    </motion.div>
  )
}

export default function Hero() {
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
        <motion.div custom={3} initial="hidden" animate="visible" variants={variants}>
          <SocialLinks />
        </motion.div>

        <motion.div className="mt-4 flex gap-2" custom={4} initial="hidden" animate="visible" variants={variants}>
          <MovingButton
            borderRadius="1.25rem"
            className="relative z-10 flex items-center rounded-2xl border border-solid border-neutral-200 bg-background px-5 py-3 text-center text-base font-semibold dark:border-neutral-800"
          >
            <a href="/about" className="font-semibold">
              <Translate id="hompage.hero.introduce">自我介绍</Translate>
            </a>
          </MovingButton>
        </motion.div>

        <DecorativeIcons />
      </div>
      <motion.div className={styles.background}>
        <HeroSvg />
        <Circle />
      </motion.div>
    </motion.div>
  )
}
