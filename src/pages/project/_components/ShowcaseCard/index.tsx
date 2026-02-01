import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { type Project, type Tag, TagList, type TagType, Tags } from "@site/data/projects";
import Tooltip from "@site/src/components/Tooltip";
import FavoriteIcon from "@site/src/components/svgIcons/FavoriteIcon";
import { cn } from "@site/src/lib/utils";
import { sortBy } from "@site/src/utils/jsUtils";
import Image from "@theme/IdealImage";
import React, { memo, useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";

const TagComp = React.forwardRef<HTMLLIElement, Tag>(
  ({ label, color, description }, ref) => (
    <li
      ref={ref}
      className={styles.tag}
      title={description}
      style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40` }}
    >
      <span className={styles.textLabel}>{label.toLowerCase()}</span>
    </li>
  )
);

function ShowcaseCardTag({ tags }: { tags: TagType[] }) {
  const tagObjects = tags.map((tag) => ({ tag, ...Tags[tag] }));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag)
  );

  return (
    <ul className={cn("card__footer", styles.cardFooter)}>
      {tagObjectsSorted.map((tagObject, index) => {
        const id = `showcase_card_tag_${tagObject.tag}`;

        return (
          <Tooltip
            key={index}
            text={tagObject.description}
            anchorEl="#__docusaurus"
            id={id}
          >
            <TagComp key={index} {...tagObject} />
          </Tooltip>
        );
      })}
    </ul>
  );
}

const ShowcaseCard = memo(({ project }: { project: Project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn("group relative h-full", styles.showcaseCard)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 卡片主体 */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300",
          "border-slate-200 hover:shadow-xl hover:border-emerald-200",
          "dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900 dark:hover:shadow-emerald-500/10"
        )}
      >
        {/* 预览图 */}
        {project.preview && (
          <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
            <Image
              src={project.preview}
              alt={project.title}
              img={project.preview}
              className={cn(
                "h-full w-full object-cover transition-transform duration-500",
                isHovered && "scale-110"
              )}
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />

            {/* 收藏标记 */}
            {project.tags.includes("favorite") && (
              <div className="absolute right-3 top-3">
                <FavoriteIcon svgClass={styles.svgIconFavorite} size="small" />
              </div>
            )}
          </div>
        )}

        {/* 卡片内容 */}
        <div className="p-5 space-y-3">
          {/* 标题 */}
          <div className={styles.showcaseCardHeader}>
            <h4 className={cn(styles.showcaseCardTitle, "text-lg font-bold text-slate-900 dark:text-white line-clamp-1")}>
              <Link
                href={project.website}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {project.title}
              </Link>
            </h4>
          </div>

          {/* 描述 */}
          <p className={cn(styles.showcaseCardBody, "text-sm text-slate-600 dark:text-slate-400 line-clamp-2")}>
            {project.description}
          </p>

          {/* 标签 */}
          <ShowcaseCardTag tags={project.tags} />

          {/* 操作按钮 */}
          <div className="flex items-center gap-2 pt-2">
            <Link
              href={project.website}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2 rounded-xl",
                "bg-gradient-to-r from-emerald-500 to-green-500",
                "px-4 py-2.5 text-sm font-semibold text-white",
                "transition-all duration-300",
                "hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5",
                "active:translate-y-0"
              )}
            >
              <Icon icon="lucide:external-link" className="h-4 w-4" />
              <Translate id="showcase.card.visitLink">访问</Translate>
            </Link>

            {project.source && (
              <Link
                href={project.source}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl",
                  "border-2 border-slate-200 px-4 py-2.5",
                  "text-sm font-semibold text-slate-700 transition-all duration-300",
                  "hover:border-emerald-500 hover:text-emerald-600",
                  "dark:border-slate-700 dark:text-slate-300",
                  "dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                )}
              >
                <Icon icon="lucide:github" className="h-4 w-4" />
                <Translate id="showcase.card.sourceLink">源码</Translate>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default ShowcaseCard;
