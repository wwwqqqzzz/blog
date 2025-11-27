import React from "react";
import Link from "@docusaurus/Link";
import { useThemeConfig } from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { cn } from "@site/src/lib/utils";
import { MovingButton } from "@site/src/components/magicui/moving-border";
import "./styles.css";

export default function Footer(): JSX.Element | null {
  const { siteConfig } = useDocusaurusContext();
  const { footer } = useThemeConfig();
  if (!footer) return null;

  const groups = footer.links ?? [];
  const year = new Date().getFullYear();
  const title = siteConfig.title;

  return (
    <footer className={cn("futuristic-footer")}>
      <div className="container mx-auto px-6 md:px-8">
        <div className="pt-12 pb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/30 ring-1 ring-primary/50" />
              <div className="text-xl font-semibold tracking-wide">{title}</div>
            </div>
            <MovingButton
              borderClassName="from-primary to-primary"
              className="px-6 py-2 text-sm bg-transparent"
            >
              <Link
                className="inline-flex items-center gap-2"
                href={
                  groups?.[1]?.items?.find((i: any) => i.href)?.href ||
                  "https://github.com/"
                }
              >
                <span>GitHub</span>
                <span className="rounded bg-primary/20 px-2 py-0.5 text-primary">
                  Star
                </span>
              </Link>
            </MovingButton>
          </div>
        </div>

        <div className="subscribe-card mt-2 mb-8">
          <div className="subscribe-left">
            <div className="subscribe-title">✨ 订阅更新</div>
            <div className="subscribe-desc">
              获取最新的文章和项目更新，不定期发送惊喜内容
            </div>
          </div>
          <SubscribeForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          <div className="footer-card">
            <div className="footer-card-title">MyBlog</div>
            <p className="footer-text">
              用代码书写故事，用文字记录生活。
              每一行代码都是一次冒险，每一篇文章都是一段旅程。
            </p>
          </div>
          <div className="footer-card">
            <div className="footer-card-title">探索</div>
            <ul className="footer-card-list">
              <li>
                <Link to="/blog" className="footer-link">
                  博客文章
                </Link>
              </li>
              <li>
                <Link to="/project" className="footer-link">
                  项目展示
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  关于我
                </Link>
              </li>
              <li>
                <Link href="mailto:2158588419@qq.com" className="footer-link">
                  联系方式
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-card">
            <div className="footer-card-title">资源</div>
            <ul className="footer-card-list">
              <li>
                <span className="footer-link disabled">开发工具</span>
              </li>
              <li>
                <Link to="/docs" className="footer-link">
                  学习笔记
                </Link>
              </li>
              <li>
                <span className="footer-link disabled">设计素材</span>
              </li>
              <li>
                <span className="footer-link disabled">代码片段</span>
              </li>
            </ul>
          </div>
          <div className="footer-card">
            <div className="footer-card-title">社区</div>
            <ul className="footer-card-list">
              <li>
                <Link to="/friends" className="footer-link">
                  加入讨论
                </Link>
              </li>
              <li>
                <span className="footer-link disabled">贡献指南</span>
              </li>
              <li>
                <span className="footer-link disabled">行为准则</span>
              </li>
              <li>
                <Link
                  href="mailto:2158588419@qq.com?subject=反馈建议"
                  className="footer-link"
                >
                  反馈建议
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          {footer.copyright ? (
            <div dangerouslySetInnerHTML={{ __html: footer.copyright }} />
          ) : (
            <div>Copyright © 2004 - {year}</div>
          )}
        </div>
      </div>
    </footer>
  );
}

function SubscribeForm() {
  const [email, setEmail] = React.useState("");
  const [msg, setMsg] = React.useState<string | null>(null);
  const target = "2158588419@qq.com";
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setMsg("请输入有效邮箱");
      return;
    }
    const mailto = `mailto:${target}?subject=${encodeURIComponent(
      "订阅更新"
    )}&body=${encodeURIComponent("订阅邮箱: " + email)}`;
    window.location.href = mailto;
    setMsg("已打开邮件客户端进行订阅");
  };
  return (
    <form className="subscribe-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="subscribe-email">
        输入你的邮箱
      </label>
      <input
        id="subscribe-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="输入你的邮箱"
        className="subscribe-input"
      />
      <button type="submit" className="subscribe-btn">
        订阅
      </button>
      {msg && <div className="subscribe-tip">{msg}</div>}
    </form>
  );
}
