/**
 * 禁用 webpack-dev-server 错误覆盖层
 *
 * 这个脚本会在页面加载时执行，并禁用 webpack-dev-server 的错误覆盖层
 */
(function() {
  // 立即执行函数，防止变量泄露到全局作用域

  // 定义一个函数来禁用 webpack 错误覆盖层
  function disableWebpackOverlay() {
    // 方法1: 覆盖 webpack_dev_server.socket.onmessage 方法
    if (window.webpack_dev_server && window.webpack_dev_server.socket) {
      const originalOnMessage = window.webpack_dev_server.socket.onmessage;
      window.webpack_dev_server.socket.onmessage = function(event) {
        // 解析消息
        let message;
        try {
          message = JSON.parse(event.data);
        } catch (error) {
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

    // 方法2: 覆盖 WebSocket.prototype.send 方法
    if (window.WebSocket) {
      const originalSend = WebSocket.prototype.send;
      WebSocket.prototype.send = function(data) {
        // 检查是否是webpack相关的WebSocket
        if (this.url && this.url.includes('webpack-dev-server')) {
          try {
            const message = JSON.parse(data);
            if (message.type === 'errors' || message.type === 'warnings') {
              console.log('[Webpack Overlay Disabled] Blocked sending error/warning to webpack-dev-server');
              return; // 不发送错误消息
            }
          } catch (e) {
            // 不是JSON，继续正常发送
          }
        }
        return originalSend.apply(this, arguments);
      };
      console.log('[Webpack Overlay Disabled] Successfully patched WebSocket.prototype.send');
    }

    // 方法3: 覆盖 console.error 方法，防止webpack捕获错误
    const originalConsoleError = console.error;
    console.error = function() {
      // 检查错误堆栈是否包含webpack相关路径
      const errorStack = new Error().stack || '';
      if (errorStack.includes('webpack-dev-server') ||
          errorStack.includes('webpack-internal') ||
          errorStack.includes('overlay.js')) {
        // 对于webpack相关错误，使用console.warn代替
        console.warn('[Webpack Overlay Disabled] Suppressed error:', ...arguments);
        return;
      }
      // 对于其他错误，使用原始console.error
      return originalConsoleError.apply(console, arguments);
    };

    // 方法4: 移除已存在的覆盖层
    function removeExistingOverlays() {
      // 移除iframe
      const overlayIframes = document.querySelectorAll('iframe[title="webpack-dev-server-client-overlay"]');
      overlayIframes.forEach(iframe => iframe.remove());

      // 移除覆盖层容器 - 使用更精确的选择器
      document.querySelectorAll('body > div').forEach(div => {
        const style = window.getComputedStyle(div);
        // 只有当元素满足以下所有条件时才移除：
        // 1. 固定定位
        // 2. z-index 非常高 (webpack overlay 通常使用最高值)
        // 3. 背景色为黑色半透明
        // 4. 不是主要内容容器 (检查是否包含 #__docusaurus 或其他关键内容)
        if (style.position === 'fixed' &&
            parseInt(style.zIndex) > 1000 &&
            (style.backgroundColor.includes('rgba(0, 0, 0') || style.backgroundColor.includes('rgb(0, 0, 0')) &&
            !div.contains(document.getElementById('__docusaurus')) &&
            !div.id.includes('docusaurus')) {
          console.log('[Webpack Overlay Removed]', div);
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

    // 方法5: 添加CSS规则来隐藏覆盖层
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
  }

  // 在页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', disableWebpackOverlay);
  } else {
    disableWebpackOverlay();
  }

  // 也在window.onload时执行，以确保所有资源都已加载
  window.addEventListener('load', disableWebpackOverlay);

  // 立即执行一次，以尽快禁用覆盖层
  disableWebpackOverlay();

  console.log('[Webpack Overlay Disabled] Script loaded');
})();
