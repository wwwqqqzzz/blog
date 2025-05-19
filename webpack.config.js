/**
 * 自定义 webpack 配置
 * 用于禁用 webpack-dev-server 的错误覆盖层
 */
module.exports = {
  devServer: {
    client: {
      overlay: false, // 禁用错误覆盖层
    },
  },
};
