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
    // 金山词霸每日一句 API URL
    const apiUrl = 'https://open.iciba.com/dsapi/'

    // Fetch data from 金山词霸 API with proper headers
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Validate the data
    if (!data || !data.content || !data.note) {
      throw new Error('Invalid response from 金山词霸 API')
    }

    // Return the data
    return res.status(200).json({
      content: data.content,
      translation: data.note,
      author: data.author || 'Daily English',
      picture: data.picture,
    })
  }
  catch (error) {
    console.error('Error fetching daily quote:', error)

    // Return fallback data instead of error
    return res.status(200).json({
      content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
      translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
      author: 'Winston Churchill',
      picture: 'https://cdn.iciba.com/www/img/daily-pic.jpg',
      fallback: true
    })
  }
}
