import Translate from "@docusaurus/Translate";
import { type Project, projects } from "@site/data/projects";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Section } from "../Section/Section";
import styles from "./styles.module.css";

// 项目Modal组件
export function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
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
        style={{ zIndex: 10000 }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
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
              repeatType: "reverse",
              duration: 5,
            }}
          />
        </div>

        {/* 项目描述 */}
        <div className="mt-4">
          <h3 className="text-base font-medium">项目描述</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            {project.description || "作者暂未添加项目描述"}
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
              className="group inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              预览演示
              <Icon
                icon="ri:external-link-line"
                className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
              />
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
              <Icon
                icon="ri:github-fill"
                className="ml-1 transition-transform duration-300 group-hover:translate-y-[-2px]"
              />
            </motion.a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 更新指示器
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // 初始化时设置第一个项目为激活状态
    const updateActiveItem = () => {
      if (slideRef.current) {
        const items = slideRef.current.querySelectorAll(`.${styles.item}`);
        if (items && items.length > 0) {
          const firstItem = items[0] as HTMLElement;
          if (firstItem) {
            // 获取第一个项目的title属性
            const projectTitle = firstItem.getAttribute("data-title");
            // 找到项目在数组中的索引
            const projectIndex = showProjects.findIndex(
              (p) => p.title === projectTitle
            );
            if (projectIndex !== -1) {
              setActiveIndex(projectIndex);
            }
          }
        }
      }
    };

    if (!isMobile) updateActiveItem();
  }, [isMobile]);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    // 阻止滚动
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // 恢复滚动
    document.body.style.overflow = "auto";
  };

  // 只展示有预览图的最近项目（5 个：中间 1，左右各 2）。不足 5 个时循环填充。
  const base = projects.filter((i) => i.preview);
  const showProjects = Array.from(
    { length: Math.min(5, Math.max(1, base.length)) },
    (_, i) => base[i % base.length]
  ).slice(0, 5);

  // 处理下一个项目
  const handleNext = () => {
    if (slideRef.current) {
      const items = slideRef.current.querySelectorAll(`.${styles.item}`);
      if (items.length > 0) {
        const firstItem = items[0] as HTMLElement;
        if (firstItem) {
          slideRef.current.appendChild(firstItem);

          // 更新指示器
          const projectTitle = firstItem.getAttribute("data-title");
          const projectIndex = showProjects.findIndex(
            (p) => p.title === projectTitle
          );
          if (projectIndex !== -1) {
            setActiveIndex((projectIndex + 1) % showProjects.length);
          }
        }
      }
    }
  };

  // 处理上一个项目
  const handlePrev = () => {
    if (slideRef.current) {
      const items = slideRef.current.querySelectorAll(`.${styles.item}`);
      if (items.length > 0) {
        const lastItem = items[items.length - 1] as HTMLElement;
        if (lastItem) {
          slideRef.current.prepend(lastItem);

          // 更新指示器
          const projectTitle = lastItem.getAttribute("data-title");
          const projectIndex = showProjects.findIndex(
            (p) => p.title === projectTitle
          );
          if (projectIndex !== -1) {
            setActiveIndex(projectIndex);
          }
        }
      }
    }
  };

  // 点击侧边卡片，将其滚动到中间（成为第一个）
  const focusProject = (title: string) => {
    if (!slideRef.current) return;
    const items = Array.from(
      slideRef.current.querySelectorAll(`.${styles.item}`)
    ) as HTMLElement[];
    const idx = items.findIndex(
      (el) => el.getAttribute("data-title") === title
    );
    if (idx <= 0) return;
    for (let i = 0; i < idx; i++) {
      const first = slideRef.current.querySelector(
        `.${styles.item}`
      ) as HTMLElement | null;
      if (first) slideRef.current.appendChild(first);
    }
    const projectIndex = showProjects.findIndex((p) => p.title === title);
    if (projectIndex !== -1) setActiveIndex(projectIndex);
  };

  return (
    <Section
      title={<Translate id="homepage.project.title">项目展示</Translate>}
      icon="ri:projector-line"
      href="/project"
    >
      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {showProjects.map((project) => (
            <div
              key={project.title}
              className="relative h-48 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-slate-900"
            >
              <img
                src={project.preview}
                alt={project.title}
                className="absolute inset-0 size-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="relative z-10 flex h-full items-end p-4">
                <div className="w-full">
                  <div className="text-sm font-bold text-white">
                    {project.title}
                  </div>
                  <div className="mt-1 line-clamp-1 text-xs text-slate-300">
                    {project.description || "作者暂未添加项目描述"}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg bg-[color:var(--ifm-color-primary)] px-3 py-1 text-xs font-medium text-white"
                      >
                        预览
                      </a>
                    )}
                    <button
                      className="inline-flex items-center rounded-lg border border-white/20 px-3 py-1 text-xs text-white"
                      onClick={() => handleOpenModal(project)}
                    >
                      详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.slide} ref={slideRef}>
            {showProjects.map((project, index) => (
              <div
                key={project.title}
                className={styles.item}
                data-title={project.title}
                style={{
                  background: `url(${project.preview})`,
                  backgroundPosition: "50% 50%",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                onClick={() => focusProject(project.title)}
              >
                <div className={styles.content}>
                  <div className={styles.name}>{project.title}</div>
                  <div className={styles.description}>
                    {project.description || "作者暂未添加项目描述"}
                  </div>
                  <button
                    className={styles.seeMoreBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(project);
                    }}
                  >
                    查看详情
                    <Icon icon="ri:arrow-right-line" className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 项目详情Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Section>
  );
}
