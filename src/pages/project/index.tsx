import React, { useState, useRef, useEffect } from "react";
import Layout from "@theme/Layout";
import {
  projects,
  Project,
  ProjectType,
  projectTypeMap,
} from "@site/data/projects";
import styles from "./styles.module.css";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// --- Components ---

const ProjectRow = ({
  project,
  index,
  onHover,
  onLeave,
  isDimmed,
}: {
  project: Project;
  index: number;
  onHover: (p: Project) => void;
  onLeave: () => void;
  isDimmed: boolean;
}) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDimmed ? 0.2 : 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={styles.projectRow}
      onMouseEnter={() => onHover(project)}
      onMouseLeave={onLeave}
    >
      <a
        href={project.website || project.source || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.rowLink}
      >
        <div className={styles.rowContent}>
          <span className={styles.rowIndex}>
            {(index + 1).toString().padStart(2, "0")}
          </span>
          <h3 className={styles.rowTitle}>{project.title}</h3>
        </div>

        <div className={styles.rowMeta}>
          <span className={styles.rowTag}>
            {{
              web: "网站",
              app: "应用",
              commerce: "商业",
              personal: "个人",
              toy: "玩具",
              other: "其他",
            }[project.type] || project.type}
          </span>
          <span className={styles.rowYear}>{project.tags[0] || "2024"}</span>
          <span className={styles.rowArrow}>
            <FaArrowRight />
          </span>
        </div>
      </a>
    </motion.li>
  );
};

export default function ProjectsPage(): React.JSX.Element {
  const [filter, setFilter] = useState<ProjectType | "all">("all");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Mouse tracking for floating image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the cursor/image
  const springConfig = { damping: 20, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const filteredProjects = projects.filter((project) =>
    filter === "all" ? true : project.type === filter,
  );

  return (
    <Layout title="项目列表" description="Personal Projects Archive">
      <div className={styles.projectPage}>
        {/* Floating Preview Image */}
        <motion.div
          className={styles.floatingPreview}
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={styles.previewImageWrapper}
              >
                <img
                  src={activeProject.preview}
                  alt={activeProject.title}
                  className={styles.previewImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(activeProject.title)}&background=101010&color=808080`;
                  }}
                />
                <div className={styles.previewMeta}>
                  <span>{activeProject.description}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <main className={styles.mainContainer}>
          {/* Minimal Header */}
          <header className={styles.hero}>
            <h1 className={styles.title}>Selected Work</h1>

            <div className={styles.filterBar}>
              {["all", ...Object.keys(projectTypeMap)].map((type) => {
                const labelMap: Record<string, string> = {
                  all: "全部",
                  web: "网站",
                  app: "应用",
                  commerce: "商业项目",
                  personal: "个人",
                  toy: "玩具",
                  other: "其他",
                };

                return (
                  <button
                    key={type}
                    className={`${styles.filterChip} ${filter === type ? styles.filterChipActive : ""}`}
                    onClick={() => setFilter(type as ProjectType | "all")}
                  >
                    {labelMap[type] || type}
                  </button>
                );
              })}
            </div>
          </header>

          {/* List View */}
          <ul className={styles.projectList}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectRow
                  key={project.title}
                  project={project}
                  index={index}
                  onHover={setActiveProject}
                  onLeave={() => setActiveProject(null)}
                  isDimmed={
                    activeProject !== null &&
                    activeProject.title !== project.title
                  }
                />
              ))}
            </AnimatePresence>
          </ul>
        </main>
      </div>
    </Layout>
  );
}
