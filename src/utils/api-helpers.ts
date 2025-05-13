/**
 * API Helper functions for fetching data from external APIs
 * Provides fallback for local development
 */

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Base URL for API calls
const getApiBaseUrl = () => {
  // In development, use relative paths
  // In production, use the deployed Vercel functions
  return isDevelopment ? '' : ''
}

/**
 * Fetch weather data from QWeather API
 * In development, returns mock data
 */
export async function fetchWeatherData() {
  try {
    if (isDevelopment) {
      // Mock data for development
      return {
        code: '200',
        now: {
          temp: '23',
          text: '晴朗',
          icon: '100',
          windDir: '东南风',
          windScale: '3',
          humidity: '65',
        },
      }
    }

    // In production, call the actual API
    const response = await fetch(`${getApiBaseUrl()}/api/weather`)
    return await response.json()
  }
  catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

/**
 * Fetch location data based on IP
 * In development, returns mock data
 */
export async function fetchLocationData() {
  try {
    if (isDevelopment) {
      // Mock data for development
      return {
        city: '北京',
        region: '北京市',
        country: '中国',
        latitude: 39.9042,
        longitude: 116.4074,
      }
    }

    // In production, call the actual API
    const response = await fetch(`${getApiBaseUrl()}/api/location`)
    return await response.json()
  }
  catch (error) {
    console.error('Error fetching location data:', error)
    throw error
  }
}

/**
 * Fetch daily quote from 金山词霸 API
 * In development, returns mock data
 */
export async function fetchDailyQuote() {
  try {
    if (isDevelopment) {
      // Mock data for development
      return {
        content: 'The best way to predict the future is to invent it.',
        translation: '预测未来的最好方法就是创造未来。',
        author: 'Alan Kay',
        picture: 'https://cdn.iciba.com/www/img/daily-pic.jpg',
      }
    }

    // In production, call the actual API
    const response = await fetch(`${getApiBaseUrl()}/api/daily-quote`)
    return await response.json()
  }
  catch (error) {
    console.error('Error fetching daily quote:', error)
    throw error
  }
}
