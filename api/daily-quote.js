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

    console.log('Server-side API call to 金山词霸:', apiUrl)

    // Fetch data from 金山词霸 API with proper headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.iciba.com/'
      },
      cache: 'no-store',
      timeout: 5000 // 5 second timeout
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    console.log('Received data from 金山词霸 API:', JSON.stringify(data).substring(0, 200) + '...')

    // Validate the data
    if (!data || !data.content || !data.note) {
      throw new Error('Invalid response from 金山词霸 API')
    }

    // Return the data with success flag
    return res.status(200).json({
      content: data.content,
      translation: data.note,
      author: data.author || 'Daily English',
      picture: data.picture,
      source: '金山词霸',
      timestamp: new Date().toISOString(),
      fallback: false
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
      error: error.message
    })
  }
}
