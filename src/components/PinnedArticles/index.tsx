import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import React from "react";
import type { BlogPostData } from "@site/src/types/blog";
import { cn } from "@site/src/lib/utils";
import Tag from "@site/src/theme/Tag";
import { Icon } from "@iconify/react";

export default function PinnedArticles({
  items,
  currentTag = "",
}: {
  items: BlogPostData[];
  currentTag?: string;
}) {
  const pinnedItems = items.filter((item) => item.pinned);
  if (pinnedItems.length === 0) return null;

  // Swiss Hero Layout: Huge Type Left, Image Right (if 1)
  // If multiple, stack them vertically as heroes.

  return (
    <section className="mb-20">
      <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#10B981] uppercase font-mono">
        <span className="h-2 w-2 bg-[#10B981]"></span>
        置顶精选
      </div>

      <div className="flex flex-col gap-12">
        {pinnedItems.map((item, index) => (
          <motion.div
            key={item.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={item.link}
              className="group grid grid-cols-1 md:grid-cols-12 gap-8 items-center hover:no-underline"
            >
              {/* Content Side (Left) */}
              <div className="md:col-span-7 flex flex-col justify-center order-2 md:order-1">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-slate-900 dark:text-white group-hover:text-[#10B981] transition-colors mb-6 font-['MiSans']">
                  {item.title}
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 line-clamp-3 mb-8 max-w-2xl font-serif leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase">
                  <span className="text-white bg-black dark:bg-white dark:text-black px-3 py-1">
                    READ NOW
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-white/10 group-hover:bg-[#10B981]"></div>
                  <span className="text-[#10B981]">{item.date}</span>
                </div>
              </div>

              {/* Image Side (Right) */}
              <div className="md:col-span-5 h-[300px] md:h-[400px] w-full overflow-hidden order-1 md:order-2">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                  />
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
