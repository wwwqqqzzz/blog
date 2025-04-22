import { type Variants, motion } from 'framer-motion'
import Translate from '@docusaurus/Translate'
import { useEffect, useRef } from 'react'
import Typewriter from 'typewriter-effect/dist/core'
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

function DecorativeIcons() {
  return (
    <div className={styles.decorative_icons}>
      <motion.div 
        className={styles.icon_wrapper}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Icon icon="logos:react" className={styles.tech_icon} />
      </motion.div>
      <motion.div 
        className={styles.icon_wrapper}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Icon icon="logos:typescript-icon" className={styles.tech_icon} />
      </motion.div>
      <motion.div 
        className={styles.icon_wrapper}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Icon icon="logos:nodejs-icon" className={styles.tech_icon} />
      </motion.div>
    </div>
  )
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
      <Translate id="homepage.hero.greet">你好! 我是</Translate>
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

export default function Hero() {
  const typewriterRef = useRef(null)

  useEffect(() => {
    if (typewriterRef.current) {
      new Typewriter(typewriterRef.current, {
        strings: ['在这里我会分享各类技术栈所遇到问题与解决方案，带你了解最新的技术栈以及实际开发中如何应用，并希望我的开发经历对你有所启发。'],
        autoStart: true,
        loop: false,
        delay: 50,
        deleteSpeed: Infinity,
      })
    }
  }, [])

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
          ref={typewriterRef}
        >
          {/* 这里原来的文字被Typewriter替换 */}
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
