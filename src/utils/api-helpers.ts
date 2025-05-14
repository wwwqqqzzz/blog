/**
 * API Helper functions for fetching data from external APIs
 * Provides fallback for local development and implements caching
 */

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Base URL for API calls
const getApiBaseUrl = () => {
  // In development, use relative paths
  // In production, use the deployed Vercel functions
  return isDevelopment ? '' : ''
}

// 默认位置配置
const DEFAULT_LOCATION = {
  city: '南京',
  region: '江苏省',
  country: '中国',
  latitude: 32.0584,
  longitude: 118.7965,
}

/**
 * Cache configuration
 */
const CACHE_KEYS = {
  WEATHER: 'cached_weather_data',
  LOCATION: 'cached_location_data',
  DAILY_QUOTE: 'cached_daily_quote',
}

const CACHE_EXPIRY = {
  WEATHER: 30 * 60 * 1000, // 30 minutes in milliseconds
  LOCATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  DAILY_QUOTE: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
}

/**
 * Generic cache interface
 */
interface CachedData<T> {
  data: T
  timestamp: number
}

/**
 * Check if cached data is still valid
 */
function isCacheValid<T>(cachedData: CachedData<T> | null, expiryTime: number): boolean {
  if (!cachedData) return false

  const now = Date.now()
  const isExpired = now - cachedData.timestamp > expiryTime

  return !isExpired
}

/**
 * Safely get data from cache with null check
 */
function safeGetCachedData<T>(cachedData: CachedData<T> | null): T | null {
  return cachedData ? cachedData.data : null
}

/**
 * Get data from cache
 */
function getFromCache<T>(key: string): CachedData<T> | null {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') return null

    const cachedItem = localStorage.getItem(key)
    if (!cachedItem) return null

    return JSON.parse(cachedItem) as CachedData<T>
  }
  catch (error) {
    // If there's any error reading from cache, return null
    return null
  }
}

/**
 * Save data to cache
 */
function saveToCache<T>(key: string, data: T): void {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    const cacheItem: CachedData<T> = {
      data,
      timestamp: Date.now(),
    }

    localStorage.setItem(key, JSON.stringify(cacheItem))
  }
  catch (error) {
    // Silently fail if we can't save to cache
    console.warn('Failed to save data to cache:', error)
  }
}

/**
 * Weather data interface
 */
interface WeatherData {
  code: string
  now: {
    temp: string
    text: string
    icon: string
    windDir?: string
    windScale?: string
    humidity?: string
  }
}

/**
 * Fetch weather data from QWeather API via proxy
 * @param location Location code, default is 101190101 (Nanjing)
 */
async function fetchQWeatherDirectly(location: string = '101190101'): Promise<WeatherData> {
  try {
    // Always use our API proxy instead of direct API calls to avoid CORS and API key issues
    const response = await fetch(`${getApiBaseUrl()}/api/weather?location=${location}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`)
    }

    return await response.json()
  }
  catch (error) {
    console.warn('Error fetching QWeather data via proxy:', error)
    throw error
  }
}

/**
 * Fetch weather data from QWeather API with caching
 * Uses real-time data in both development and production
 */
export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    // Check if we have valid cached data
    const cachedData = getFromCache<WeatherData>(CACHE_KEYS.WEATHER)

    if (isCacheValid(cachedData, CACHE_EXPIRY.WEATHER)) {
      const data = safeGetCachedData(cachedData)
      if (data) return data
    }

    // Get location data first to determine the correct city
    let cityCode = '101190101' // Default to Nanjing
    try {
      const locationData = await fetchLocationData()
      if (locationData && locationData.city) {
        // Convert city name to code
        cityCode = await getCityCode(locationData.city)
      }
    }
    catch (locationError) {
      console.warn('Error getting location for weather:', locationError)
    }

    // If no valid cache, fetch new data
    let weatherData: WeatherData

    try {
      // Always use our API proxy in both development and production
      weatherData = await fetchQWeatherDirectly(cityCode)
    }
    catch (fetchError) {
      console.warn('Error fetching from primary source, trying fallback:', fetchError)

      // If direct API call fails in development, try the API proxy as fallback
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/weather?location=${cityCode}`)
        weatherData = await response.json()
      }
      catch (fallbackError) {
        console.warn('Fallback also failed, using default data:', fallbackError)

        // If all API calls fail, use fallback data
        weatherData = {
          code: '200',
          now: {
            temp: '25',
            text: '晴朗',
            icon: '100',
            windDir: '东南风',
            windScale: '3',
            humidity: '65',
          },
        }
      }
    }

    // Save the new data to cache (only if it's valid)
    if (weatherData && weatherData.code === '200' && weatherData.now) {
      saveToCache(CACHE_KEYS.WEATHER, weatherData)
    }

    return weatherData
  }
  catch (error) {
    console.warn('Error fetching weather data:', error)

    // Try to return cached data even if expired
    const cachedData = getFromCache<WeatherData>(CACHE_KEYS.WEATHER)
    const data = safeGetCachedData(cachedData)
    if (data) return data

    // If no cached data available, return fallback data
    return {
      code: '200',
      now: {
        temp: '25',
        text: '晴朗',
        icon: '100',
      },
    }
  }
}

/**
 * Location data interface
 */
interface LocationData {
  city: string
  region?: string
  country?: string
  latitude?: number
  longitude?: number
}

/**
 * Get location from browser geolocation API
 */
async function getBrowserGeolocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator || !navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get city name from coordinates
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
          )

          if (!response.ok) {
            throw new Error('Failed to get location name')
          }

          const data = await response.json()

          // Extract location information
          const city = data.address.city
            || data.address.town
            || data.address.village
            || data.address.county
            || 'Unknown'
          const region = data.address.state || data.address.region || ''
          const country = data.address.country || ''

          resolve({
            city,
            region,
            country,
            latitude,
            longitude,
          })
        }
        catch (error) {
          console.warn('Error in reverse geocoding:', error)
          resolve(null)
        }
      },
      (error) => {
        console.warn('Geolocation error:', error)
        resolve(null)
      },
      { timeout: 5000, enableHighAccuracy: false },
    )
  })
}

/**
 * Convert city name to QWeather location code via proxy
 * @param city City name
 */
async function getCityCode(city: string): Promise<string> {
  try {
    // Use our API proxy to get city code
    const response = await fetch(`${getApiBaseUrl()}/api/geo?location=${encodeURIComponent(city)}`)

    if (!response.ok) {
      throw new Error(`Geo API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.code === '200' && data.location && data.location.length > 0) {
      return data.location[0].id
    }

    throw new Error('No location found')
  }
  catch (error) {
    console.warn('Error getting city code:', error)
    // Default to Nanjing
    return '101190101' // Nanjing city code
  }
}

/**
 * Fetch location data with caching and geolocation
 * Uses real data in both development and production
 */
export async function fetchLocationData(): Promise<LocationData> {
  try {
    // Check if we have valid cached data
    const cachedData = getFromCache<LocationData>(CACHE_KEYS.LOCATION)

    if (isCacheValid(cachedData, CACHE_EXPIRY.LOCATION)) {
      const data = safeGetCachedData(cachedData)
      if (data) return data
    }

    // Try browser geolocation first
    const geoLocation = await getBrowserGeolocation()
    if (geoLocation) {
      // Save the geolocation data to cache
      saveToCache(CACHE_KEYS.LOCATION, geoLocation)
      return geoLocation
    }

    // If geolocation fails, try IP-based location
    let locationData: LocationData

    try {
      // Call the actual API in both development and production
      const response = await fetch(`${getApiBaseUrl()}/api/location`)
      locationData = await response.json()
    }
    catch (fetchError) {
      console.warn('Error fetching location data, using fallback:', fetchError)

      // Use fallback data if API call fails (South Nanjing)
      locationData = DEFAULT_LOCATION
    }

    // Save the new data to cache (only if it's valid)
    if (locationData && locationData.city) {
      saveToCache(CACHE_KEYS.LOCATION, locationData)
    }

    return locationData
  }
  catch (error) {
    console.warn('Error fetching location data:', error)

    // Try to return cached data even if expired
    const cachedData = getFromCache<LocationData>(CACHE_KEYS.LOCATION)
    const data = safeGetCachedData(cachedData)
    if (data) return data

    // If no cached data available, return fallback data
    return DEFAULT_LOCATION
  }
}

/**
 * Daily quote interface
 */
interface DailyQuote {
  content: string
  translation: string
  author: string
  picture?: string
}

/**
 * Fetch daily quote from API proxy
 * This avoids CORS issues with direct API calls
 */
async function fetchIcibaQuoteDirectly(): Promise<DailyQuote> {
  return new Promise((resolve, reject) => {
    try {
      // Always use API proxy to avoid CORS issues
      // In development, use local API proxy
      // In production, we'll use a fallback strategy if this fails
      const apiUrl = `${getApiBaseUrl()}/api/daily-quote`

      console.log('Fetching daily quote from API proxy:', apiUrl)

      fetch(apiUrl, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Daily quote API responded with status: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          // Log the data to see what we're getting
          console.log('Daily quote data:', data)

          // Handle different API response formats
          // Direct API call returns { content, note, ... }
          // Our proxy returns { content, translation, ... }
          resolve({
            content: data.content,
            translation: data.translation || data.note,
            author: data.author || 'Daily English',
            picture: data.picture || data.fenxiang_img,
          })
        })
        .catch((error) => {
          console.warn('Error fetching daily quote data:', error)
          reject(error)
        })
    }
    catch (error) {
      console.warn('Error setting up daily quote fetch:', error)
      reject(error)
    }
  })
}

/**
 * Fetch daily quote from 金山词霸 API with caching
 * Uses real-time data in both development and production
 */
export async function fetchDailyQuote(): Promise<DailyQuote> {
  try {
    // Always clear cache to ensure we get fresh data
    // This is temporary for debugging
    clearApiCache(CACHE_KEYS.DAILY_QUOTE)

    // Disabled cache check for now to ensure we always get fresh data
    // const cachedData = getFromCache<DailyQuote>(CACHE_KEYS.DAILY_QUOTE)
    // if (isCacheValid(cachedData, CACHE_EXPIRY.DAILY_QUOTE)) {
    //   const data = safeGetCachedData(cachedData)
    //   if (data) return data
    // }

    // Fetch new data
    let quoteData: DailyQuote

    try {
      // Use the same approach in both development and production
      quoteData = await fetchIcibaQuoteDirectly()
    }
    catch (fetchError) {
      console.warn('Error fetching daily quote, trying fallback:', fetchError)

      // Try a different approach as fallback - use static data
      try {
        console.log('Using static data as fallback')

        // Instead of trying to use CORS proxies which may also fail,
        // let's use a set of high-quality static quotes
        const staticQuotes = [
          {
            content: 'The best way to predict the future is to invent it.',
            translation: '预测未来的最好方法就是创造未来。',
            author: 'Alan Kay',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
          },
          {
            content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
            translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
            author: 'Winston Churchill',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-2.jpg',
          },
          {
            content: 'Life is what happens when you\'re busy making other plans.',
            translation: '生活就是当你忙于制定其他计划时发生的事情。',
            author: 'John Lennon',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-3.jpg',
          },
          {
            content: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
            translation: '生活中最大的荣耀不在于永不跌倒，而在于每次跌倒后都能爬起来。',
            author: 'Nelson Mandela',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-4.jpg',
          },
        ]

        // Get today's date to select a quote (ensures the same quote is shown all day)
        const today = new Date()
        const startOfYear = new Date(today.getFullYear(), 0, 0)
        const diff = today.getTime() - startOfYear.getTime()
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
        const index = dayOfYear % staticQuotes.length

        // Make sure we have at least one quote
        if (staticQuotes.length === 0) {
          staticQuotes.push({
            content: 'The best way to predict the future is to invent it.',
            translation: '预测未来的最好方法就是创造未来。',
            author: 'Alan Kay',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
          })
        }

        // Use today's quote with safety check
        const selectedQuote = staticQuotes[index] || staticQuotes[0]

        // Create a new object with default values to satisfy TypeScript
        quoteData = {
          content: selectedQuote?.content || 'The best way to predict the future is to invent it.',
          translation: selectedQuote?.translation || '预测未来的最好方法就是创造未来。',
          author: selectedQuote?.author || 'Alan Kay',
          picture: selectedQuote?.picture,
        }
        console.log('Using static quote for today:', quoteData)
      }
      catch (fallbackError) {
        console.warn('Fallback also failed, using random quote:', fallbackError)

        // If all API calls fail, use a random fallback quote
        const fallbackQuotes = [
          {
            content: 'The best way to predict the future is to invent it.',
            translation: '预测未来的最好方法就是创造未来。',
            author: 'Alan Kay',
            picture: 'https://cdn.iciba.com/www/img/daily-pic.jpg',
          },
          {
            content: 'Success is not final, failure is not fatal: It is the courage to continue that counts.',
            translation: '成功不是终点，失败也不是致命的：重要的是继续前进的勇气。',
            author: 'Winston Churchill',
            picture: 'https://cdn.iciba.com/www/img/daily-pic.jpg',
          },
          {
            content: 'Life is what happens when you\'re busy making other plans.',
            translation: '生活就是当你忙于制定其他计划时发生的事情。',
            author: 'John Lennon',
            picture: 'https://cdn.iciba.com/www/img/daily-pic.jpg',
          },
          {
            content: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
            translation: '生活中最大的荣耀不在于永不跌倒，而在于每次跌倒后都能爬起来。',
            author: 'Nelson Mandela',
            picture: 'https://cdn.iciba.com/www/img/daily-pic.jpg',
          },
        ]

        // Make sure we have at least one quote
        if (fallbackQuotes.length === 0) {
          fallbackQuotes.push({
            content: 'The best way to predict the future is to invent it.',
            translation: '预测未来的最好方法就是创造未来。',
            author: 'Alan Kay',
            picture: 'https://cdn.jsdelivr.net/gh/wwwqqqzzz/Image/img/quote-bg-1.jpg',
          })
        }

        // Select a random quote with safety check
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length)
        const selectedFallbackQuote = fallbackQuotes[randomIndex] || fallbackQuotes[0]

        // Create a new object with default values to satisfy TypeScript
        quoteData = {
          content: selectedFallbackQuote?.content || 'The best way to predict the future is to invent it.',
          translation: selectedFallbackQuote?.translation || '预测未来的最好方法就是创造未来。',
          author: selectedFallbackQuote?.author || 'Alan Kay',
          picture: selectedFallbackQuote?.picture,
        }
      }
    }

    // Save the new data to cache (only if it's valid)
    if (quoteData && quoteData.content && quoteData.translation) {
      saveToCache(CACHE_KEYS.DAILY_QUOTE, quoteData)
    }

    return quoteData
  }
  catch (error) {
    console.warn('Error fetching daily quote:', error)

    // Try to return cached data even if expired
    const cachedData = getFromCache<DailyQuote>(CACHE_KEYS.DAILY_QUOTE)
    const data = safeGetCachedData(cachedData)
    if (data) return data

    // If no cached data available, return fallback data
    return {
      content: 'The best way to predict the future is to invent it.',
      translation: '预测未来的最好方法就是创造未来。',
      author: 'Alan Kay',
    }
  }
}

/**
 * Clear specific or all API caches
 * @param cacheKey Optional specific cache to clear, if not provided all caches will be cleared
 */
export function clearApiCache(cacheKey?: string): void {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    if (cacheKey) {
      localStorage.removeItem(cacheKey)
    }
    else {
      // Clear all API caches
      Object.values(CACHE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    }
  }
  catch (error) {
    console.warn('Failed to clear API cache:', error)
  }
}
