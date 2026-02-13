import React from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

// Note: We use the specific class names that match our 'Swiss Grid' styles in custom.css
// (.footer, .footer__links, .footer__col, .footer__link-item, .footer__copyright)

export default function Footer() {
  const { footer } = useThemeConfig();
  if (!footer) return null;
  const { links, copyright } = footer;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__links">
          {/* Render configured links (Explore, Connect) */}
          {links.map((linkItem, i) => (
            <div key={i} className="footer__col">
              <div className="footer__title">{linkItem.title}</div>
              <ul className="footer__items">
                {linkItem.items.map((item, j) => (
                  <li key={j} className="footer__item">
                    <Link
                      to={item.to || item.href}
                      className="footer__link-item"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Static 'Swiss Style' Filler Columns for Grid Balance */}
          <div className="footer__col">
            <div className="footer__title">社交媒体</div>
            <ul className="footer__items">
              <li className="footer__item">
                <Link to="https://instagram.com" className="footer__link-item">
                  Instagram
                </Link>
              </li>
              <li className="footer__item">
                <Link to="https://dribbble.com" className="footer__link-item">
                  Dribbble
                </Link>
              </li>
              <li className="footer__item">
                <Link to="/rss.xml" className="footer__link-item">
                  RSS 订阅
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer__col">
            <div className="footer__title">技术栈</div>
            <ul className="footer__items">
              <li className="footer__item">
                <Link to="https://react.dev" className="footer__link-item">
                  React
                </Link>
              </li>
              <li className="footer__item">
                <Link
                  to="https://www.typescriptlang.org"
                  className="footer__link-item"
                >
                  TypeScript
                </Link>
              </li>
              <li className="footer__item">
                <Link to="https://docusaurus.io" className="footer__link-item">
                  Docusaurus
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* MASSIVE SIGNATURE */}
        <div className="footer__copyright">王 起 哲</div>

        {/* Copyright / Legal / Meta */}
        {copyright && (
          <div className="text-center pb-8 opacity-60 text-xs font-mono tracking-widest">
            <div dangerouslySetInnerHTML={{ __html: copyright }} />
          </div>
        )}
      </div>
    </footer>
  );
}
