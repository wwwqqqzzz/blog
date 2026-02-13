import Link from "@docusaurus/Link";
import type { BlogPost } from "@docusaurus/plugin-content-blog";
import { usePluginData } from "@docusaurus/useGlobalData";
import { cn } from "@site/src/lib/utils";
import Image from "@theme/IdealImage";
import React, { useRef } from "react";
import { Section } from "../Section/Section";
import { motion, useScroll, useTransform } from "framer-motion";

// --- Swiss Reel Card ---
function ReelCard({ post, index }: { post: BlogPost; index: number }) {
  const { metadata } = post;
  const { frontMatter, title, description, permalink, date } = metadata as any;
  const dateStr = new Date(date).toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={permalink}
      className="group relative flex h-[500px] w-[320px] shrink-0 flex-col justify-between border-r border-[#10B981] bg-white dark:bg-black p-6 transition-all hover:bg-[#10B981]/5"
    >
      {/* Top Meta */}
      <div className="flex items-start justify-between border-b border-[#10B981]/30 pb-4 mb-4">
        <span className="font-mono text-xs font-bold text-[#10B981]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-xs text-slate-400 group-hover:text-[#10B981]">
          {dateStr}
        </span>
      </div>

      {/* Middle Image Area */}
      <div className="relative flex-1 overflow-hidden opacity-80 transition-all duration-500 group-hover:opacity-100">
        {frontMatter?.image && (
          <Image
            src={frontMatter.image}
            alt={title}
            className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            img=""
          />
        )}
      </div>

      {/* Bottom Title */}
      <div className="mt-6 border-t border-[#10B981]/30 pt-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {(frontMatter?.tags || []).slice(0, 1).map((tag: any, i: number) => (
            <span
              key={i}
              className="text-[10px] uppercase tracking-wider text-slate-500"
            >
              {typeof tag === "string" ? tag : tag.label}
            </span>
          ))}
        </div>
        <h3 className="line-clamp-2 font-['MiSans'] text-2xl font-bold leading-tight text-slate-800 dark:text-slate-100 group-hover:text-[#10B981] transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}

export default function BlogSection(): React.ReactNode {
  const blogData = usePluginData("docusaurus-plugin-content-blog") as {
    posts: BlogPost[];
    postNum: number;
  };

  const posts = blogData.posts.slice(0, 8); // Show top 8
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!posts.length) return null;

  return (
    <Section
      title={<span></span>}
      icon=""
      href="/blog"
      className="py-20 overflow-hidden"
    >
      {/* Header */}
      <div className="container mb-8 flex items-baseline justify-between border-b-2 border-[#10B981] pb-4">
        <h2 className="font-['Space_Grotesk'] text-4xl font-bold tracking-tighter text-slate-900 dark:text-white md:text-6xl">
          LATEST <span className="text-[#10B981]">STORIES</span>
        </h2>
        <Link
          href="/blog"
          className="hidden font-mono text-sm text-[#10B981] hover:underline md:block"
        >
          VIEW ALL ARCHIVES →
        </Link>
      </div>

      {/* The Reel */}
      <div
        ref={scrollRef}
        className="scrollbar-none flex w-full overflow-x-auto border-y border-[#10B981]"
      >
        <div className="flex border-l border-[#10B981]">
          {posts.map((post, i) => (
            <ReelCard key={post.id} post={post} index={i} />
          ))}

          {/* View All Card */}
          <Link
            href="/blog"
            className="group flex h-[500px] w-[200px] shrink-0 flex-col items-center justify-center border-r border-[#10B981] bg-[#10B981]/5 text-[#10B981] transition-colors hover:bg-[#10B981] hover:text-white"
          >
            <span className="font-mono text-lg font-bold">VIEW ALL</span>
            <span className="text-3xl">→</span>
          </Link>
        </div>
      </div>

      {/* Mobile View All */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/blog"
          className="inline-block border-b border-[#10B981] pb-1 font-mono text-sm text-[#10B981]"
        >
          VIEW ALL ARCHIVES →
        </Link>
      </div>
    </Section>
  );
}
