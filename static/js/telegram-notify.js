/**
 * 私密页面访问通知脚本
 * 使用 Telegram Bot 发送访问通知
 */

// 在文档加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
  // 检查是否是密码保护的文章页面
  const isPrivateBlogPage = document.querySelector('.password-wrapper, .passwordContainer') !== null
  console.log('Telegram通知脚本已加载，是否为私密页面:', isPrivateBlogPage)

  // 如果不是密码保护的文章页面，直接返回
  if (!isPrivateBlogPage) return

  // 监听密码验证成功事件
  document.addEventListener('password:success', function () {
    console.log('密码验证成功事件触发，准备发送通知')
    // 发送访问通知
    sendAccessNotification()
  })

  // 添加调试信息
  console.log('Telegram通知脚本初始化完成，等待密码验证成功事件')
})

/**
 * 发送访问通知到 Telegram
 */
function sendAccessNotification() {
  console.log('开始发送访问通知')

  // 获取页面信息
  const pageTitle = document.title
  const pageUrl = window.location.href
  console.log('页面信息:', { pageTitle, pageUrl })

  // 获取设备信息
  const deviceInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.userAgentData?.platform || 'Unknown', // 使用更现代的API
    screenSize: `${window.screen.width}x${window.screen.height}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || '直接访问',
  }

  // 准备要发送到服务器的数据
  const notificationData = {
    pageTitle,
    pageUrl,
    deviceInfo
  }

  console.log('准备发送通知数据:', notificationData)

  // 使用我们的API路由发送通知
  fetch('/api/telegram-notify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notificationData),
  })
    .then(response => {
      console.log('API响应状态:', response.status)
      return response.json()
    })
    .then((data) => {
      if (data.success) {
        console.log('访问通知已成功发送:', data)
      }
      else {
        console.error('发送通知失败:', data)
      }
    })
    .catch((error) => {
      console.error('发送通知出错:', error)
    })
}
