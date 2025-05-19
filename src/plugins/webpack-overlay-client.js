/**
 * 客户端模块，用于禁用webpack-dev-server错误覆盖层
 */

// 在客户端执行的代码
export default function() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // 禁用webpack-dev-server错误覆盖层

    // 方法1: 移除已存在的覆盖层
    function removeExistingOverlays() {
      // 移除iframe
      const overlayIframes = document.querySelectorAll('iframe[title="webpack-dev-server-client-overlay"]');
      overlayIframes.forEach(iframe => iframe.remove());

      // 移除覆盖层容器
      document.querySelectorAll('body > div').forEach(div => {
        const style = window.getComputedStyle(div);
        if (style.position === 'fixed' &&
            style.zIndex === '2147483647' &&
            (style.backgroundColor.includes('rgba(0, 0, 0') || style.backgroundColor.includes('rgb(0, 0, 0'))) {
          div.remove();
        }
      });
    }

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
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      // 如果body还不存在，等待DOMContentLoaded事件
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }

    // 方法2: 覆盖webpack_dev_server.socket.onmessage方法
    if (window.webpack_dev_server && window.webpack_dev_server.socket) {
      const originalOnMessage = window.webpack_dev_server.socket.onmessage;
      window.webpack_dev_server.socket.onmessage = function(event) {
        // 解析消息
        let message;
        try {
          message = JSON.parse(event.data);
        } catch (_) {
          // 如果不是JSON，保持原样
          return originalOnMessage.call(this, event);
        }

        // 如果是错误消息，忽略它
        if (message.type === 'errors' || message.type === 'error' ||
            message.type === 'warnings' || message.type === 'warning') {
          console.log('[Webpack Overlay Disabled] Suppressed webpack error/warning message:', message);
          return; // 不调用原始处理程序
        }

        // 对于其他消息，调用原始处理程序
        return originalOnMessage.call(this, event);
      };
      console.log('[Webpack Overlay Disabled] Successfully patched webpack_dev_server.socket.onmessage');
    }

    console.log('[Webpack Overlay Disabled] Client module loaded');
  }
}
