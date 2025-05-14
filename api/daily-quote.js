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

    // Fetch data from 金山词霸 API
    const response = await fetch(apiUrl)
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
    return res.status(500).json({ error: 'Failed to fetch daily quote' })
  }
}
