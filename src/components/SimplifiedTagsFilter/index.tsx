import React from "react";
import { useHistory, useLocation } from "@docusaurus/router";
import type { BlogTag } from "@site/src/types/blog";
import { cn } from "@site/src/lib/utils";

export default function SimplifiedTagsFilter({
  tags,
  maxTags = 8,
}: {
  tags: BlogTag[];
  maxTags?: number;
}) {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const currentTag = queryParams.get("tag") || "";
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(queryParams);
    if (tagName === currentTag) params.delete("tag");
    else params.set("tag", tagName);
    history.push({ search: params.toString() });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(queryParams);
    params.delete("tag");
    history.push({ search: params.toString() });
  };

  return (
    <div className="my-12 pb-8 border-b border-slate-100 dark:border-white/5">
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4 font-['MiSans'] text-base">
        {/* 全部 (ALL) - Button */}
        <button
          onClick={() => handleClearFilters()}
          style={{ background: "transparent", border: "none", padding: 0 }}
          className={cn(
            "relative pb-1 transition-all hover:text-[#10B981] !bg-transparent !border-none !shadow-none p-0 cursor-pointer",
            currentTag === ""
              ? "text-[#10B981] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#10B981]"
              : "text-slate-500 dark:text-slate-400 opacity-60 hover:opacity-100",
          )}
        >
          全部
        </button>

        {/* Tags List */}
        {sortedTags.slice(0, 15).map((tag) => (
          <button
            key={tag.permalink}
            onClick={() => handleTagClick(tag.label)}
            style={{ background: "transparent", border: "none", padding: 0 }}
            className={cn(
              "relative pb-1 transition-all hover:text-[#10B981] group !bg-transparent !border-none !shadow-none p-0 cursor-pointer",
              currentTag === tag.label
                ? "text-[#10B981] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#10B981]"
                : "text-slate-500 dark:text-slate-400 opacity-60 hover:opacity-100",
            )}
          >
            {tag.label}
            <span
              className={cn(
                "ml-1.5 text-xs font-mono align-top transition-opacity",
                currentTag === tag.label
                  ? "text-[#10B981] opacity-100"
                  : "opacity-0 group-hover:opacity-100",
              )}
            >
              {tag.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
