import React from "react";
import { useHistory, useLocation } from "@docusaurus/router";
import { motion } from "framer-motion";
import { cn } from "@site/src/lib/utils";

type SortOption = {
  value: string;
  label: string;
  icon: string;
};

const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "最新发布", icon: "ri:time-line" },
  { value: "oldest", label: "最早发布", icon: "ri:history-line" },
];

interface BlogSortControlsProps {
  /**
   * 当前文章总数
   */
  totalCount: number;
  /**
   * 当前选中的标签
   */
  currentTag?: string;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 博客排序控制组件 (Redesigned - Clean Text)
 */
export default function BlogSortControls({
  totalCount,
  currentTag,
  className,
}: BlogSortControlsProps): React.ReactNode {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const currentSort = queryParams.get("sort") || "newest";

  // 处理排序变化
  const setSort = (sortValue: string) => {
    const params = new URLSearchParams(queryParams);
    params.set("sort", sortValue);
    history.push({ search: params.toString() });
  };

  return (
    <div
      className={cn(
        "mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-t border-black/5 dark:border-white/5",
        className,
      )}
    >
      {/* Article Count */}
      <div className="font-mono text-xs font-bold tracking-widest text-slate-400 uppercase font-['MiSans']">
        {totalCount} 篇文章
        {currentTag && (
          <span className="text-[#10B981] ml-2">IN #{currentTag}</span>
        )}
      </div>

      {/* Sort Options - Pure Text */}
      <div className="flex items-center gap-6 text-sm font-['MiSans']">
        <span className="text-slate-400 text-xs font-mono tracking-widest uppercase mr-2 hidden md:inline-block">
          Sort
        </span>

        {SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setSort(option.value)}
            className={cn(
              "transition-all hover:text-[#10B981] relative cursor-pointer",
              currentSort === option.value
                ? "text-slate-900 dark:text-white font-bold after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#10B981]"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
            )}
            style={{ background: "transparent", border: "none", padding: 0 }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
