import React from 'react'
import { translate } from '@docusaurus/Translate'
import { projects } from '@site/data/projects'
import { Icon } from '@iconify/react'
import Link from '@docusaurus/Link'
import MyLayout from '@site/src/theme/MyLayout'
import { motion } from 'framer-motion'
import { cn } from '@site/src/lib/utils'
import styles from './project-status.module.css'

const TITLE = translate({
  id: 'theme.project-status.title',
  message: '项目部署状态说明',
})

const DESCRIPTION = translate({
  id: 'theme.project-status.description',
  message: '关于本站项目部署状态的说明',
})

// 将项目分为已部署和未部署两类
const deployedProjects = projects.filter(project => 
  project.website.startsWith('http') && 
  !project.website.includes('/project-status')
)

const notDeployedProjects = projects.filter(project => 
  !project.website.startsWith('http') || 
  project.website.includes('/project-status')
)

// 项目卡片组件
const ProjectCard = ({ 
  project, 
  isDeployed 
}: { 
  project: typeof projects[0], 
  isDeployed: boolean 
}) => {
  return (
    <motion.div 
      className={cn(
        styles.projectCard,
        isDeployed ? styles.deployed : styles.notDeployed
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className={styles.cardHeader}>
        <Icon 
          icon={isDeployed ? "ri:check-line" : "ri:code-line"} 
          className={styles.statusIcon} 
        />
        <h3 className={styles.projectTitle}>{project.title}</h3>
      </div>
      
      <p className={styles.projectDescription}>{project.description}</p>
      
      <div className={styles.projectLinks}>
        {isDeployed && (
          <Link href={project.website} className={styles.demoLink} target="_blank">
            <Icon icon="ri:external-link-line" style={{ marginRight: '0.3rem' }} />
            访问网站
          </Link>
        )}
        
        {!isDeployed && (
          <div className={styles.statusBadge}>
            <Icon icon="ri:information-line" style={{ marginRight: '0.3rem' }} />
            未部署到公网
          </div>
        )}
        
        {project.source && (
          <Link href={project.source} className={styles.sourceLink} target="_blank">
            <Icon icon="ri:github-fill" style={{ marginRight: '0.3rem' }} />
            查看源码
          </Link>
        )}
      </div>
    </motion.div>
  )
}

// 联系方式组件
const ContactMethods = () => {
  return (
    <div className={styles.contactMethods}>
      <motion.div 
        className={styles.contactMethod}
        whileHover={{ y: -2, backgroundColor: 'var(--ifm-color-emphasis-200)' }}
      >
        <Icon icon="ri:github-fill" className={styles.contactIcon} />
        <Link href="https://github.com/wwwqqqzzz" target="_blank">
          GitHub: wwwqqqzzz
        </Link>
      </motion.div>
      
      <motion.div 
        className={styles.contactMethod}
        whileHover={{ y: -2, backgroundColor: 'var(--ifm-color-emphasis-200)' }}
      >
        <Icon icon="ri:message-3-line" className={styles.contactIcon} />
        <Link href="/blog">
          博客留言：您可以在博客文章下方留言
        </Link>
      </motion.div>
    </div>
  )
}

// 主页面组件
export default function ProjectStatus(): JSX.Element {
  return (
    <MyLayout title={TITLE} description={DESCRIPTION}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{TITLE}</h1>
          <p>{DESCRIPTION}</p>
        </div>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Icon icon="ri:information-line" className={styles.sectionIcon} />
            关于项目部署
          </h2>
          <p className={styles.sectionDescription}>
            在我的<Link href="/project">项目展示</Link>页面中，您可以看到我开发的各种项目。这些项目分为两类：
          </p>
          <ul className={styles.infoList}>
            <li>
              <strong>已部署项目</strong> - 这些项目已经部署到公网，您可以通过点击项目标题或"预览演示"按钮直接访问它们。
            </li>
            <li>
              <strong>仅源码项目</strong> - 这些项目目前只提供源代码，尚未部署到公网。您可以通过点击"源码"按钮查看项目的GitHub仓库。
            </li>
          </ul>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Icon icon="ri:check-double-line" className={styles.sectionIcon} />
            已部署项目
          </h2>
          <p className={styles.sectionDescription}>
            目前，以下项目已经部署到公网，您可以直接访问：
          </p>
          <div className={styles.projectGrid}>
            {deployedProjects.map((project, index) => (
              <ProjectCard 
                key={project.title} 
                project={project} 
                isDeployed={true} 
              />
            ))}
          </div>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Icon icon="ri:code-box-line" className={styles.sectionIcon} />
            未部署项目
          </h2>
          <p className={styles.sectionDescription}>
            以下项目目前尚未部署到公网，仅提供源代码：
          </p>
          <div className={styles.projectGrid}>
            {notDeployedProjects.map((project, index) => (
              <ProjectCard 
                key={project.title} 
                project={project} 
                isDeployed={false} 
              />
            ))}
          </div>
        </section>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Icon icon="ri:question-line" className={styles.sectionIcon} />
            为什么有些项目未部署？
          </h2>
          <p className={styles.sectionDescription}>
            项目未部署可能有多种原因：
          </p>
          <ul className={styles.infoList}>
            <li>项目仍在开发中，尚未达到可部署状态</li>
            <li>项目是学习或实验性质，主要用于技术验证</li>
            <li>部署需要的服务器资源有限</li>
            <li>项目是为特定场景设计，不适合公开部署</li>
          </ul>
          
          <p className={styles.contactInfo}>
            如果您对某个未部署的项目特别感兴趣，欢迎通过以下方式联系我：
          </p>
          <ContactMethods />
        </section>
      </div>
    </MyLayout>
  )
}
