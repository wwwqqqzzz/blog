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

// 和风天气API配置
const QWEATHER_API_KEY = '80ce7424f8d34974af05d092792c123a'
const QWEATHER_API_BASE_URL = 'https://devapi.qweather.com/v7'

// 金山词霸API配置
const ICIBA_API_URL = 'https://open.iciba.com/dsapi/'

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
 * Directly fetch weather data from QWeather API
 * @param location Location code, default is 101010100 (Beijing)
 */
async function fetchQWeatherDirectly(location: string = '101010100'): Promise<WeatherData> {
  try {
    const apiUrl = `${QWEATHER_API_BASE_URL}/weather/now?location=${location}&key=${QWEATHER_API_KEY}`

    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`)
    }

    return await response.json()
  }
  catch (error) {
    console.warn('Error directly fetching QWeather data:', error)
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

    // If no valid cache, fetch new data
    let weatherData: WeatherData

    try {
      if (isDevelopment) {
        // In development, call the QWeather API directly
        weatherData = await fetchQWeatherDirectly()
      }
      else {
        // In production, call through our API proxy
        const response = await fetch(`${getApiBaseUrl()}/api/weather`)
        weatherData = await response.json()
      }
    }
    catch (fetchError) {
      console.warn('Error fetching from primary source, trying fallback:', fetchError)

      // If direct API call fails in development, try the API proxy as fallback
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/weather`)
        weatherData = await response.json()
      }
      catch (fallbackError) {
        console.warn('Fallback also failed, using default data:', fallbackError)

        // If all API calls fail, use fallback data
        weatherData = {
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
        temp: '23',
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
 * Fetch location data based on IP with caching
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

    // If no valid cache, fetch new data
    let locationData: LocationData

    try {
      // Call the actual API in both development and production
      const response = await fetch(`${getApiBaseUrl()}/api/location`)
      locationData = await response.json()
    }
    catch (fetchError) {
      console.warn('Error fetching location data, using fallback:', fetchError)

      // Use fallback data if API call fails
      locationData = {
        city: '北京',
        region: '北京市',
        country: '中国',
        latitude: 39.9042,
        longitude: 116.4074,
      }
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
    return {
      city: '北京',
    }
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
 * Directly fetch daily quote from 金山词霸 API
 */
async function fetchIcibaQuoteDirectly(): Promise<DailyQuote> {
  try {
    const response = await fetch(ICIBA_API_URL)
    if (!response.ok) {
      throw new Error(`Iciba API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return {
      content: data.content,
      translation: data.note,
      author: data.author || 'Daily English',
      picture: data.picture,
    }
  }
  catch (error) {
    console.warn('Error directly fetching Iciba quote data:', error)
    throw error
  }
}

/**
 * Fetch daily quote from 金山词霸 API with caching
 * Uses real-time data in both development and production
 */
export async function fetchDailyQuote(): Promise<DailyQuote> {
  try {
    // Check if we have valid cached data
    const cachedData = getFromCache<DailyQuote>(CACHE_KEYS.DAILY_QUOTE)

    if (isCacheValid(cachedData, CACHE_EXPIRY.DAILY_QUOTE)) {
      const data = safeGetCachedData(cachedData)
      if (data) return data
    }

    // If no valid cache, fetch new data
    let quoteData: DailyQuote

    try {
      if (isDevelopment) {
        // In development, call the 金山词霸 API directly
        quoteData = await fetchIcibaQuoteDirectly()
      }
      else {
        // In production, call through our API proxy
        const response = await fetch(`${getApiBaseUrl()}/api/daily-quote`)
        quoteData = await response.json()
      }
    }
    catch (fetchError) {
      console.warn('Error fetching from primary source, trying fallback:', fetchError)

      // If direct API call fails in development, try the API proxy as fallback
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/daily-quote`)
        quoteData = await response.json()
      }
      catch (fallbackError) {
        console.warn('Fallback also failed, using default data:', fallbackError)

        // If all API calls fail, use fallback data
        quoteData = {
          content: 'The best way to predict the future is to invent it.',
          translation: '预测未来的最好方法就是创造未来。',
          author: 'Alan Kay',
          picture: 'https://cdn.iciba.com/www/img/daily-pic.jpg',
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
