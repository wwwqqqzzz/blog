// Vercel Serverless Function for 金山词霸每日一句 API
// This function proxies requests to the 金山词霸 API to avoid CORS issues

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 金山词霸每日一句 API URL - 直接访问，不使用代理
    const apiUrl = 'https://open.iciba.com/dsapi/'

    console.log('Server-side direct API call to 金山词霸:', apiUrl)

    // 使用node-fetch直接获取数据，避免浏览器CORS限制
    // 服务器端请求不受同源策略限制
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.iciba.com/',
      },
      // 禁用缓存，确保获取最新数据
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    // 获取响应文本
    const responseText = await response.text()

    // 尝试解析JSON
    let data
    try {
      data = JSON.parse(responseText)
    }
    catch (parseError) {
      console.error('Failed to parse API response as JSON:', responseText.substring(0, 200))
      throw new Error(`Failed to parse API response: ${parseError.message}`)
    }

    // 打印完整的API响应，方便调试
    console.log('Full response from 金山词霸 API:', JSON.stringify(data))

    // 验证数据格式
    if (!data || !data.content || !data.note) {
      console.error('Invalid API response format:', data)
      throw new Error('Invalid response format from 金山词霸 API')
    }

    // 返回处理后的数据，添加标记表明这是真实API数据
    return res.status(200).json({
      content: data.content,
      translation: data.note,
      author: data.author || '金山词霸',
      picture: data.picture || data.fenxiang_img || data.picture2,
      source: '金山词霸',
      timestamp: new Date().toISOString(),
      dateline: data.dateline,
      fallback: false,
    })
  }
  catch (error) {
    console.error('Error fetching daily quote:', error)

    // Return fallback data instead of error
    return res.status(200).json({
      content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
      translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
      author: 'Winston Churchill',
      picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-2.jpg',
      source: 'API Fallback',
      timestamp: new Date().toISOString(),
      fallback: true,
      error: error.message,
    })
  }
}
