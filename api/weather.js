// api/weather.js
export default async function handler(req, res) {
  // 设置CORS头，允许从您的网站域名访问
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只允许GET请求' })
  }

  try {
    // 从查询参数中获取location
    const { location } = req.query

    if (!location) {
      return res.status(400).json({ error: '缺少location参数' })
    }

    // 和风天气API密钥
    const apiKey = '80ce7424f8d34974af05d092792c123a'

    // 构建和风天气API URL
    const apiUrl = `https://devapi.qweather.com/v7/weather/now?location=${location}&key=${apiKey}`

    // 请求和风天气API
    const response = await fetch(apiUrl)
    const data = await response.json()

    // 返回数据
    return res.status(200).json(data)
  }
  catch (error) {
    console.error('代理天气API请求失败:', error)
    return res.status(500).json({ error: '代理请求失败', message: error.message })
  }
}
