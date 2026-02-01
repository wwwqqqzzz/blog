import Link from "@docusaurus/Link";
import type { BlogPost } from "@docusaurus/plugin-content-blog";
import { usePluginData } from "@docusaurus/useGlobalData";
import { cn } from "@site/src/lib/utils";
import Image from "@theme/IdealImage";
import React, { useMemo, useState } from "react";
import { Section } from "../Section/Section";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";

function FilterPill({
  active,
  label,
  onClick,
  icon,
  count,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon?: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "group relative overflow-hidden flex-shrink-0 flex items-center justify-center gap-2 rounded-[2.2rem] h-9 w-auto px-3 text-[13px] font-medium tracking-wider ring-1 transition-colors duration-200",
        active
          ? "text-white bg-[color:var(--ifm-color-primary)] ring-[color:var(--ifm-color-primary)]/60 shadow-[0_6px_16px_rgba(9,98,72,0.3)] hover:bg-[color:var(--ifm-color-primary-dark)] hover:ring-[color:var(--ifm-color-primary)]/70"
          : "text-slate-700 dark:text-slate-300 bg-transparent ring-slate-300/40 dark:ring-white/10 hover:text-[color:var(--ifm-color-primary)] dark:hover:text-[color:var(--ifm-color-primary)] hover:bg-[rgba(9,98,72,0.08)] dark:hover:bg-[rgba(9,98,72,0.18)] hover:ring-[color:var(--ifm-color-primary)]/40"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40">
        <div className="absolute left-[-20%] top-0 h-full w-[140%] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-[6px]" />
      </div>
      <span className="relative z-10 flex items-center gap-1.5">
        {icon && <Icon icon={icon} className="text-base" />}
        <span className="max-w-[88px] truncate whitespace-nowrap">{label}</span>
      </span>
      {typeof count === "number" && count > 0 && (
        <span
          className={cn(
            "absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ring-1",
            active
              ? "bg-white/20 text-white ring-white/30"
              : "bg-[rgba(9,98,72,0.7)] text-white ring-white/30"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function HeroCard({ post }: { post: BlogPost }) {
  const { metadata } = post;
  const { frontMatter, title, description, permalink, date, readingTime } =
    metadata as any;
  return (
    <Link
      href={permalink}
      className="group relative col-span-1 row-span-2 block h-full min-h-[360px] md:min-h-[500px] w-full overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl ring-1 ring-white/10 transition-all duration-700 hover:shadow-[0_0_50px_rgba(9,98,72,0.35)] hover:ring-primary/50 md:col-span-2"
    >
      <div className="absolute inset-0 h-full w-full">
        {frontMatter?.image && (
          <Image
            src={frontMatter.image}
            alt={title}
            img=""
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end p-8 md:p-12">
        <div className="mb-6 flex flex-wrap gap-2">
          {(frontMatter?.tags || [])
            .slice(0, 3)
            .map((tag: any, idx: number) => (
              <span
                key={idx}
                className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors group-hover:bg-[rgba(9,98,72,0.7)]"
              >
                {typeof tag === "string" ? tag : (tag as any).label}
              </span>
            ))}
        </div>
        <h3 className="mb-4 text-2xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
          {title}
        </h3>
        {description && (
          <p className="mb-8 line-clamp-2 max-w-2xl text-lg text-slate-300 md:text-xl">
            {description}
          </p>
        )}
        <div className="flex items-center gap-6 border-t border-white/10 pt-6 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <Icon icon="ri:calendar-line" className="text-[#096248]" />
            {new Date(date).toLocaleDateString("zh-CN", {
              month: "long",
              day: "numeric",
            })}
          </div>
          {readingTime && (
            <div className="flex items-center gap-2">
              <Icon icon="ri:time-line" className="text-[#096248]" />
              {Math.ceil(readingTime)} 分钟阅读
            </div>
          )}
          <div className="ml-auto flex items-center gap-2 text-white opacity-0 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-100">
            <span className="text-sm font-bold uppercase tracking-widest">
              阅读全文
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#096248]">
              <Icon icon="ri:arrow-right-line" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SecondaryCard({ post }: { post: BlogPost }) {
  const { metadata } = post;
  const { frontMatter, title, date, permalink } = metadata as any;
  return (
    <Link
      href={permalink}
      className="group relative flex h-full min-h-[200px] md:min-h-[260px] flex-col overflow-hidden rounded-[2rem] bg-slate-900 ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:ring-[rgba(9,98,72,0.4)]"
    >
      <div className="absolute inset-0 z-0">
        {frontMatter?.image && (
          <Image
            src={frontMatter.image}
            alt={title}
            img=""
            className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
      </div>
      <div className="relative z-10 flex h-full flex-col p-8">
        <div className="flex items-center justify-between">
          <span className="rounded-md border border-[rgba(9,98,72,0.3)] bg-[rgba(9,98,72,0.2)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#096248] backdrop-blur-sm">
            {(frontMatter?.tags || ["Article"])[0]}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {new Date(date).toLocaleDateString("zh-CN", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="mt-auto">
          <h4 className="line-clamp-2 text-lg md:text-xl font-bold leading-tight text-white transition-colors group-hover:text-[#0eb17b]">
            {title}
          </h4>
          <div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 group-hover:bg-[rgba(9,98,72,0.9)] group-hover:scale-110">
            <Icon icon="ri:arrow-right-up-line" className="text-sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CompactItem({ post }: { post: BlogPost }) {
  const { metadata } = post;
  const fm: any = metadata.frontMatter;
  return (
    <Link
      href={metadata.permalink}
      className="group flex items-center gap-5 rounded-3xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.05] hover:scale-[1.02]"
    >
      <div className="relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-800 ring-1 ring-white/10">
        {fm?.image && (
          <Image
            src={fm.image}
            alt={metadata.title}
            img=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#096248]">
            {fm?.tags?.[0]}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-slate-500"></span>
          <span className="text-[10px] text-slate-500">{metadata.date}</span>
        </div>
        <h5 className="truncate text-lg font-bold text-slate-200 group-hover:text-white">
          {metadata.title}
        </h5>
        {metadata.description && (
          <p className="mt-1 truncate text-sm text-slate-500 group-hover:text-slate-400">
            {metadata.description}
          </p>
        )}
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all group-hover:border-[rgba(9,98,72,0.5)] group-hover:text-[#096248]">
        <Icon icon="ri:arrow-right-line" />
      </div>
    </Link>
  );
}

export default function BlogSection(): React.ReactNode {
  const blogData = usePluginData("docusaurus-plugin-content-blog") as {
    posts: BlogPost[];
    postNum: number;
  };
  const [activeTag, setActiveTag] = useState("全部");
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    blogData.posts.forEach((p) =>
      (p.metadata.frontMatter?.tags || []).forEach((t: any) => {
        const label = typeof t === "string" ? t : (t as any).label;
        counts.set(label, (counts.get(label) || 0) + 1);
      })
    );
    return counts;
  }, [blogData.posts]);
  const tags = useMemo(() => {
    const sorted = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label]) => label);
    return ["全部", ...sorted];
  }, [tagCounts]);
  const filteredPosts = useMemo(() => {
    let result = blogData.posts;
    if (activeTag !== "全部") {
      result = result.filter((post) =>
        post.metadata.frontMatter?.tags?.some(
          (t: any) =>
            (typeof t === "string" ? t : (t as any).label) === activeTag
        )
      );
    }
    return result.slice(0, 5);
  }, [blogData.posts, activeTag]);
  const heroPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1, 3);
  const compactPosts = filteredPosts.slice(3, 5);
  if (blogData.postNum === 0) return null;
  return (
    <Section
      title={<span>近期博客</span>}
      icon="ri:quill-pen-line"
      href="/blog"
    >
      <div className="relative py-16">
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-4 flex items-center gap-2"
              >
                <div className="h-px w-8 bg-primary"></div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Insight & Thoughts
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-black tracking-tighter text-white md:text-7xl"
              >
                <span className="text-[#10B981] dark:text-white">Digital</span>{" "}
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "1px #475569" as any }}
                >
                  Garden
                </span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="scrollbar-none -mx-4 flex w-[calc(100%+2rem)] overflow-x-auto px-4 md:mx-0 md:w-auto md:px-0"
            >
              <div className="flex gap-1.5 md:gap-2 rounded-full border border-slate-200/60 dark:border-white/10 bg-transparent p-1 md:p-1.5">
                {tags.map((tag) => (
                  <FilterPill
                    key={tag}
                    label={tag}
                    active={activeTag === tag}
                    onClick={() => setActiveTag(tag)}
                    icon={tag === "全部" ? "ri:apps-fill" : undefined}
                    count={
                      tag === "全部"
                        ? blogData.posts.length
                        : tagCounts.get(tag) || 0
                    }
                  />
                ))}
              </div>
            </motion.div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
            >
              {filteredPosts.length > 0 ? (
                <>
                  {heroPost && (
                    <motion.div
                      initial={{ y: 20, opacity: 0, scale: 0.95 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 70,
                          damping: 20,
                        },
                      }}
                      className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2"
                    >
                      <HeroCard post={heroPost} />
                    </motion.div>
                  )}
                  <div className="col-span-1 flex flex-col gap-6 md:col-span-1 lg:col-span-2 lg:grid lg:grid-cols-2">
                    {secondaryPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ y: 30, opacity: 0, scale: 0.95 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 70,
                            damping: 20,
                          },
                        }}
                        className="h-full"
                      >
                        <SecondaryCard post={post} />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ y: 30, opacity: 0, scale: 0.95 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 70,
                        damping: 20,
                      },
                    }}
                    className="col-span-1 flex flex-col gap-3 md:gap-4 md:col-span-3 lg:col-span-4 lg:flex-row lg:items-center"
                  >
                    {compactPosts.map((post) => (
                      <div key={post.id} className="w-full lg:flex-1">
                        <CompactItem post={post} />
                      </div>
                    ))}
                    <Link
                      href="/blog"
                      className="group flex h-full min-h-[100px] w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-slate-400 transition-all hover:border-[rgba(9,98,72,0.5)] hover:bg-[rgba(9,98,72,0.1)] hover:text-[#096248] lg:w-auto lg:min-w-[200px]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-transform group-hover:scale-110 group-hover:bg-[rgba(9,98,72,0.2)]">
                        <Icon icon="ri:grid-fill" className="text-xl" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">
                        查看全部
                      </span>
                    </Link>
                  </motion.div>
                </>
              ) : (
                <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
                    <Icon
                      icon="ri:ghost-line"
                      className="text-5xl text-slate-600"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-300">
                    暂无内容
                  </h3>
                  <p className="text-slate-500">试试选择其他分类</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
