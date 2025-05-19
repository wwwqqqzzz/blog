/**
 * Telegram 通知 API 路由
 * 用于发送私密博客访问通知到 Telegram
 */

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 获取请求体中的数据
    const { pageTitle, pageUrl, deviceInfo } = req.body;

    // 验证必要的数据
    if (!pageTitle || !pageUrl || !deviceInfo) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // 获取当前时间（中国时区）
    const timestamp = new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // 构建消息文本
    const messageText = `
🔐 *私密页面访问通知*

📄 *页面*: ${pageTitle}
🔗 *链接*: ${pageUrl}
⏰ *时间*: ${timestamp}

📱 *设备信息*:
- 平台: ${deviceInfo.platform || '未知'}
- 屏幕: ${deviceInfo.screenSize || '未知'}
- 语言: ${deviceInfo.language || '未知'}
- 时区: ${deviceInfo.timeZone || '未知'}
- 来源: ${deviceInfo.referrer || '直接访问'}

🌐 *浏览器*: ${deviceInfo.userAgent || '未知'}
    `.trim();

    // Telegram Bot 配置
    const BOT_TOKEN = '7884033773:AAGY8sNoY1Kfou8AUstN7voPxv6HrdseZUg';
    const CHAT_ID = '5289002972';

    // 发送请求到 Telegram Bot API
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageText,
        parse_mode: 'Markdown',
      }),
    });

    const telegramData = await telegramResponse.json();

    // 返回结果
    if (telegramData.ok) {
      return res.status(200).json({ success: true, message: 'Notification sent successfully' });
    } else {
      console.error('Telegram API error:', telegramData);
      return res.status(500).json({ error: 'Failed to send notification', details: telegramData });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
