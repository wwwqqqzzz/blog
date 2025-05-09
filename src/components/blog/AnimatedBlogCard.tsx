import React, { useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Icon } from '@iconify/react'
import Link from '@docusaurus/Link'
import { BlogPostData } from '@site/src/types/blog'
import Image from '@theme/IdealImage'
import { cn } from '@site/src/lib/utils'

interface AnimatedBlogCardProps {
  /**
   * 博客文章数据
   */
  post: BlogPostData
  /**
   * 动画效果类型
   */
  effect?: 'tilt' | 'float' | 'zoom' | 'shine'
  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 高级动画博客卡片组件
 * 提供多种视觉效果，增强用户交互体验
 */
export default function AnimatedBlogCard({
  post,
  effect = 'tilt',
  className,
}: AnimatedBlogCardProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false)
  const { title, description, link, date, tags, image } = post

  // 处理日期格式
  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // 鼠标位置跟踪（用于倾斜效果）
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // 转换鼠标位置为旋转角度
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  // 平滑的春季物理效果
  const springConfig = { damping: 15, stiffness: 150 }
  const scaleSpring = useSpring(1, springConfig)
  const rotateXSpring = useSpring(0, springConfig)
  const rotateYSpring = useSpring(0, springConfig)

  // 处理鼠标移动（倾斜效果）
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (effect !== 'tilt') return

    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) / 5)
    y.set((e.clientY - centerY) / 5)

    rotateXSpring.set(rotateX.get())
    rotateYSpring.set(rotateY.get())
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (effect === 'zoom') {
      scaleSpring.set(1.03)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    rotateXSpring.set(0)
    rotateYSpring.set(0)
    scaleSpring.set(1)
  }

  // 选择正确的动画变体
  const getMotionProps = () => {
    const baseProps = {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    }

    const effectProps = {
      tilt: {
        style: {
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformPerspective: 1000,
        },
      },
      float: {
        whileHover: { y: -10 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      },
      zoom: {
        style: { scale: scaleSpring },
      },
      shine: {},
    }

    return { ...baseProps, ...effectProps[effect] }
  }

  return (
    <motion.div
      className={cn(
        'relative h-full overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800',
        effect === 'shine' && 'group',
        className,
      )}
      {...getMotionProps()}
    >
      {/* 闪光效果 */}
      {effect === 'shine' && (
        <motion.div
          className="group-hover:animate-shine pointer-events-none absolute -inset-full top-0 z-10 block h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-1000 group-hover:opacity-100"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
        />
      )}

      {/* 文章图片 */}
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            img=""
            className="size-full object-cover transition-transform duration-700"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

          {/* 日期标签 */}
          <div className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 backdrop-blur-sm dark:bg-black/50 dark:text-white">
            {formattedDate}
          </div>
        </div>
      )}

      {/* 文章内容 */}
      <div className="flex h-56 flex-col justify-between p-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {tags?.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
              >
                {typeof tag === 'string' ? tag : (tag as any).label}
              </span>
            ))}
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
            <Link href={link} className="text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
              {title}
            </Link>
          </h3>

          <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>

        <Link
          href={link}
          className="group mt-4 inline-flex w-max items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
        >
          阅读全文
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: isHovered ? 5 : 0 }}
          >
            <Icon icon="ri:arrow-right-line" className="ml-1" />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  )
}
