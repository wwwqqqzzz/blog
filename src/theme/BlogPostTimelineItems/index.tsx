import React from "react";
import { BlogPostProvider } from "@docusaurus/plugin-content-blog/client";
import { Icon } from "@iconify/react";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/BlogPostItems";

// Minimalist Swiss Style Journal List
export default function BlogPostTimelineItems({ items }: Props): JSX.Element {
  // Group by Year for sections
  const groupedItems = React.useMemo(() => {
    const groups = {};
    items.forEach((item) => {
      const year = new Date(item.content.metadata.date).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">No entries found.</div>
    );
  }

  return (
    <div className="py-8">
      {groupedItems.map(([year, groupItems]) => (
        <div key={year} className="mb-16">
          {/* Year Header - Massive & Sticky */}
          <div className="sticky top-0 z-10 bg-white/90 dark:bg-transparent backdrop-blur-xl py-4 mb-6 border-b-2 border-[#10B981]">
            <h2 className="text-6xl md:text-8xl font-black text-[#10B981]/20 font-['MiSans'] select-none">
              {year}
            </h2>
          </div>

          <div className="flex flex-col">
            {(groupItems as any[]).map(({ content: BlogPostContent }) => {
              const { metadata } = BlogPostContent;
              const { title, permalink, date, frontMatter } = metadata;
              const dateObj = new Date(date);

              return (
                <BlogPostProvider key={permalink} content={BlogPostContent}>
                  <Link
                    to={permalink}
                    className="group relative flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 py-6 border-t border-slate-200 dark:border-white/5 transition-all hover:bg-[#10B981]/[0.02] no-underline hover:no-underline"
                  >
                    {/* Date Column */}
                    <div className="w-32 shrink-0 font-mono text-sm text-[#10B981]/80 pt-1">
                      {dateObj.toLocaleDateString("zh-CN", {
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </div>

                    {/* Title & Tags */}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#10B981] transition-colors mb-2">
                        {title}
                      </h3>
                      <div className="flex gap-2 opacity-50 text-xs uppercase tracking-wider">
                        {(frontMatter.tags || [])
                          .slice(0, 3)
                          .map((tag: any, i: number) => (
                            <span key={i} className="text-slate-500">
                              #{typeof tag === "string" ? tag : tag.label}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Arrow Action */}
                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-[#10B981]/20 text-[#10B981] opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                      <Icon icon="ri:arrow-right-line" className="text-xl" />
                    </div>
                  </Link>
                </BlogPostProvider>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
