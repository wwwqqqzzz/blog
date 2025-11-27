import React from "react";
import { Icon } from "@iconify/react";

type TechIcon = { icon: string; title: string };

type MarqueeProps = {
  items: TechIcon[];
  direction?: "left" | "right";
  durationMs?: number;
  className?: string;
};

const scaleMap: Record<string, number> = {
  "logos:tailwindcss-icon": 0.86,
  "logos:typescript-icon": 0.92,
  "logos:nextjs-icon": 0.92,
  "logos:webpack": 0.9,
  "logos:docker-icon": 0.9,
  "logos:mongodb-icon": 0.9,
  "logos:postgresql": 0.9,
  "logos:redis": 0.9,
  "logos:vitejs": 0.92,
  "logos:pnpm": 0.92,
  "logos:astro": 0.92,
};

function TechCard({ item }: { item: TechIcon }) {
  const s = scaleMap[item.icon] ?? 1;
  return (
    <div className="relative flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/60 px-4 py-2 min-w-[120px] hover:border-blue-400/50 hover:bg-white/80 transition-all duration-300 shadow-sm">
      <Icon
        icon={item.icon}
        className="text-xl"
        style={{ transform: `scale(${s})` }}
      />
      <span className="text-[13px] text-gray-600">{item.title}</span>
    </div>
  );
}

export default function TechMarquee({
  items,
  direction = "left",
  durationMs = 40000,
  className = "",
}: MarqueeProps) {
  const animationDirection = direction === "left" ? "normal" : "reverse";
  return (
    <div
      className={`relative group flex overflow-hidden ${className}`}
      data-cursor="marquee"
    >
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[color:var(--ifm-background-color)] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[color:var(--ifm-background-color)] to-transparent pointer-events-none z-10" />

      {/* 多轨道：渲染 4 条内容带，确保超宽屏也保持无缝 */}
      {[0, 1, 2, 3].map((track) => (
        <div
          key={`track-${track}`}
          className="marqueeTrack flex shrink-0 items-center justify-start gap-2 w-max pr-2 animate-scroll"
          style={{ animationDuration: `${durationMs}ms`, animationDirection }}
        >
          {items.map((it, idx) => (
            <TechCard key={`track${track}-${it.icon}-${idx}`} item={it} />
          ))}
        </div>
      ))}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll { animation: scroll linear infinite; }
        .animate-scroll:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
