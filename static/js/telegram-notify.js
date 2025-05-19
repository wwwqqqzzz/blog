/**
 * 私密页面访问通知脚本
 * 使用 Telegram Bot 发送访问通知
 */

// 在文档加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
  // 检查是否是密码保护的文章页面
  const isPrivateBlogPage = document.querySelector('.password-wrapper') !== null

  // 如果不是密码保护的文章页面，直接返回
  if (!isPrivateBlogPage) return

  // 监听密码验证成功事件
  document.addEventListener('password:success', function () {
    // 发送访问通知
    sendAccessNotification()
  })
})

/**
 * 发送访问通知到 Telegram
 */
function sendAccessNotification() {
  // 获取页面信息
  const pageTitle = document.title
  const pageUrl = window.location.href
  const timestamp = new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // 获取设备信息
  const deviceInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || '直接访问',
  }

  // 构建消息文本
  const messageText = `
🔐 *私密页面访问通知*

📄 *页面*: ${pageTitle}
🔗 *链接*: ${pageUrl}
⏰ *时间*: ${timestamp}

📱 *设备信息*:
- 平台: ${deviceInfo.platform}
- 屏幕: ${deviceInfo.screenSize}
- 语言: ${deviceInfo.language}
- 时区: ${deviceInfo.timeZone}
- 来源: ${deviceInfo.referrer}

🌐 *浏览器*: ${deviceInfo.userAgent}
  `.trim()

  // Telegram Bot 配置
  const BOT_TOKEN = '7884033773:AAGY8sNoY1Kfou8AUstN7voPxv6HrdseZUg' // 博客访问通知机器人

  // 使用您的 Telegram 用户 ID
  const CHAT_ID = '5289002972' // 您的用户 ID

  // 如果没有设置令牌或ID，则在控制台输出消息
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log('Telegram通知未发送，请设置正确的BOT_TOKEN和CHAT_ID')
    console.log('访问信息:', messageText)
    return
  }

  // 发送请求到 Telegram Bot API
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: messageText,
      parse_mode: 'Markdown',
    }),
  })
    .then(response => response.json())
    .then((data) => {
      if (data.ok) {
        console.log('访问通知已发送到Telegram')
      }
      else {
        console.error('发送通知失败:', data.description)
      }
    })
    .catch((error) => {
      console.error('发送通知出错:', error)
    })
}
