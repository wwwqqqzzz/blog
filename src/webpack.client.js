/**
 * 客户端webpack配置
 * 用于禁用webpack-dev-server错误覆盖层
 */

// 禁用webpack错误覆盖层
if (typeof window !== 'undefined') {
  // 检查是否存在webpack_dev_server变量
  if (window.webpack_dev_server) {
    // 尝试禁用错误覆盖层
    try {
      // 方法1: 直接修改webpack_dev_server配置
      if (window.webpack_dev_server.client) {
        window.webpack_dev_server.client.overlay = false;
      }

      // 方法2: 修改全局错误处理
      const originalErrorHandler = window.onerror;
      window.onerror = function(message, source, lineno, colno, error) {
        // 检查是否是webpack相关错误
        if (source && (
          source.includes('webpack-dev-server') || 
          source.includes('webpack-internal') ||
          (error && error.stack && error.stack.includes('webpack'))
        )) {
          // 对于webpack错误，我们只在控制台记录，不显示覆盖层
          console.warn('Webpack error suppressed:', message);
          // 阻止默认处理
          return true;
        }
        
        // 对于其他错误，使用原始处理程序
        if (typeof originalErrorHandler === 'function') {
          return originalErrorHandler(message, source, lineno, colno, error);
        }
        return false;
      };

      console.log('Webpack error overlay disabled');
    } catch (e) {
      console.error('Failed to disable webpack error overlay:', e);
    }
  }
}
