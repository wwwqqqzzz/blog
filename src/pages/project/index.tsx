import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
// @ts-expect-error - 忽略扩展名问题
import {
  Project,
  ProjectType,
  Tags,
  groupByProjects,
  projectTypeMap,
  projects,
} from "@site/data/projects";
import { cn } from "@site/src/lib/utils";
import ShowcaseCard from "./_components/ShowcaseCard";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import { MagicContainer } from "@site/src/components/magicui/magic-card";
import MyLayout from "@site/src/theme/MyLayout";
import { upperFirst } from "@site/src/utils/jsUtils";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import Image from "@theme/IdealImage";

const TITLE = translate({
  id: "theme.project.title",
  message: "项目",
});
const DESCRIPTION = translate({
  id: "theme.project.description",
  message:
    "学而无用，不如学而用之。这里是我在技术领域中努力实践和应用的最佳证明。",
});

// const GITHUB_URL = 'https://github.com/kuizuo'

// 项目类型信息，包括图标和描述
const projectTypeInfo = {
  web: {
    icon: "carbon:application-web",
    description: "基于现代Web技术栈开发的网站项目，包括前端和全栈解决方案",
    color: "var(--ifm-color-primary)",
  },
  app: {
    icon: "carbon:application-mobile",
    description: "跨平台应用程序开发，提供桌面端与移动端一致的用户体验",
    color: "#10b981",
  },
  commerce: {
    icon: "carbon:shopping-cart",
    description: "商业项目和电子商务解决方案，支持在线交易和商业运营",
    color: "#f59e0b",
  },
  personal: {
    icon: "carbon:user",
    description: "个人开发和维护的项目，展示个人技能和兴趣领域",
    color: "#6366f1",
  },
  toy: {
    icon: "carbon:game-console",
    description: "实验性质的小型项目，用于探索新技术和创意想法",
    color: "#ec4899",
  },
  other: {
    icon: "carbon:cube",
    description: "不属于以上类别的其他类型项目",
    color: "#8b5cf6",
  },
};

type ProjectState = {
  scrollTopPosition: number;
  focusedElementId: string | undefined;
};

export function prepareUserState(): ProjectState | undefined {
  if (ExecutionEnvironment.canUseDOM) {
    return {
      scrollTopPosition: window.scrollY,
      focusedElementId: document.activeElement?.id,
    };
  }

  return undefined;
}

// 页面标题组件
function ShowcaseHeader() {
  return (
    <section className={styles.showcaseHeader}>
      <div className="container">
        <div className={styles.showcaseHeaderContent}>
          <motion.h1
            className={styles.showcaseHeaderTitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.showcaseHeaderDescription}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {DESCRIPTION}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// 项目类型选择器组件
function TypeSelector({ activeType, onTypeChange }) {
  // 获取有项目的类型
  const availableTypes = Object.entries(groupByProjects)
    .filter(([_, projects]) => projects.length > 0)
    .map(([type]) => type as ProjectType);

  return (
    <div className={styles.typeSelector}>
      <motion.button
        className={cn(
          styles.typeButton,
          activeType === null && styles.activeType
        )}
        onClick={() => onTypeChange(null)}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Icon icon="carbon:grid" className={styles.typeIcon} />
        <span>全部项目</span>
      </motion.button>

      {availableTypes.map((type) => (
        <motion.button
          key={type}
          className={cn(
            styles.typeButton,
            activeType === type && styles.activeType
          )}
          onClick={() => onTypeChange(type)}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Icon icon={projectTypeInfo[type].icon} className={styles.typeIcon} />
          <span>{projectTypeMap[type].split(" ")[1]}</span>
        </motion.button>
      ))}
    </div>
  );
}

// 项目预览模态框组件
function ProjectPreviewModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  if (!project) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <Icon icon="carbon:close" />
        </button>

        {project.preview && (
          <div className={styles.modalPreview}>
            <img src={project.preview} alt={project.title} />
            <div
              className={styles.modalPreviewType}
              style={{ background: projectTypeInfo[project.type].color }}
            >
              <Icon
                icon={projectTypeInfo[project.type].icon}
                className="mr-1"
              />
              <span>{projectTypeMap[project.type].split(" ")[1]}</span>
            </div>
          </div>
        )}

        <div className={styles.modalInfo}>
          <h2 className={styles.modalTitle}>{project.title}</h2>
          <p className={styles.modalDescription}>{project.description}</p>

          {project.tags.length > 0 && (
            <div className={styles.modalTags}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={styles.modalTag}
                  style={{ background: Tags[tag]?.color }}
                >
                  {Tags[tag]?.label || tag}
                </span>
              ))}
            </div>
          )}

          <div className={styles.modalActions}>
            <Link href={project.website} className={styles.modalButton}>
              <Icon icon="carbon:launch" className={styles.modalButtonIcon} />
              <span>访问项目</span>
            </Link>

            {project.source && (
              <Link
                href={project.source}
                className={cn(styles.modalButton, styles.modalButtonOutline)}
              >
                <Icon
                  icon="carbon:logo-github"
                  className={styles.modalButtonIcon}
                />
                <span>查看源码</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 主要展示组件
function ShowcaseCards() {
  const { i18n } = useDocusaurusContext();
  const lang = i18n.currentLocale;

  const [activeType, setActiveType] = useState<ProjectType | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 根据选择的类型过滤项目
  const filteredProjects = activeType ? groupByProjects[activeType] : projects;

  if (projects.length === 0) {
    return (
      <section className="margin-top--lg margin-bottom--xl">
        <div className="container text-center">
          <h2>暂无项目</h2>
        </div>
      </section>
    );
  }

  return (
    <section
      className={styles.showcaseSection}
      onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
    >
      <div className="container">
        <TypeSelector activeType={activeType} onTypeChange={setActiveType} />

        {activeType && (
          <div className={styles.typeInfo}>
            <div
              className={styles.typeIcon}
              style={{ background: projectTypeInfo[activeType].color }}
            >
              <Icon icon={projectTypeInfo[activeType].icon} />
            </div>
            <div className={styles.typeDetails}>
              <h2 className={styles.typeTitle}>{projectTypeMap[activeType]}</h2>
              <p className={styles.typeDescription}>
                {projectTypeInfo[activeType].description}
              </p>
            </div>
          </div>
        )}

        <div
          className={styles.ambient}
          style={{
            ["--cursorX" as any]: `${cursorPos.x}px`,
            ["--cursorY" as any]: `${cursorPos.y}px`,
            ["--scrollY" as any]: scrollY,
          }}
        />

        <div className={styles.projectsGrid}>
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.title}
              className={styles.card}
              style={{
                backgroundImage: project.preview
                  ? `url('${project.preview}')`
                  : undefined,
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => setPreviewProject(project)}
              onMouseMove={(e) => {
                const rect = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rx = (y / rect.height - 0.5) * -8;
                const ry = (x / rect.width - 0.5) * 8;
                (
                  e.currentTarget as HTMLElement
                ).style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeading}>
                  <h3>{project.title}</h3>
                </div>
                <div className={styles.cardBody}>
                  <p>{project.description}</p>
                  <div className={styles.rating}>
                    <Icon icon="mdi:star" />
                    <Icon icon="mdi:star" />
                    <Icon icon="mdi:star" />
                    <Icon icon="mdi:star" />
                    <Icon icon="mdi:star-half" />
                  </div>
                </div>
                <div className={styles.cardButtons}>
                  <Link
                    href={project.website}
                    className={styles.buttonWatch}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon icon="carbon:launch" />
                    <span>访问项目</span>
                  </Link>
                  {project.source && (
                    <Link
                      href={project.source}
                      className={styles.buttonWatchlist}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon icon="carbon:logo-github" />
                      <span>查看源码</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {previewProject && (
        <ProjectPreviewModal
          project={previewProject}
          onClose={() => setPreviewProject(null)}
        />
      )}
    </section>
  );
}

function Showcase(): React.ReactNode {
  return (
    <MyLayout title={TITLE} description={DESCRIPTION} maxWidth={1280}>
      <div className={styles.glassTopBar}>
        <div className={styles.glassLogo}>Portfolio</div>
        <div className={styles.glassActions}>
          <Icon icon="ri:github-line" />
          <Icon icon="ri:linkedin-line" />
        </div>
      </div>
      <main>
        <ShowcaseHeader />
        <ShowcaseCards />
      </main>
    </MyLayout>
  );
}

export default Showcase;
