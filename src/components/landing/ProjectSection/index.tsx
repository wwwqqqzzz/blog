import Translate from '@docusaurus/Translate'
import { type Project, projects } from '@site/data/projects'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { Section } from '../Section'

const removeHttp = (url: string) => {
  return url.replace(/(^\w+:|^)\/\//, '')
}

// 项目卡片组件
export function ProjectCard({ project, onOpenModal }: { project: Project, onOpenModal: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group relative h-full overflow-hidden rounded-xl bg-card shadow-md transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onOpenModal}
    >
      {/* 项目图片 */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={project.preview}
          alt={project.title}
          className="size-full object-cover transition-transform duration-500 ease-in-out"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          loading="lazy"
        />
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70" />
      </div>

      {/* 项目内容 */}
      <div className="p-4">
        <h3 className="text-lg font-medium">{project.title}</h3>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
          {project.description || '一个精彩的项目'}
        </p>

        {/* 标签区域 */}
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags?.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 查看详情按钮 */}
        <motion.div
          className="mt-4 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className="hover:bg-primary/80 inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onOpenModal()
            }}
          >
            查看详情
            <Icon icon="ri:external-link-line" className="ml-1" />
          </button>
        </motion.div>
      </div>
    </motion.div>
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
        className="relative mx-4 w-full max-w-2xl rounded-xl bg-card p-6 shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
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
          <img
            src={project.preview}
            alt={project.title}
            className="size-full object-cover"
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
              <span
                key={idx}
                className="bg-muted text-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 链接区域 */}
        <div className="mt-6 flex flex-wrap gap-3">
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              className="hover:bg-primary/80 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              预览演示
              <Icon icon="ri:external-link-line" className="ml-1" />
            </a>
          )}
          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noreferrer"
              className="bg-muted text-foreground hover:bg-muted/80 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              GitHub代码
              <Icon icon="ri:github-fill" className="ml-1" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function ProjectSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  // 只展示有预览图的项目
  const showProjects = projects.filter(i => i.preview)

  return (
    <Section
      title={<Translate id="homepage.project.title">项目展示</Translate>}
      icon="ri:projector-line"
      href="/project"
    >
      {/* 交错网格布局 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {showProjects.map((project, index) => (
          <div
            key={project.title}
            className={`${index % 2 === 0 ? 'sm:mt-0' : 'sm:mt-10'}`}
          >
            <ProjectCard
              project={project}
              onOpenModal={() => handleOpenModal(project)}
            />
          </div>
        ))}
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
