// Vercel Serverless Function for QWeather API
// This function proxies requests to the QWeather API to avoid CORS issues
// and to keep the API key secure

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
    // QWeather API key
    const apiKey = '80ce7424f8d34974af05d092792c123a' // 和风天气API key

    // Get location from query parameters or use default (Beijing)
    const location = req.query.location || '101010100' // Default to Beijing

    // Build the API URL
    const apiUrl = `https://devapi.qweather.com/v7/weather/now?location=${location}&key=${apiKey}`

    // Fetch data from QWeather API
    const response = await fetch(apiUrl)
    const data = await response.json()

    // Return the data
    return res.status(200).json(data)
  }
  catch (error) {
    console.error('Error fetching weather data:', error)
    return res.status(500).json({ error: 'Failed to fetch weather data' })
  }
}
