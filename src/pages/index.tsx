import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import BlogSection from "../components/landing/BlogSection";
import Hero from "../components/landing/Hero";
import ProjectSection from "../components/landing/ProjectSection";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// 定义脉冲动画
const pulseAnimation = {
  "0%": { opacity: 0.3, transform: "translate(-50%, 0) scale(0.8)" },
  "50%": { opacity: 0.7, transform: "translate(-50%, 0) scale(1.2)" },
  "100%": { opacity: 0.3, transform: "translate(-50%, 0) scale(0.8)" },
};

export default function Home() {
  const {
    siteConfig: { customFields, tagline },
  } = useDocusaurusContext();
  const { description } = customFields as { description: string };

  // 响应式设计 - 小屏幕上减小偏移量
  const [offsetY, setOffsetY] = useState(-70);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOffsetY(-50);
      } else {
        setOffsetY(-70);
      }
    };

    // 初始化
    handleResize();

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout title={tagline} description={description}>
      <main className="overflow-hidden">
        <Hero />

        <motion.div
          className="relative z-[15]"
          style={{ marginTop: `${offsetY}px` }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8 space-y-14">
            <ProjectSection />
            <BlogSection />
          </div>

          
        </motion.div>
      </main>
    </Layout>
  );
}
