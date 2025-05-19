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

  // 准备请求数据
  const requestUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  const requestData = {
    chat_id: CHAT_ID,
    text: messageText,
    parse_mode: 'Markdown',
  }

  console.log('准备发送Telegram请求:', {
    url: requestUrl,
    data: requestData
  })

  // 发送请求到 Telegram Bot API
  fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then(response => {
      console.log('Telegram API响应状态:', response.status)
      return response.json()
    })
    .then((data) => {
      if (data.ok) {
        console.log('访问通知已成功发送到Telegram:', data)
      }
      else {
        console.error('发送通知失败:', data)
      }
    })
    .catch((error) => {
      console.error('发送通知出错:', error)
    })
}
