import Translate from '@docusaurus/Translate'
import { type Project, projects } from '@site/data/projects'
import { motion } from 'framer-motion'
import React, { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { Section } from '../Section'
import styles from './styles.module.css'

const removeHttp = (url: string) => {
  return url.replace(/(^\w+:|^)\/\//, '')
}

// 项目卡片组件
const ProjectCard = ({
  project,
  index,
  active,
  onClick,
}: {
  project: Project
  index: number
  active: boolean
  onClick: () => void
}) => {
  return (
    <div
      className={`${styles.projectCard} ${active ? styles.active : ''}`}
      style={{ zIndex: active ? 10 : 10 - index }}
      onClick={onClick}
    >
      <div className={styles.projectCardInner}>
        <div
          className={styles.cardImage}
          style={{ backgroundImage: `url(${project.preview})` }}
        >
          <div className={styles.cardContent}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDesc}>
              {project.description || '作者暂未添加项目描述'}
            </p>
            <div className={styles.projectTags}>
              {project.tags?.slice(0, 3).map((tag, idx) => (
                <span key={idx} className={styles.projectTag}>
                  {tag}
                </span>
              ))}
            </div>
            <button className={styles.viewMoreBtn}>
              查看详情
              <Icon
                icon="ri:arrow-right-line"
                className={styles.btnIcon}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 项目轮播组件
const ProjectCarousel = ({
  projects,
  onSelectProject,
}: {
  projects: Project[]
  onSelectProject: (project: Project) => void
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [items, setItems] = useState([...projects])

  const handleNext = () => {
    const newItems = [...items]
    const firstItem = newItems.shift()
    if (firstItem) {
      newItems.push(firstItem)
      setItems(newItems)
    }
  }

  const handlePrev = () => {
    const newItems = [...items]
    const lastItem = newItems.pop()
    if (lastItem) {
      newItems.unshift(lastItem)
      setItems(newItems)
    }
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.slideContainer}>
        {items.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={index}
            active={index === activeIndex}
            onClick={() => onSelectProject(project)}
          />
        ))}
      </div>

      <div className={styles.navigation}>
        <button
          className={`${styles.navBtn} ${styles.prevBtn}`}
          onClick={handlePrev}
        >
          <Icon icon="ri:arrow-left-s-line" className={styles.navIcon} />
        </button>
        <button
          className={`${styles.navBtn} ${styles.nextBtn}`}
          onClick={handleNext}
        >
          <Icon icon="ri:arrow-right-s-line" className={styles.navIcon} />
        </button>
      </div>
    </div>
  )
}

// 项目Modal组件
export function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal内容 */}
      <motion.div
        className="relative mx-4 w-full max-w-2xl overflow-hidden rounded-xl bg-card p-6 shadow-xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* 顶部装饰条 */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />

        {/* 关闭按钮 */}
        <button
          className="text-muted-foreground hover:bg-muted hover:text-foreground absolute right-4 top-4 rounded-full p-1"
          onClick={onClose}
        >
          <Icon icon="ri:close-line" className="size-5" />
        </button>

        {/* 项目标题 */}
        <h2 className="text-xl font-bold">{project.title}</h2>

        {/* 项目图片 */}
        <div className="mt-4 overflow-hidden rounded-lg">
          <motion.img
            src={project.preview}
            alt={project.title}
            className="size-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.02 }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 5,
            }}
          />
        </div>

        {/* 项目描述 */}
        <div className="mt-4">
          <h3 className="text-base font-medium">项目描述</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            {project.description || '作者暂未添加项目描述'}
          </p>
        </div>

        {/* 技术栈 */}
        <div className="mt-4">
          <h3 className="text-base font-medium">技术栈</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tags?.map((tag, idx) => (
              <motion.span
                key={idx}
                className="bg-muted text-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* 链接区域 */}
        <div className="mt-6 flex flex-wrap gap-3">
          {project.website && (
            <motion.a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              className="hover:bg-primary/80 group inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              预览演示
              <Icon icon="ri:external-link-line" className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>
          )}
          {project.source && (
            <motion.a
              href={project.source}
              target="_blank"
              rel="noreferrer"
              className="bg-muted text-foreground hover:bg-muted/80 group inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              GitHub代码
              <Icon icon="ri:github-fill" className="ml-1 transition-transform duration-300 group-hover:translate-y-[-2px]" />
            </motion.a>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function ProjectSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const slideRef = useRef<HTMLDivElement>(null)

  // 更新指示器
  useEffect(() => {
    // 初始化时设置第一个项目为激活状态
    const updateActiveItem = () => {
      if (slideRef.current) {
        const items = slideRef.current.querySelectorAll(`.${styles.item}`)
        if (items && items.length > 0) {
          const firstItem = items[0] as HTMLElement
          if (firstItem) {
            // 获取第一个项目的title属性
            const projectTitle = firstItem.getAttribute('data-title')
            // 找到项目在数组中的索引
            const projectIndex = showProjects.findIndex(p => p.title === projectTitle)
            if (projectIndex !== -1) {
              setActiveIndex(projectIndex)
            }
          }
        }
      }
    }

    updateActiveItem()
  }, [])

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    // 阻止滚动
    document.body.style.overflow = 'hidden'
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // 恢复滚动
    document.body.style.overflow = 'auto'
  }

  // 只展示有预览图的最近5个项目
  const showProjects = projects.filter(i => i.preview).slice(0, 5)

  // 处理下一个项目
  const handleNext = () => {
    if (slideRef.current) {
      const items = slideRef.current.querySelectorAll(`.${styles.item}`)
      if (items.length > 0) {
        const firstItem = items[0] as HTMLElement
        if (firstItem) {
          slideRef.current.appendChild(firstItem)

          // 更新指示器
          const projectTitle = firstItem.getAttribute('data-title')
          const projectIndex = showProjects.findIndex(p => p.title === projectTitle)
          if (projectIndex !== -1) {
            setActiveIndex((projectIndex + 1) % showProjects.length)
          }
        }
      }
    }
  }

  // 处理上一个项目
  const handlePrev = () => {
    if (slideRef.current) {
      const items = slideRef.current.querySelectorAll(`.${styles.item}`)
      if (items.length > 0) {
        const lastItem = items[items.length - 1] as HTMLElement
        if (lastItem) {
          slideRef.current.prepend(lastItem)

          // 更新指示器
          const projectTitle = lastItem.getAttribute('data-title')
          const projectIndex = showProjects.findIndex(p => p.title === projectTitle)
          if (projectIndex !== -1) {
            setActiveIndex(projectIndex)
          }
        }
      }
    }
  }

  return (
    <Section
      title={<Translate id="homepage.project.title">项目展示</Translate>}
      icon="ri:projector-line"
      href="/project"
    >
      <div className={styles.container}>
        <div className={styles.slide} ref={slideRef}>
          {showProjects.map((project, index) => (
            <div
              key={project.title}
              className={styles.item}
              data-title={project.title}
              style={{
                background: `url(${project.preview})`,
                backgroundPosition: '50% 50%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
              onClick={() => handleOpenModal(project)}
            >
              <div className={styles.content}>
                <div className={styles.name}>{project.title}</div>
                <div className={styles.description}>
                  {project.description || '作者暂未添加项目描述'}
                </div>
                <button className={styles.seeMoreBtn}>
                  查看详情
                  <Icon icon="ri:arrow-right-line" className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 导航按钮 */}
        <div className={styles.button}>
          <button className={styles.prev} onClick={handlePrev}>
            <Icon icon="fa-solid:arrow-left" />
          </button>
          <button className={styles.next} onClick={handleNext}>
            <Icon icon="fa-solid:arrow-right" />
          </button>
        </div>

        {/* 指示器小点 */}
        <div className={styles.indicators}>
          {showProjects.map((_, index) => (
            <div
              key={index}
              className={`${styles.indicator} ${index === activeIndex ? styles.active : ''}`}
            />
          ))}
        </div>
      </div>

      {/* 项目详情Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Section>
  )
}
