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
 * Fetch weather data from QWeather API with caching
 * In development, returns mock data
 */
export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    // Check if we have valid cached data
    const cachedData = getFromCache<WeatherData>(CACHE_KEYS.WEATHER)

    if (isCacheValid(cachedData, CACHE_EXPIRY.WEATHER)) {
      return cachedData.data
    }

    // If no valid cache or in development mode, fetch new data
    let weatherData: WeatherData

    if (isDevelopment) {
      // Mock data for development
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
    } else {
      // In production, call the actual API
      const response = await fetch(`${getApiBaseUrl()}/api/weather`)
      weatherData = await response.json()
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
    if (cachedData) {
      return cachedData.data
    }

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
 * In development, returns mock data
 */
export async function fetchLocationData(): Promise<LocationData> {
  try {
    // Check if we have valid cached data
    const cachedData = getFromCache<LocationData>(CACHE_KEYS.LOCATION)

    if (isCacheValid(cachedData, CACHE_EXPIRY.LOCATION)) {
      return cachedData.data
    }

    // If no valid cache or in development mode, fetch new data
    let locationData: LocationData

    if (isDevelopment) {
      // Mock data for development
      locationData = {
        city: '北京',
        region: '北京市',
        country: '中国',
        latitude: 39.9042,
        longitude: 116.4074,
      }
    } else {
      // In production, call the actual API
      const response = await fetch(`${getApiBaseUrl()}/api/location`)
      locationData = await response.json()
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
    if (cachedData) {
      return cachedData.data
    }

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
 * Fetch daily quote from 金山词霸 API with caching
 * In development, returns mock data
 */
export async function fetchDailyQuote(): Promise<DailyQuote> {
  try {
    // Check if we have valid cached data
    const cachedData = getFromCache<DailyQuote>(CACHE_KEYS.DAILY_QUOTE)

    if (isCacheValid(cachedData, CACHE_EXPIRY.DAILY_QUOTE)) {
      return cachedData.data
    }

    // If no valid cache or in development mode, fetch new data
    let quoteData: DailyQuote

    if (isDevelopment) {
      // Mock data for development
      quoteData = {
        content: 'The best way to predict the future is to invent it.',
        translation: '预测未来的最好方法就是创造未来。',
        author: 'Alan Kay',
        picture: 'https://cdn.iciba.com/www/img/daily-pic.jpg',
      }
    } else {
      // In production, call the actual API
      const response = await fetch(`${getApiBaseUrl()}/api/daily-quote`)
      quoteData = await response.json()
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
    if (cachedData) {
      return cachedData.data
    }

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
    } else {
      // Clear all API caches
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    }
  } catch (error) {
    console.warn('Failed to clear API cache:', error)
  }
}