/**
 * 自定义 Layout 组件，用于禁用 webpack-dev-server 错误覆盖层
 */

import React, { useEffect } from 'react';
import Layout from '@theme-original/Layout';
import type { Props } from '@theme/Layout';
import Head from '@docusaurus/Head';

export default function LayoutWrapper(props: Props): JSX.Element {
  // 在客户端运行时禁用 webpack 错误覆盖层
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // 禁用 webpack-dev-server 错误覆盖层

      // 方法1: 移除已存在的覆盖层
      const removeExistingOverlays = () => {
        // 移除iframe
        const overlayIframes = document.querySelectorAll('iframe[title="webpack-dev-server-client-overlay"]');
        overlayIframes.forEach(iframe => iframe.remove());

        // 移除覆盖层容器 - 使用更精确的选择器
        // 只选择固定定位、高z-index且背景为黑色半透明的元素
        document.querySelectorAll('body > div').forEach(element => {
          const div = element as HTMLDivElement;
          const computedStyle = window.getComputedStyle(div);

          // 只有当元素满足以下所有条件时才移除：
          // 1. 固定定位
          // 2. z-index 非常高 (webpack overlay 通常使用最高值)
          // 3. 背景色为黑色半透明
          // 4. 不是主要内容容器 (检查是否包含 #__docusaurus 或其他关键内容)
          if (computedStyle.position === 'fixed' &&
              parseInt(computedStyle.zIndex) > 1000 &&
              computedStyle.backgroundColor.includes('rgba(0, 0, 0') &&
              !div.contains(document.getElementById('__docusaurus')) &&
              !div.id.includes('docusaurus')) {
            console.log('[Webpack Overlay Removed]', div);
            div.remove();
          }
        });
      };

      // 立即移除现有覆盖层
      removeExistingOverlays();

      // 设置MutationObserver监视DOM变化，移除新添加的覆盖层
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            removeExistingOverlays();
          }
        }
      });

      // 开始观察document.body的变化
      observer.observe(document.body, { childList: true, subtree: true });

      // 方法2: 覆盖 window.onerror
      const originalOnError = window.onerror;
      window.onerror = function(message, source, lineno, colno, error) {
        // 检查是否是webpack相关错误
        if (source && (
          source.includes('webpack-dev-server') ||
          source.includes('webpack-internal') ||
          (error && error.stack && error.stack.includes('webpack'))
        )) {
          console.warn('[Webpack Error Suppressed]', message);
          return true; // 阻止错误传播
        }

        // 对于其他错误，调用原始处理程序
        if (typeof originalOnError === 'function') {
          return originalOnError(message, source, lineno, colno, error);
        }
        return false;
      };

      // 方法3: 覆盖 console.error
      const originalConsoleError = console.error;
      console.error = function(...args) {
        // 获取调用堆栈
        const stack = new Error().stack || '';

        // 检查是否是webpack相关错误
        if (stack.includes('webpack-dev-server') ||
            stack.includes('webpack-internal') ||
            stack.includes('overlay.js')) {
          console.warn('[Webpack Error Suppressed]', ...args);
          return;
        }

        // 对于其他错误，调用原始处理程序
        return originalConsoleError.apply(console, args);
      };

      // 清理函数
      return () => {
        observer.disconnect();
        window.onerror = originalOnError;
        console.error = originalConsoleError;
      };
    }
  }, []);

  return (
    <>
      <Head>
        {process.env.NODE_ENV === 'development' && (
          <>
            {/* 添加样式来隐藏webpack错误覆盖层 */}
            <style>
              {`
                /* 隐藏webpack错误覆盖层 */
                iframe[title="webpack-dev-server-client-overlay"] {
                  display: none !important;
                }

                /* 隐藏webpack错误覆盖层的容器 - 只针对包含特定iframe的容器 */
                body > div:has(> iframe[title="webpack-dev-server-client-overlay"]) {
                  display: none !important;
                }

                /* 隐藏webpack错误覆盖层的黑色背景 - 更精确的选择器 */
                body > div[style*="position: fixed"][style*="z-index: 2147483647"][style*="background-color: rgba(0, 0, 0"]:not(:has(#__docusaurus)) {
                  display: none !important;
                }

                /* 确保主要内容容器可见 */
                #__docusaurus,
                #__docusaurus > div,
                .main-wrapper,
                main,
                .container {
                  display: block !important;
                  visibility: visible !important;
                  opacity: 1 !important;
                  color: var(--ifm-text-color) !important;
                }
              `}
            </style>

            {/* 添加脚本来禁用webpack错误覆盖层 */}
            <script>
              {`
                // 禁用webpack-dev-server错误覆盖层
                (function() {
                  // 覆盖window.onerror，阻止webpack-dev-server捕获错误
                  const originalOnError = window.onerror;
                  window.onerror = function(message, source, lineno, colno, error) {
                    // 检查是否是webpack相关错误
                    if (source && (source.includes('webpack-dev-server') || source.includes('webpack-internal'))) {
                      console.warn('[Webpack Error Suppressed]', message);
                      return true; // 阻止错误传播
                    }
                    // 对于其他错误，调用原始处理程序
                    if (typeof originalOnError === 'function') {
                      return originalOnError(message, source, lineno, colno, error);
                    }
                    return false;
                  };

                  console.log('[Webpack Overlay Disabled] Error handlers patched');
                })();
              `}
            </script>
          </>
        )}
      </Head>
      <Layout {...props} />
    </>
  );
}
