import { type Variants, motion, AnimatePresence } from "framer-motion";
import Translate from "@docusaurus/Translate";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import SocialLinks from "@site/src/components/SocialLinks";
import social from "@site/data/social";
import styles from "./styles.module.css";
import TechMarquee from "./TechMarquee";

const variants: Variants = {
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 100,
      duration: 0.3,
      delay: i * 0.2,
    },
  }),
  hidden: { opacity: 0, y: 30 },
};

const techIcons = [
  { icon: "logos:react", title: "React" },
  { icon: "logos:typescript-icon", title: "TypeScript" },
  { icon: "logos:vue", title: "Vue" },
  { icon: "logos:nextjs-icon", title: "Next.js" },
  { icon: "logos:tailwindcss-icon", title: "Tailwind CSS" },
  { icon: "logos:astro", title: "Astro" },
  { icon: "logos:nodejs-icon", title: "Node.js" },
  { icon: "logos:python", title: "Python" },
  { icon: "logos:mongodb-icon", title: "MongoDB" },
  { icon: "logos:postgresql", title: "PostgreSQL" },
  { icon: "logos:docker-icon", title: "Docker" },
  { icon: "logos:redis", title: "Redis" },
  { icon: "logos:git-icon", title: "Git" },
  { icon: "logos:webpack", title: "Webpack" },
  { icon: "logos:eslint", title: "ESLint" },
  { icon: "logos:prettier", title: "Prettier" },
  { icon: "logos:vitejs", title: "Vite" },
  { icon: "logos:pnpm", title: "pnpm" },
];

type TechIcon = {
  icon: string;
  title: string;
};

function Name() {
  return (
    <motion.div
      className={styles.hero_text}
      custom={1}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-2 flex justify-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--ifm-color-primary)]/30 bg-[color:var(--ifm-color-primary)]/12 shadow-[0_0_0_1px_rgba(16,185,129,0.18)] px-4 py-1.5 uppercase tracking-[0.2em] text-[12px] font-semibold text-[color:var(--ifm-color-primary)]">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[color:var(--ifm-color-primary)]" />
          Full‑stack Engineer
        </span>
      </motion.div>
      <motion.h1
        className={`${styles.hero_title} mx-auto max-w-4xl text-center md:text-6xl text-4xl`}
      >
        <span>我是 </span>
        <span className={styles.hero_emphasis}>王起哲</span>
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`${styles.hero_title_en} mt-3 text-center`}
      >
        BUILD RELIABLE WEB & ENGINEERING SYSTEMS
      </motion.div>
    </motion.div>
  );
}

const iconScale: Record<string, number> = {
  "logos:tailwindcss-icon": 0.86,
  "logos:typescript-icon": 0.92,
  "logos:nextjs-icon": 0.92,
  "logos:webpack": 0.9,
  "logos:javascript": 0.92,
  "logos:eslint": 0.92,
  "logos:prettier": 0.92,
  "logos:docker-icon": 0.9,
  "logos:mongodb-icon": 0.9,
  "logos:postgresql": 0.9,
  "logos:redis": 0.9,
  "logos:vitejs": 0.92,
  "logos:pnpm": 0.92,
  "logos:astro": 0.92,
};

function TechItem({ icon }: TechIcon) {
  const scale = iconScale[icon] ?? 1;
  return (
    <div className="flex w-16 items-center justify-center md:w-20">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[color:var(--ifm-background-surface-color)]/50 ring-1 ring-[color:var(--ifm-color-primary)]/30 md:h-16 md:w-16">
        <Icon
          icon={icon}
          className="text-xl md:text-2xl opacity-85"
          style={{ transform: `scale(${scale})` }}
        />
      </span>
    </div>
  );
}

function IconsRow() {
  return (
    <motion.div
      className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      aria-label="技术栈"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--ifm-color-primary)]">
          Frontend
        </div>
        <div className="grid grid-cols-6 gap-3 md:gap-5">
          {[
            { icon: "logos:react", title: "React" },
            { icon: "logos:typescript-icon", title: "TypeScript" },
            { icon: "logos:vue", title: "Vue" },
            { icon: "logos:nextjs-icon", title: "Next.js" },
            { icon: "logos:tailwindcss-icon", title: "Tailwind" },
            { icon: "logos:astro", title: "Astro" },
          ].map((t) => (
            <TechItem key={t.icon} icon={t.icon} />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--ifm-color-primary)]">
          Backend
        </div>
        <div className="grid grid-cols-6 gap-3 md:gap-5">
          {[
            { icon: "logos:nodejs-icon", title: "Node.js" },
            { icon: "logos:python", title: "Python" },
            { icon: "logos:mongodb-icon", title: "MongoDB" },
            { icon: "logos:postgresql", title: "PostgreSQL" },
            { icon: "logos:docker-icon", title: "Docker" },
            { icon: "logos:redis", title: "Redis" },
          ].map((t) => (
            <TechItem key={t.icon} icon={t.icon} />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--ifm-color-primary)]">
          Tooling
        </div>
        <div className="grid grid-cols-6 gap-3 md:gap-5">
          {[
            { icon: "logos:git-icon", title: "Git" },
            { icon: "logos:webpack", title: "Webpack" },
            { icon: "logos:eslint", title: "ESLint" },
            { icon: "logos:prettier", title: "Prettier" },
            { icon: "logos:vitejs", title: "Vite" },
            { icon: "logos:pnpm", title: "pnpm" },
          ].map((t) => (
            <TechItem key={t.icon} icon={t.icon} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const phrases = [
    "欢迎光临！这里一半是干货，一半是我的碎碎念。祝你能分清它们。",
    "while (!success) { tryAgain(); }",
    "我正在把“胡思乱想”变成“字”，并为此感到骄傲。",
    "Hello, World! 哦不对，是 Hello, Reader!",
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初始化
    handleResize();

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mq =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq && mq.matches) return;
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(id);
  }, [phrases.length]);

  return (
    <motion.div className={styles.hero}>
      <div className={styles.intro}>
        <Name />
        <AnimatePresence mode="wait">
          <motion.div
            key={phrases[phraseIndex]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className={`${styles.codePill} mt-3 inline-flex items-center gap-2`}
          >
            <span className="font-mono text-[12px] opacity-70">&gt;_</span>
            <span className="font-mono text-[10px]">
              {phrases[phraseIndex]}
            </span>
            <span className={styles.cursor}>|</span>
          </motion.div>
        </AnimatePresence>
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={variants}
          className="max-lg:px-4"
        >
          <Translate id="homepage.hero.text">
            在这里我会分享各类技术栈所遇到问题与解决方案，带你了解最新的技术栈以及实际开发中如何应用，并希望我的开发经历对你有所启发。
          </Translate>
        </motion.p>
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={variants}
          className="relative mt-4 mb-4 flex w-full flex-wrap items-center justify-center"
        >
          <SocialLinks className="social-links-hero" />
        </motion.div>

        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-6 md:mt-20"
          custom={4}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <a
            href="/project"
            data-cursor="button"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border-2 border-[color:var(--ifm-color-primary)]/30 shadow-[0_6px_0_0_rgba(16,185,129,0.25)] transition-all duration-200 hover:shadow-[0_2px_0_0_rgba(16,185,129,0.25)] hover:translate-y-1 active:shadow-[0_0_0_0_rgba(16,185,129,0.25)] active:translate-y-1.5"
          >
            <Icon
              icon="ri:folder-line"
              className="text-xl text-[color:var(--ifm-color-primary)]"
            />
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              Browse Projects
            </span>
            <Icon
              icon="ri:arrow-right-line"
              className="text-lg text-[color:var(--ifm-color-primary)] transition-transform group-hover:translate-x-1"
            />
          </a>
          <a
            href={social.email?.href ?? "mailto:2158588419@qq.com"}
            data-cursor="button"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-b from-[color:var(--ifm-color-primary)] to-[color:var(--ifm-color-primary-dark)] border-2 border-[color:var(--ifm-color-primary)] shadow-[0_6px_0_0_rgba(16,185,129,0.6)] transition-all duration-200 hover:shadow-[0_2px_0_0_rgba(16,185,129,0.6)] hover:translate-y-1 active:shadow-[0_0_0_0_rgba(16,185,129,0.6)] active:translate-y-1.5"
          >
            <Icon icon="ri:mail-send-line" className="text-xl text-white" />
            <span className="font-semibold text-white">Contact Me</span>
            <Icon
              icon="ri:arrow-right-line"
              className="text-lg text-white transition-transform group-hover:translate-x-1"
            />
          </a>
        </motion.div>

        <div
          className={`${styles.techArea} mx-auto mt-[24rem] md:mt-[26rem] grid w-full max-w-5xl grid-cols-1 gap-6 px-4`}
        >
          <div
            className={`${styles.techGroup} flex flex-col items-center gap-2`}
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--ifm-color-primary)]">
              Frontend
            </div>
            <TechMarquee
              items={[
                { icon: "logos:react", title: "React" },
                { icon: "logos:typescript-icon", title: "TypeScript" },
                { icon: "logos:vue", title: "Vue" },
                { icon: "logos:nextjs-icon", title: "Next.js" },
                { icon: "logos:tailwindcss-icon", title: "Tailwind" },
                { icon: "logos:astro", title: "Astro" },
              ]}
              direction="left"
              durationMs={35000}
            />
          </div>
          <div
            className={`${styles.techGroup} flex flex-col items-center gap-2`}
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--ifm-color-primary)]">
              Backend
            </div>
            <TechMarquee
              items={[
                { icon: "logos:nodejs-icon", title: "Node.js" },
                { icon: "logos:python", title: "Python" },
                { icon: "logos:mongodb-icon", title: "MongoDB" },
                { icon: "logos:postgresql", title: "PostgreSQL" },
                { icon: "logos:docker-icon", title: "Docker" },
                { icon: "logos:redis", title: "Redis" },
              ]}
              direction="right"
              durationMs={35000}
            />
          </div>
          <div
            className={`${styles.techGroup} flex flex-col items-center gap-2`}
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--ifm-color-primary)]">
              Tooling
            </div>
            <TechMarquee
              items={[
                { icon: "logos:git-icon", title: "Git" },
                { icon: "logos:webpack", title: "Webpack" },
                { icon: "logos:eslint", title: "ESLint" },
                { icon: "logos:prettier", title: "Prettier" },
                { icon: "logos:vitejs", title: "Vite" },
                { icon: "logos:pnpm", title: "pnpm" },
              ]}
              direction="left"
              durationMs={35000}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
