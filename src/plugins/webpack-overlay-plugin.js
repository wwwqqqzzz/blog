/**
 * 自定义Docusaurus插件，用于禁用webpack-dev-server错误覆盖层
 */

module.exports = function(context, options) {
  return {
    name: 'disable-webpack-overlay-plugin',
    
    // 配置webpack
    configureWebpack(config, isServer, utils) {
      if (process.env.NODE_ENV === 'development' && !isServer) {
        return {
          devServer: {
            client: {
              overlay: false, // 禁用错误覆盖层
            },
          },
        };
      }
      return {};
    },
    
    // 注入客户端代码
    injectHtmlTags() {
      if (process.env.NODE_ENV === 'development') {
        return {
          headTags: [
            {
              tagName: 'script',
              attributes: {
                type: 'text/javascript',
              },
              innerHTML: `
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
                  
                  // 覆盖console.error，防止webpack捕获错误
                  const originalConsoleError = console.error;
                  console.error = function() {
                    // 获取调用堆栈
                    const stack = new Error().stack || '';
                    // 检查是否是webpack相关错误
                    if (stack.includes('webpack-dev-server') || stack.includes('webpack-internal')) {
                      console.warn('[Webpack Error Suppressed]', ...arguments);
                      return;
                    }
                    // 对于其他错误，调用原始处理程序
                    return originalConsoleError.apply(console, arguments);
                  };
                  
                  console.log('[Webpack Overlay Disabled] Error handlers patched');
                })();
              `,
            },
            {
              tagName: 'style',
              innerHTML: `
                /* 隐藏webpack错误覆盖层 */
                iframe[title="webpack-dev-server-client-overlay"] {
                  display: none !important;
                }
                /* 隐藏webpack错误覆盖层的容器 */
                body > div:has(> iframe[title="webpack-dev-server-client-overlay"]) {
                  display: none !important;
                }
                /* 隐藏webpack错误覆盖层的黑色背景 */
                body > div[style*="position: fixed"][style*="z-index: 2147483647"][style*="background-color: rgba(0, 0, 0"] {
                  display: none !important;
                }
              `,
            },
          ],
        };
      }
      return {};
    },
    
    // 在客户端加载时执行
    getClientModules() {
      return process.env.NODE_ENV === 'development' 
        ? [require.resolve('./webpack-overlay-client.js')] 
        : [];
    },
  };
};
