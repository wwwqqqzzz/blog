/**
 * API endpoint for QWeather Geo API
 * Proxies requests to QWeather to avoid CORS issues
 */
export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 获取请求参数
    const { location = '南京' } = req.query // 默认南京

    // 和风天气API密钥
    const apiKey = process.env.QWEATHER_API_KEY || '80ce7424f8d34974af05d092792c123a'
    const apiUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(location)}&key=${apiKey}`

    // 请求和风天气地理位置API
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Geo API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // 返回数据
    return res.status(200).json(data)
  }
  catch (error) {
    console.error('Error fetching geo data:', error)
    return res.status(500).json({
      error: 'Failed to fetch geo data',
      message: error.message,
      code: '404',
      location: [{
        id: '101190101', // 南京
        name: '南京',
        country: '中国',
        adm1: '江苏省',
        adm2: '南京市',
        lat: '32.05839',
        lon: '118.79647',
      }],
    })
  }
}
